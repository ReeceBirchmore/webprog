/* eslint-disable no-unused-vars */
'use strict';

import EditCard from '/Components/Card/editcard.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';

import Divider from '/Components/Divider/divider.js';
import Input from '/Components/Input/input.js';
import SettingsCard from '/Components/Card/settingscard.js';

import * as Admin from '/Containers/Admin/index.js';
import { $, createToast, renderText, html, pointer } from '/Javascript/render.js';


// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


let uid;
const questionArray = [];
const arrOfQuiz = { arr: [] };
const optionObject = {};
export const optionTextCount = 0;
let questionNumber = 1;


export function buildEditor(quizid) {
  uid = quizid;
  const arrOfQuiz = { arr: [] };
  questionNumber = 1;
  const screen = new Screen({
    id: 'edit-screen',
    class: 'adminScreen',
  });
  gatherDetails(quizid);
}


// The two main portions of the editor, the questionnaire data and the question data

let questionnaireData;
let questionData;


async function gatherDetails(quizid) {
  // Grab the quiz details
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
  const question = await fetch('/api/questions/' + uid);
  if (question.ok) {
    questionData = await question.json();
    deployCards(); // Move in future, ensure both conditions have been met before proceeding!
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



let editedQuestionObject;

function deployCards() {
  console.log(questionnaireData[0])
  const quizSettingsCard = new SettingsCard({
    id: 'settings-card',
    title: questionnaireData[0].title,
    enabled: questionnaireData[0].enabled,
    restricted: questionnaireData[0].restrict,
    allowBack: questionnaireData[0].allowback,
  });

  editedQuestionObject = Object.create(optionObject);
  editedQuestionObject.id = questionnaireData[0].quizid;
  editedQuestionObject.quiztitle = questionnaireData[0].title; // Title of the questionnaire
  editedQuestionObject.enabled = questionnaireData[0].enabled; // Enable the questionnaire
  editedQuestionObject.restricted = questionnaireData[0].restrict; // restrict submissions
  editedQuestionObject.allowback = questionnaireData[0].allowback; // Allow the back button
  arrOfQuiz.arr.push(editedQuestionObject);

  console.log(arrOfQuiz.arr[0]);



  questionData.forEach(question => {
    // Prefabricating an object to store the edited questions in (Try to neaten this bit up)
    editedQuestionObject = Object.create(optionObject);
    editedQuestionObject.title = question.question; // Title of the question
    editedQuestionObject.type = question.input; // Input type of the question
    editedQuestionObject.id = question.id; // ID of the question
    editedQuestionObject.options = (question.options === null) ? null : question.options; // Options for the question
    editedQuestionObject.min = (question.min === null) ? null : question.min;
    editedQuestionObject.max = (question.max === null) ? null : question.max;
    editedQuestionObject.required = question.required;
    arrOfQuiz.arr.push(editedQuestionObject);


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
    });
  });
}


/***************************************************************
 *
 * This function handles changing the questions type, upon a
 * change in question type, the relevant inputs will appear
 * for further customisation.
 *
 * The function can be broken down as such:
 * 1) Function is called with the ID of the question as a parameter
 * 2) Check to see where the ID is inside the arrOfQuiz object array
 * 3) Modify the objects type value to match the new selection
 *
 * The switch statement broken down:
 *
 * 1) First, create a group for the new inputs (for easier removal)
 * 1A) If the group is already there, delete it and recreate it
 * 2) Determine which input type was selected
 * 3) Run the relevant functions
 *
 * NOTE: If the user switches from a MULTIPLE optioned question
 * to a SINGLE input question, the options array will be WIPED
 *
 ***************************************************************/

