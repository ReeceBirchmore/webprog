'use strict';

import EditCard from '/Components/Card/editcard.js';
import Modal from '/Components/Modal/modal.js';
import * as ModalFunctions from '/Components/Modal/modal.js';
import Nav from '/Components/Nav/nav.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';
import Screen from '/Components/Screen/screen.js';


import { $, createToast, renderText, html } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

/*************************
 *
 * @param { Array } params
 *
 *************************/

let params;
let uid;
let quizListObject;

let filebutton;

export function createUpload() {
  const label = document.createElement('label');
  label.id = 'upload-label';
  label.classList.add('upload');
  filebutton = document.createElement('input');
  filebutton.id = 'file-upload';
  filebutton.type = 'file';
  label.setAttribute('for', 'file-upload');
  $('root').appendChild(label);
  $('upload-label').appendChild(filebutton);
  renderText($('upload-label'), 'Upload Quiz');
  filebutton.addEventListener('change', function () {
    uploadJSON();
  });
}



export function generatePage() {
  // console.log(id_token)

  const screen = new Screen({ id: 'admin-console', class: 'adminScreen' });
  const nav = new Nav({ id: 'nav', title: 'Administrator Console', icons: ['add'], actions: [function () { const modal = new Modal({ type: 'upload', title: 'Upload a Quiz' }); }]});
  createUpload();
  displayQuizzes(params);
}


// new Toggle({id:'toggletest'});


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes


export async function displayQuizzes() {
  let check = document.querySelectorAll('.card-quiz-list');
  check.forEach(element => {
    console.log(element);
    $('root').removeChild(element);
  });
  check = null;
  if (check === null) {
    const quizlist = await fetch('/api/quizlist/');
    if (quizlist.ok) {
      quizListObject = await quizlist.json();
    } else {
      quizListObject = [{ msg: 'Failed to load cards' }];
      return;
    }
    quizListObject.forEach(quiz => {
      const card = new QuizCard({ id: quiz.quizid, quizTitle: quiz.title, type: 'quiz', uid: quiz.quizid });
    });
  }
}


// #endregion
// ////////////////////////////////////////////////////////////// DELETE
// #region Delete Quizzes and Questions


export async function deleteQuiz(uid, quiztitle) {
  const title = (!quiztitle) ? 'Quiz Deleted' : quiztitle + ' Deleted';
  const deleteQuiz = await fetch('/api/delete/quiz/' + uid);
  if (deleteQuiz.ok) {
    displayQuizzes();
    createToast(title, FX.toastClear, 'Close');
  } else {
    // Code if it failed here

  }
}


export async function deleteQuestion(qid, question) {
  const title = (!question) ? 'Question Deleted' : question + ' Deleted';
  const deleteQuiz = await fetch('/api/delete/question/' + qid);
  if (deleteQuiz.ok) {
    console.log(uid);
    editQuiz(uid);
    createToast(title, FX.toastClear, 'Close');
  } else {
    // Code if it failed here

  }
}


// #endregion
// ////////////////////////////////////////////////////////////// CREATE
// #region Upload or create a new quiz







