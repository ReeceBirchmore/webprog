
'use strict';

import EditCard from '/Components/Card/editcard.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import SettingsCard from '/Components/Card/settingscard.js';

import { $, createToast, renderText, html, pointer } from '/Javascript/render.js';


// #endregion
// ////////////////////////////////////////////////////////////// DECLARATIONS
// #region Declare variables

let id; // Questionnaire ID
let questionnaireData; // Data on the questionnaire
let questionData; // Data on the questions
let modifiedQuestionObject; // Data on the modified question=
const modifiedQuestionsArr = { arr: [] }; // Final object array to store the modified data
const object = {}; // New object to put modified data into
let questionNumber = 1; // Keep track of the question numbers
let errorFlag = false; // Allow for error detection


/******************************************************************************
*
* This function will handle generating the main structure of the page
*
* 1) Set the UID to the passed questionnaireID
* 2) Reset the variables (to prevent unintended buildup)
* 3) Generate a screen
* 4) Run the gatherDetails(); function
*
*******************************************************************************/

export function buildEditor(questionnaireID) {
  // Reset all the main variables to prevent buildup
  id = questionnaireID;
  questionNumber = 1;
  questionnaireData = [];
  questionData = [];
  modifiedQuestionsArr.arr = [];

  const screen = new Screen({
    id: 'edit-screen',
    class: 'noFooter',
  });
  if ($('Footer')) $('Footer').remove();
  gatherDetails(id);
}


/******************************************************************************
*
* This function will handle gathering all the data required for the page to
* operate
*
* 1) Perform a GET request to gather data on the current questionnaire
* 2) IF the responses is okay, and the responses length is not 0, proceed
* 3) Perform a GET request to gather the data for all the questions in the
*   questionnaire
* 4) IF responses is okay, set questionData to the retrieved object
* 5) Run the deployCards(); function to start displaying cards on the screen
* 6) Generate the Nav, title will be the questionnaire title, with the action
*    buttons set to 'Return' and 'Save', with appropriate actions for both
*
******************************************************************************/

async function gatherDetails(quizid) {
  const questionnaire = await fetch('/api/quizzes/' + quizid);
  if (questionnaire.ok) {
    questionnaireData = await questionnaire.json();
    if (questionnaireData.length === 0) {
      createToast('Invalid Questionnaire ID', true);
      return;
    }
  } else {
    createToast('Invalid Questionnaire ID', true);
  }
  // Grab the questions
  const question = await fetch('/api/questions/' + id);
  if (question.ok) {
    questionData = await question.json();
    deployCards();
  } else {
    createToast('Failed to Load Questions', true);
  }
  const nav = new Nav({
    id: 'nav',
    title: (questionnaireData.length !== 0) ? 'Edit ' + questionnaireData[0].title : 'Invalid Quiz',
    icons: ['return', 'save'],
    actions: [function () { window.location = './#/admin'; }, function () { saveQuestionnaire(); }],
    elevated: true,
  });
}


/******************************************************************************
*
* This function will handle creating an object for the passed through
* questionnaire and question data. These objects are needed to store the modified
* data for upload should the user wish to save.
*
* 1) Deploy a settings card (For the questionnaire settings)
* 2) Create an object (object) for the questionnaire data
* 3) Loop through the questionData and create a new object for each question
* 4) Push the new object into an array (arrOfQuestionnaire)
* 5) Generate a new card, containing all details gathered from the questionData
*    response. The EditCard.js file will handle this data
* 6) Create a new Button to allow for adding questions
*
******************************************************************************/