export function changeQuestionType(id) {
  const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
  arrOfQuiz.arr[inputIndex].type = $('selector-' + id).value;

  $('group-' + id).setAttribute('data-type', $('selector-' + id).value);
  modifyInputGroup(id);

  switch ($('selector-' + id).value) {
    case 'text':
      if ($('options-' + id)) $('card-' + id).removeChild($('options-' + id));
      arrOfQuiz.arr[inputIndex].options = null;
      break;

    case 'number':
      if ($('options-' + id)) $('card-' + id).removeChild($('options-' + id));
      arrOfQuiz.arr[inputIndex].options = null;
      numberType(id);
      break;

    case 'single-select':
    case 'multi-select':
      const multiGroup = html('div', 'options-' + id, $('card-' + id), 'option_group');
      multiType(id);
      break;

    case 'date':
      arrOfQuiz.arr[inputIndex].options = null;
      // dateType(id);
      break;

    case 'range':
      arrOfQuiz.arr[inputIndex].options = null;
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
 * 1A) Remove the options group (containing the multiple options)
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
 * 2A) IF the addOption returns true (Value isn't a duplicate) proceed, else, stop
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
          const findQuestion = arrOfQuiz.arr.findIndex(id => id.id === parsedID);
          const optionArrPos = arrOfQuiz.arr[findQuestion].options.findIndex(option => option === $('optionInput-' + id).value);
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
 * These functions are triggered whenever the user edits the Min/Max constratints
 *
 ******************************************************************************/

export function changeMinValue(value, id) {
  console.log(id);
  const inputIndex = arrOfQuiz.arr.findIndex(value => value.id === id);
  if (parseInt($('max-' + id).value) > parseInt($('min-' + id).value)) {
    createToast('Min Must Be Lower than Max', true);
  } else {
    console.log(arrOfQuiz.arr[inputIndex]);
    arrOfQuiz.arr[inputIndex].min = parseInt($('min-' + id).value);
  }
}

export function changeMaxValue(value, id) {
  const inputIndex = arrOfQuiz.arr.findIndex(value => value.id === id);
  if (parseInt($('max-' + id).value) < parseInt($('min-' + id).value)) {
    createToast('Max Must Be Greater Than Min', true);
  } else {
    arrOfQuiz.arr[inputIndex].max = parseInt($('max-' + id).value);
  }
}


/******************************************************************************
 *
 * These functions are triggered whenever a questionnaire setting is toggled
 *
 ******************************************************************************/

export function editTitle(value) {
  arrOfQuiz.arr[0].quiztitle = value;
  $('nav-title').textContent = 'Edit ' + value;
}

export function enableQuiz(value) {
  arrOfQuiz.arr[0].enabled = value;
}

export function enableBack(value) {
  arrOfQuiz.arr[0].allowback = value;
}

export function enableRestrict(value) {
  arrOfQuiz.arr[0].restricted = value;
}

/******************************************************************************
 *
 * This function is triggered whenever the user toggles the required toggle
 *
 ******************************************************************************/


export function changeRequired(value, id) {
  const inputIndex = arrOfQuiz.arr.findIndex(title => title.id === parseInt(id));
  $('text-' + id).style.color = (value === true) ? 'black' : '#AAA5AF';
  arrOfQuiz.arr[inputIndex].required = value;
}


/******************************************************************************
 *
 * This function is triggered whenever the user modifies a question title
 *
 ******************************************************************************/


export function changeQuestionTitle(value, id) {
  const inputIndex = arrOfQuiz.arr.findIndex(title => title.id === parseInt(id));
  arrOfQuiz.arr[inputIndex].title = value;
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


/***************************************************************
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
 ****************************************************************/

export function addOption(value, id) {
  if ($('optionInput-' + id).value.length !== 0) {
    const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
    if (arrOfQuiz.arr[inputIndex].options === null) {
      arrOfQuiz.arr[inputIndex].options = [];
    }
    if (arrOfQuiz.arr[inputIndex].options.findIndex(option => option === value) === -1) {
      arrOfQuiz.arr[inputIndex].options.push(value);
      return true;
    } else {
      createToast('Duplicate Entry', true);
      return false;
    }
  } else {
    createToast('Option Required', true);
    return false;
  }
}


/***************************************************************
 *
 * This function is triggered whenever a user clicks on an option
 * to remove it
 *
 * 1) It will use the passed ID to find the position of the question
 *    in the array, getting its index in the array
 * 2) Use the above index value to then find the value in the questions
 *    options array
 * 2) Splice out the passed value "value" from the array
 *
 ****************************************************************/

export function removeOption(qid, value) {
  const parsedID = parseInt(qid);
  const findQuestion = arrOfQuiz.arr.findIndex(id => id.id === parsedID);
  const indexToSplice = arrOfQuiz.arr[findQuestion].options.findIndex(option => option === value);
  arrOfQuiz.arr[findQuestion].options.splice(indexToSplice, 1);
}


/***************************************************************
 *
 * This function is triggered when the user presses the save button
 *
 * 1) It will perform an initial check to ensure there are no multi
 *    option type questions with missing arrays, it will notify the
 *    user if it detects any.
 * 2) It will stringify the arrOfQuiz object generated earlier and
 *    ship it off to the server for handling
 * 2) Splice out the passed value "value" from the array
 *
 ****************************************************************/


async function saveQuestionnaire() {
  for (let i = 0; i < arrOfQuiz.arr.length; i++) {
    if (arrOfQuiz.arr[i].type === 'single-select' || arrOfQuiz.arr[i].type === 'multi-select') {
      if (arrOfQuiz.arr[i].options === null || arrOfQuiz.arr[i].options.length === 0) {
        createToast('Please Check Question ' + (i + 1), true);
        return;
      }
    }
  }

  const updateQuestions = await fetch('/api/quizzes/update/' + uid, {
    method: 'PUT',
    body: JSON.stringify(arrOfQuiz),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const questionResponse = await updateQuestions.json();
  if (questionResponse === true) {
    createToast('Quiz Updated Succesfully');
  } else {
    createToast('Quiz Update Failed', true);
  }
}
