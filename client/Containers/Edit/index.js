/* eslint-disable no-unused-vars */
'use strict';

import EditCard from '/Components/Card/editcard.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';
import Icon from '/Components/Icon/icon.js';
import Button from '/Components/Button/button.js';
import Divider from '/Components/Divider/divider.js';
import Input from '/Components/Input/input.js';

import * as Admin from '/Containers/Admin/index.js';
import { $, createToast, renderText, html, pointer } from '/Javascript/render.js';
import * as FX from '/Javascript/fx.js';

// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


let uid;
const questionArray = [];
let questionlist;
const arrOfQuiz = { arr: [] };
const optionObject = {
  type: '',
  title: '',
  option: [],
  id: '',
};
export const optionTextCount = 0;


export function buildEditor(quizid) {
  uid = quizid;
  const screen = new Screen({
    id: 'edit-screen',
    class: 'adminScreen',
  });
  gatherDetails(quizid);
}

// const nav = new Nav({
//   id: 'nav',
//   title: (qData.length !== 0) ? 'Edit ' + qData[0].title : 'Invalid Quiz',
//   icons: ['return', 'add'],
//   actions: [function () { window.location = './#/admin'; }, function () { saveQuestionnaire(); }] });


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
    icons: ['return', 'add'],
    actions: [function () { window.location = './#/admin'; }, function () { saveQuestionnaire(); }],
  });
}


let questionNumber = 1;
let editedQuestionObject;