function deployCards() {
  const quizSettingsCard = new SettingsCard({
    id: 'settings-card',
    title: questionnaireData[0].title,
    enabled: questionnaireData[0].enabled,
    restricted: questionnaireData[0].restrict,
    allowBack: questionnaireData[0].allowback,
  });
  modifiedQuestionObject = Object.create(object);
  modifiedQuestionObject.id = questionnaireData[0].quizid;
  modifiedQuestionObject.quiztitle = questionnaireData[0].title; // Title of the questionnaire
  modifiedQuestionObject.enabled = questionnaireData[0].enabled; // Enable the questionnaire
  modifiedQuestionObject.restricted = questionnaireData[0].restrict; // restrict submissions
  modifiedQuestionObject.allowback = questionnaireData[0].allowback; // Allow the back button
  modifiedQuestionsArr.arr.push(modifiedQuestionObject);

  // Prefabricating an object to store the edited questions
  questionData.forEach(question => {
    modifiedQuestionObject = Object.create(object);
    modifiedQuestionObject.title = question.question; // Title of the question
    modifiedQuestionObject.type = question.input; // Input type of the question
    modifiedQuestionObject.id = parseInt(question.id); // ID of the question
    modifiedQuestionObject.options = (question.options === null) ? null : question.options; // Options for the question
    console.log(question.options)
    modifiedQuestionObject.min = (question.min === null) ? 0 : parseInt(question.min);
    modifiedQuestionObject.max = (question.max === null) ? 0 : parseInt(question.max);
    modifiedQuestionObject.required = question.required;
    modifiedQuestionObject.deleted = false;
    modifiedQuestionsArr.arr.push(modifiedQuestionObject);

    // Generate a card for each question
    // The card contains all the inputs and components
    const card = new EditCard({
      id: 'card-' + question.id,
      title: question.question,
      questionNum: questionNumber++,
      input: question.input,
      qid: question.id,
      options: question.options,
      required: question.required,
      min: question.min,
      max: question.max,
      deleted: false,
    });
  });

  // Generate a Button to add a new question
  const button = new Button({
    id: 'add-question',
    icon: 'plus',
    action: function () { addQuestion(); },
    class: 'fab',
  });
}


/******************************************************************************
*
* This function handles changing the questions type, upon a
* change in question type, the relevant inputs will appear
* for further customisation.
*
* The function can be broken down as such:
* 1) Function is called with the ID of the question as a parameter
* 2) Check to see where the ID is inside the modifiedQuestionsArr object array
* 3) Modify the objects type value to match the new selection
*
* The switch statement broken down:
*
* 1) First, create a group for the new inputs (for easier removal)
*    - If the group is already there, delete it and recreate it
* 2) Determine which input type was selected
* 3) Run the relevant functions
*
* // NOTE: If the user switches from a MULTIPLE optioned question to a SINGLE
*          input question, the options array will be WIPED
*
******************************************************************************/

export function changeQuestionType(id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(option => option.id === parseInt(id));
  modifiedQuestionsArr.arr[inputIndex].type = $('selector-' + id).value;
  $('group-' + id).setAttribute('data-type', $('selector-' + id).value);
  modifyInputGroup(id);
  switch ($('selector-' + id).value) {
    case 'text':
      if ($('options-' + id)) $('card-' + id).removeChild($('options-' + id));
      modifiedQuestionsArr.arr[inputIndex].options = null;
      break;

    case 'number':
      if ($('options-' + id)) $('card-' + id).removeChild($('options-' + id));
      modifiedQuestionsArr.arr[inputIndex].options = null;
      numberType(id);
      break;

    case 'single-select':
    case 'multi-select':
      const multiGroup = html('div', 'options-' + id, $('card-' + id), 'option_group');
      multiType(id);
      break;

    case 'range':
      modifiedQuestionsArr.arr[inputIndex].options = null;
      // rangeType(id);
      break;
  }
}


/******************************************************************************
*
* The below function handles modifying the input type when the
* dropdown menu detects a change in selection
*
* 1) Detect if the new type is of multi or single choice, if it is NOT
*    - Remove the options group (containing the multiple options)
* 3) Append the new input group
*
* The reasoning behind this method is so that when switching from multi-select
* to single-select, the list of options you have created is NOT wiped away
*
******************************************************************************/