export async function createNewQuiz(value) {
  const title = { value };
  if (title !== undefined) {
    const upload = await fetch('/api/create/quiz', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(title),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (upload.ok) {
      newQuizCreated(await upload.json());
    }
  }
}

export async function uploadJSON() {
  const jsonfile = await filebutton.files[0].text();
  upload(jsonfile);
}

async function upload(jsonfile) {
  const upload = await fetch('/api/upload', {
    method: 'POST', // or 'PUT'
    body: jsonfile,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const uid = await upload.json();
  if (upload.ok === true) {
    ModalFunctions.hideModal();
    displayQuizzes();
    createToast('Quiz Uploaded Succesfully', deleteQuiz, 'Undo', uid);
  } else {
    // Something went wrong!
  }
}


function newQuizCreated(uid) {
  ModalFunctions.hideModal();
  displayQuizzes();
  createToast('Quiz Uploaded Succesfully', deleteQuiz, 'Undo', uid);
  setTimeout(function () {
    const modal = new Modal({ id: 'modal-link', type: 'info', title: 'Quiz Link', params: uid, text: 'http://localhost:8080/quiz/' + uid + '/flow/' });
  }, 200);
}


// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


// export function buildEditor(quizid) {
//   uid = quizid;
//   const screen = new Screen({ id: 'admin-edit-quiz', class: 'adminScreen', title: 'Quiz Editor' });
//   gatherDetails(quizid);
//   editQuiz(quizid);
// }

// async function gatherDetails(quizid) {
//   const questionnaire = await fetch('/api/quizzes/' + quizid);
//   if (questionnaire.ok) {
//     const qData = await questionnaire.json();
//     const nav = new Nav({ id: 'nav', title: 'Edit ' + qData[0].title, icons: ['add'], actions: [function () { const modal = new Modal({ type: 'upload', title: 'Upload a Quiz' }); }]});
//   } else {
//     const qData = [{ msg: 'Failed to load cards' }];
//   }
// }

// const questionArray = [];
// let questionlist;

// async function editQuiz(uid) {
//   let check = document.querySelectorAll('.card-edit');
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
//         const questionObject = {
//           id: question.id,
//           quizid: question.quizid,
//           question: question.question,
//           type: question.input,
//           options: question.options,
//         };

//         questionArray.push(questionObject);
//         const card = new EditCard({ id: 'card-' + question.id, title: question.question, questionNum: i++, input: question.input, qid: question.id });
//         $('root').append(card);
//         const group = document.createElement('div');
//         group.id = 'options-' + question.id;
//         group.classList.add('option-group');
//         card.append(group);
//         if (question.options != null) {
//           question.options.forEach(option => {
//             const optionbox = document.createElement('div');
//             optionbox.classList.add('optionbox');

//             const closeIcon = document.createElement('div');
//             closeIcon.classList.add('icon', 'close');
//             const list = document.createElement('p');
//             list.textContent = option;
//             optionbox.append(closeIcon, list);
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


// function saveQuestionnaire(questionlist) {
//   questionlist.forEach(question => {
//     const arrPosition = questionArray.findIndex(questionArr => questionArr.id === question.id);
//     questionArray[arrPosition].input = $('selector-card-' + question.id).value;
//     questionArray[arrPosition].question = $('input-card-' + question.id).value;
//     console.log(document.querySelectorAll('[data-id]'));
//     if (document.querySelectorAll('[data-id]') === question.id) {
//       console.log('MATCH');
//     }
//   });
//   console.log(questionArray);
// }

// let optionCount = 0;
// let optionTextCount = 0;

// export function changeQuestionType(id) {

//   console.log($('selector-card-' + id).value)
//   switch ($('selector-card-' + id).value) {

//     case 'text':
//       $('card-' + id).removeChild($('options-' + id));
//       break;
//     case 'number':
//       $('card-' + id).removeChild($('options-' + id));
//       break;
//     case 'single-select':
//     case 'multi-select':
//       const option = document.createElement('div');
//       option.classList.add('optionbox');

//       // Make a component
//       const input = document.createElement('input');
//       input.type = 'text';
//       input.id = 'option-' + optionCount++;
//       input.setAttribute('data-id', id);


//       // Attach the group, if it doesnt already exist
  


//       // Append the input, add event listeners
//       $('options-' + id).append(option);

//       option.append(input);
//       input.addEventListener('input', function () {
//         if ($('options-text-' + optionTextCount) === null) {
//           const optiontext = html('label', 'options-text-' + optionTextCount, $('options-' + id), 'label');
//           optiontext.textContent = input.value;
//         } else {
//           $('options-text-' + optionTextCount).textContent = input.value;
//         }
//       });
//       input.addEventListener('keydown', function(e) {
//         console.log(e);
//         if (e.key === 'Enter') {
//           optionTextCount++;
//           input.value = '';
//           console.log(optionTextCount);
//           addOption(input.value);
//         }
//       });
//       break;
//   }
// }


// function addOption(option) {
//   console.log(quizid);
// }