function deployCards() {
  questionData.forEach(question => {
    // Prefabricating an object to store the edited questions in (Try to neaten this bit up)
    editedQuestionObject = Object.create(optionObject);
    editedQuestionObject.title = question.question; // Title of the question
    editedQuestionObject.type = question.input; // Input type of the question
    editedQuestionObject.id = question.id; // ID of the question
    editedQuestionObject.options = (question.options === null) ? null : question.options; // Options for the question
    editedQuestionObject.minMax = (question.minMax === null) ? null : question.minMax;
    editedQuestionObject.required = question.required;
    arrOfQuiz.arr.push(editedQuestionObject);

  
    // Prefabricating an object of all the questions pulled off the db
    const questionObject = {
      id: question.id,
      quizid: question.quizid,
      question: question.question,
      type: question.input,
      options: question.options,
    };
    questionArray.push(questionObject);


    // Generate a card for each question
    // The card contains all the inputs and components
    const card = new EditCard({
      id: 'card-' + question.id,
      title: question.question,
      questionNum: questionNumber++,
      input: question.input,
      qid: question.id,
      options: question.options,
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
      const optionGroup = html('div', 'options-' + id, $('card-' + id), 'option_group');
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
  console.log(arrOfQuiz);
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
      type: 'text',
      renderPoint: $('group-' + id),
      eventListeners: false,
    });
    const max = new Input({
      id: 'max-' + id,
      placeholder: 'Enter Max',
      type: 'text',
      renderPoint: $('group-' + id),
      eventListeners: false,
    });

    min.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {

      }
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
          const newOption = html('div', 'options-' + id + '-option-' + optionArrPos, $('options-' + id), 'selector-toolbar');
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
  console.log("HELLO")
  $('options-' + qid + '-option-' + oid).addEventListener('click', function (e) {
    console.log(qid)
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


async function saveQuestionnaire() {
  const sendOption = await fetch('/api/quizzes/update/' + uid, {
    method: 'PUT',
    body: JSON.stringify(arrOfQuiz),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await sendOption.json();
  if (response.ok) {
    // It didnt break!
  } else {
    // Something went wrong!
  }
}




// export function buildEditor(quizid) {
//   uid = quizid;
//   const screen = new Screen({ id: 'admin-edit-quiz', class: 'adminScreen', title: 'Quiz Editor' });
//   gatherDetails(quizid);
// }

// async function gatherDetails(quizid) {
//   const questionnaire = await fetch('/api/quizzes/' + quizid);
//   if (questionnaire.ok) {
//     const qData = await questionnaire.json();
//     const nav = new Nav({
//       id: 'nav',
//       title: (qData.length !== 0) ? 'Edit ' + qData[0].title : 'Invalid Quiz',
//       icons: ['return', 'add'],
//       actions: [function () { window.location = './#/admin'; }, function () { saveQuestionnaire(); }] });
//     if (qData.length !== 0) {
//       editQuiz(quizid);
//     } else {
//       createToast('Invalid Questionnaire ID', true);
//       console.log('quiz doesnt exist');
//     }
//   } else {
//     const qData = [{ msg: 'Failed to load cards' }];
//   }
// }


// async function editQuiz(uid) {
//   let check = document.querySelectorAll('.card-linear');
//   check.forEach(element => {
//     $('root').removeChild(element);
//   });
//   check = null;
//   if (check === null) {
//     const response = await fetch('/api/questions/' + uid);
//     if (response.ok) {
//       questionlist = await response.json();
//       let i = 1;
//       questionlist.forEach(question => {
//         console.log(question.options);

//         // PreMake the Edited Question Array!!
//         const options = Object.create(optionObject);
//         options.title = question.question;
//         options.type = question.input;
//         options.id = question.id;
//         options.option = (question.options === null) ? [] : question.options;
//         arrOfQuiz.arr.push(options);


//         // Questions pulled from DB OBJECT
//         const questionObject = {
//           id: question.id,
//           quizid: question.quizid,
//           question: question.question,
//           type: question.input,
//           options: question.options,
//         };

//         questionArray.push(questionObject);


//         const card = new EditCard({ id: 'card-' + question.id, title: question.question, questionNum: i++, input: question.input, qid: question.id });
//         const group = html('div', 'options-' + question.id, card, 'option-group');


//         if (question.options !== null) {
//           // Generate a container for all the options
//           const optionbox = html('div', 'option-group-' + question.id, card, 'option_group');
//           // Generate all the options
//           question.options.forEach(option => {
//             const optionbox = html('div', '' + question.id, $('option-group-' + question.id), 'optionbox');
//             const deleteIcon = new Icon({
//               id: 'close',
//               renderPoint: optionbox,
//             });
//             const list = document.createElement('p');
//             list.textContent = option;
//             optionbox.append(list);
//           });

//           // Container for new option button
//           const newOption = document.createElement('div');
//         }
//       });
//     }
//   }
//   const card = new EditCard({ id: 'add-question', type: 'add' });
//   $('root').append(card);
// }

// export async function addQuestion() {
//   saveQuestionnaire(questionlist);
// }


// // Array and Object to store the data as the user edits the quiz
// let optionCount = 0;
// export let optionTextCount = 0;


// export function changeQuestionType(id) {
//   const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
//   if (inputIndex === -1) {
//     const options = Object.create(optionObject);
//     options.type = $('selector-card-' + id).value;
//     options.id = parseInt(id);
//     options.option = [];
//     arrOfQuiz.arr.push(options);
//     console.log(arrOfQuiz);
//   } else {
//     console.log(arrOfQuiz, 'EXISTS');
//     arrOfQuiz.arr[inputIndex].type = $('selector-card-' + id).value;
//   }

//   switch ($('selector-card-' + id).value) {
//     case 'text':
//       console.log(id);
//       $('card-' + id).removeChild($('option-' + id));
//       break;
//     case 'number':
//       $('card-' + id).removeChild($('option-' + id));
//       break;
//     case 'single-select':
//     case 'multi-select':
//       const option = document.createElement('div');
//       option.classList.add('optionbox');
//       // Make a component
//       if (!$('option-' + id)) {
//         const input = document.createElement('input');
//         input.type = 'text';
//         input.id = 'option-' + id;
//         input.setAttribute('data-id', id);
//         $('option-' + id).append(option);
//         option.append(input);
//         input.addEventListener('input', function () {
//           if ($('options-text-' + optionTextCount) === null) {
//             const optionbox = html('div', 'options-text-' + optionTextCount, $('options-' + id), 'optionbox');
//             const deleteIcon = new Icon({
//               id: 'closeblack',
//               renderPoint: optionbox,
//             });
//             const list = document.createElement('p');
//             list.id = 'text-' + optionTextCount;
//             list.textContent = input.value;
//             optionbox.append(list);

//           } else {
//             $('text-' + optionTextCount).textContent = input.value;
//           }
//         });

//         input.addEventListener('keydown', function (e) {
//           if (e.key === 'Enter') {
//             addOption(input.value, id);
//             input.value = '';
//           }
//         });
//         break;
//       } else {
//         console.log('IT WAS THERE ALL ALONG ');
//       }
//   }
// }


// export function addOption(value, id) {
//   optionTextCount++;
//   const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
//   if (inputIndex === -1) {
//     const options = Object.create(optionObject);
//     options.option = [];
//     options.option.push(value);
//     options.id = parseInt(id);
//     arrOfQuiz.arr.push(options);
//   } else {
//     arrOfQuiz.arr[inputIndex].option.push(value);
//   }
// }


// // Save the questionnaire, send the object array off to the server
// async function saveQuestionnaire() {
//   const sendOption = await fetch('/api/create/option/' + uid, {
//     method: 'POST', // or 'PUT'
//     body: JSON.stringify(arrOfQuiz),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const response = await sendOption.json();
//   if (response.ok) {
//     // It didnt break!
//   } else {
//     // Something went wrong!
//   }
// }


// export async function deleteQuestion(qid, question) {
//   const title = (!question) ? 'Question Deleted!' : question + ' Deleted!';
//   const deleteQuiz = await fetch('/api/delete/question/' + qid);
//   if (deleteQuiz.ok) {
//     console.log(uid);
//     editQuiz(uid);
//     createToast(title, FX.toastClear, 'Close');
//   } else {
//     // Code if it failed here

//   }
// }