function modifyInputGroup(id) {
  if ($('group-' + id).dataset.type !== 'multi-select' || $('group-' + id).dataset.type !== 'single-select') {
    if ($('group-' + id)) $('card-' + id).removeChild($('group-' + id));
  }
  if (!$('group-' + id)) {
    const group = html('div', 'group-' + id, '', '');
    $('card-' + id).insertBefore(group, $('options-' + id));
  }
}


/******************************************************************************
*
* This function will trigger whenever the Number selection is
* detected
*
* 1) Detect if the original min/max inputs are on the screen
*    if they arent, render them on.
*
* Then we add the event listeners to ensure we can add the min and max values
*
******************************************************************************/

function numberType(id) {
  if (!$('min-' + id)) {
    const min = new Input({
      id: 'min-' + id,
      placeholder: 'Enter Min',
      type: 'number',
      renderPoint: $('group-' + id),
      eventListeners: false,
    });
    const max = new Input({
      id: 'max-' + id,
      placeholder: 'Enter Max',
      type: 'number',
      renderPoint: $('group-' + id),
      eventListeners: false,
    });

    min.addEventListener('input', function (e) {
      changeMinValue(parseInt($('min-' + id).value), parseInt(id));
    });

    max.addEventListener('input', function (e) {
      changeMaxValue(parseInt($('max-' + id).value), parseInt(id));
    });
  }
}


/******************************************************************************
*
* This function is triggered whenever a multiple option type
* selection is detected
*
* 1) Check if the input is already visible, if not, append.
* 2) Attach the event listeners to the new input
*
* The event listeners will allow for the user to enter an option
* and press the enter button to submit it as an option.
*
* 1) Detect if the enter key has been pressed
* 2) Run the addOption function (to add the new value to the end of the options
*    array relative to the question)
*    - IF the addOption returns true (Value isn't a duplicate) proceed, else, stop
* 3) Search through the edited questions array, find the questions
*    index
* 4) Use this index to then search through the array of options
*    within the object and find the index
* 5) Create a new object, give the object the ID found in step 4
* 6) Append the value to the new element
* 7) Clear the input ready for the next value
*
*
******************************************************************************/

function multiType(id) {
  if (!$('optionInput-' + id)) {
    const optionInput = new Input({
      id: 'optionInput-' + id,
      placeholder: 'Enter options',
      type: 'text',
      renderPoint: $('group-' + id),
      eventListeners: false,
    });
    renderText($('group-' + id), pointer + ' options to delete', 'p', '', 'subtext');
    optionInput.addEventListener('keydown', function (e) {
      const parsedID = parseInt(id);
      if (e.key === 'Enter') {
        if (addOption($('optionInput-' + id).value, id) === true) {
          const findQuestion = modifiedQuestionsArr.arr.findIndex(id => id.id === parsedID);
          const optionArrPos = modifiedQuestionsArr.arr[findQuestion].options.findIndex(option => option === $('optionInput-' + id).value);
          const newOption = html('div', 'options-' + id + '-option-' + optionArrPos, $('options-' + id), 'option_row');
          renderText(newOption, $('optionInput-' + id).value, 'p', '', 'option_text');
          removeOptionEventListeners(id, optionArrPos, $('optionInput-' + id).value);
          $('optionInput-' + id).value = '';
        }
      }
    });
  }
}


/******************************************************************************
 *
 * This function is triggered whenever the user presses a delete button
 * It will darken the question to prep it for deletion, allowing the user to
 * undo the option if they wish to
 *
 * It will flag the cards appropriate object.deleted boolean to match whether
 * the user is about to delete, once the quiz submits it will remain deleted
 *
 ******************************************************************************/

export function deleteQuestion(id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(value => value.id === id);
  if (modifiedQuestionsArr.arr[inputIndex].deleted === false) {
    modifiedQuestionsArr.arr[inputIndex].deleted = true;
  } else {
    modifiedQuestionsArr.arr[inputIndex].deleted = false;
  }
}


/******************************************************************************
 *
 * This function is triggered whenever the new question button is triggered
 *
 * 1) Perform a GET request to get the ID for the new question
 * 2) IF the response is okay, create a new EditCard with all relevant prop tags
 * 3) Create a new object for the question and push into the arrOfQuestionnaire
 *    array
 *
 ******************************************************************************/

async function addQuestion() {
  const newQuestionID = await fetch('/api/create/question/' + id);
  if (newQuestionID.ok) {
    const id = await newQuestionID.json();
    const card = new EditCard({
      id: 'card-' + id[0].id,
      title: 'New Question',
      questionNum: questionNumber++,
      options: null,
      input: 'text',
      qid: id[0].id,
      min: null,
      max: null,
      required: false,
      deleted: false,
    });
    modifiedQuestionObject = Object.create(object);
    modifiedQuestionObject.title = 'New Question'; // Title of the question
    modifiedQuestionObject.type = 'text'; // Input type of the question
    modifiedQuestionObject.id = parseInt(id[0].id, 10); // ID of the question
    modifiedQuestionObject.options = null; // Options for the question
    modifiedQuestionObject.min = parseInt(0);
    modifiedQuestionObject.max = parseInt(0);
    modifiedQuestionObject.required = false;
    modifiedQuestionObject.deleted = false;
    modifiedQuestionsArr.arr.push(modifiedQuestionObject);
  }
}


/******************************************************************************
 *
 * These functions are triggered whenever the user edits the Min/Max constraints
 *
 * 1) Find the edited questions object in the arrOfQuestionnaire Array
 * 2) Check if the value in the box is correct compared to the other
 * 3) IF incorrect, enable errorFlag (disables saving until remedied)
 * 4) IF correct, store new values in arrOfQuestionnaire array object
 *
 ******************************************************************************/

export function changeMinValue(value, id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(value => value.id === id);
  if (parseInt($('max-' + id).value) < parseInt($('min-' + id).value)) {
    errorFlag = true;
    createToast('Min Must Be Lower than Max', true);
  } else {
    errorFlag = false;
    modifiedQuestionsArr.arr[inputIndex].min = parseInt($('min-' + id).value);
  }
}

export function changeMaxValue(value, id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(value => value.id === id);
  if (parseInt($('max-' + id).value) < parseInt($('min-' + id).value)) {
    createToast('Max Must Be Greater Than Min', true);
    errorFlag = true;
  } else {
    errorFlag = false;
    modifiedQuestionsArr.arr[inputIndex].max = parseInt($('max-' + id).value);
  }
}


/******************************************************************************
 *
 * This function is triggered whenever the user toggles the required toggle
 *
 ******************************************************************************/

export function changeRequired(value, id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(title => title.id === parseInt(id));
  $('text-' + id).style.color = (value === true) ? 'black' : '#AAA5AF';
  modifiedQuestionsArr.arr[inputIndex].required = value;
}


/******************************************************************************
 *
 * This function is triggered whenever the user modifies a question title
 *
 ******************************************************************************/

export function changeQuestionTitle(value, id) {
  const inputIndex = modifiedQuestionsArr.arr.findIndex(title => title.id === parseInt(id));
  modifiedQuestionsArr.arr[inputIndex].title = value;
}


/******************************************************************************
 *
 * These functions are triggered whenever a questionnaire setting is toggled
 *
 * // NOTE: These functions are called from SettingsCard js
 *
 ******************************************************************************/

export function editTitle(value) {
  modifiedQuestionsArr.arr[0].quiztitle = value;
  $('nav-title').textContent = 'Edit ' + value;
}

export function enableQuiz(value) {
  modifiedQuestionsArr.arr[0].enabled = value;
}

export function enableBack(value) {
  modifiedQuestionsArr.arr[0].allowback = value;
}

export function enableRestrict(value) {
  modifiedQuestionsArr.arr[0].restricted = value;
}


/******************************************************************************
 *
 *  This function will handle the event listeners for the options entered
 *
 * 1) If the text is clicked, remove it from the screen
 * 2) Run the removeOption function
 *
 ******************************************************************************/

export function removeOptionEventListeners(qid, oid, value) {
  $('options-' + qid + '-option-' + oid).addEventListener('click', function (e) {
    $('options-' + qid).removeChild($('options-' + qid + '-option-' + oid));
    removeOption(qid, value);
  });
}


/******************************************************************************
 *
 * When the user adds an option, this function is called (From the
 * editcard.js file addEventHandler function)
 *
 * 1) It will use the passed ID to find the position of the question
 *    in the array, getting its index in the array
 * 2) Check if the array is null (Error proofing), if it is
 *    set it to type array
 * 3) Push the passed value "value" to the end of the array
 *
******************************************************************************/

export function addOption(value, id) {
  if ($('optionInput-' + id).value.length !== 0) {
    const inputIndex = modifiedQuestionsArr.arr.findIndex(option => option.id === parseInt(id));
    if (modifiedQuestionsArr.arr[inputIndex].options === null) {
      modifiedQuestionsArr.arr[inputIndex].options = [];
    }
    if (modifiedQuestionsArr.arr[inputIndex].options.findIndex(option => option === value) === -1) {
      modifiedQuestionsArr.arr[inputIndex].options.push(value);
      return true;
    } else {
      createToast('Duplicate Entry', true);
      return false;
    }
  }
}


/******************************************************************************
 *
 * This function is triggered whenever a user clicks on an option to remove it
 *
 * 1) It will use the passed ID to find the position of the question
 *    in the array, getting its index in the array
 * 2) Use the above index value to then find the value in the questions
 *    options array
 * 2) Splice out the passed value "value" from the array
 *
******************************************************************************/

export function removeOption(qid, value) {
  const parsedID = parseInt(qid);
  const findQuestion = modifiedQuestionsArr.arr.findIndex(id => id.id === parsedID);
  const indexToSplice = modifiedQuestionsArr.arr[findQuestion].options.findIndex(option => option === value);
  modifiedQuestionsArr.arr[findQuestion].options.splice(indexToSplice, 1);
}


/******************************************************************************
 *
 * This function is triggered when the user presses the save button, it will
 * perform a quick check to validate the integrity of the questionnaire then
 * save if all conditions are met
 *
 * 1) It will perform an initial check to ensure there are no multi
 *    option type questions with missing arrays, it will notify the
 *    user if it detects any.
 * 2) Check for errorFlag === true, if it does, notify the user to check their
 *    questions
 * 3) It will stringify the modifiedQuestionsArr object generated earlier and
 *    ship it off to the server for handling
 * 4) Splice out the passed value "value" from the array
 *
 ******************************************************************************/

async function saveQuestionnaire() {
  for (let i = 0; i < modifiedQuestionsArr.arr.length; i++) {
    if (modifiedQuestionsArr.arr[i].type === 'single-select' || modifiedQuestionsArr.arr[i].type === 'multi-select') {
      if (modifiedQuestionsArr.arr[i].options === null || modifiedQuestionsArr.arr[i].options.length === 0) {
        createToast('Please Check Question ' + (i), true);
        return;
      }
    }
  }
  if (errorFlag === false) {
    const updateQuestions = await fetch('/api/quizzes/update/' + id, {
      method: 'PUT',
      body: JSON.stringify(modifiedQuestionsArr),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const questionResponse = await updateQuestions.json();
    if (questionResponse === true) {
      createToast('Quiz Updated Succesfully');
      buildEditor(id);
    } else {
      createToast('Quiz Update Failed', true);
    }
  } else {
    createToast('Please Check Your Questions', true);
  }
}
