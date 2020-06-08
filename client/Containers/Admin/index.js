/* eslint-disable no-unused-vars */
'use strict';

import Footer from '/Components/Footer/footer.js';
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


// Make this neater
export function createUpload() {
  const label = document.createElement('label');
  label.id = 'upload-label';
  label.classList.add('button', 'upload');

  
  filebutton = document.createElement('input');
  filebutton.id = 'file-upload';
  filebutton.type = 'file';
  filebutton.accept = '.json';
  label.setAttribute('for', 'file-upload');
  $('Footer').appendChild(label);
  $('upload-label').appendChild(filebutton);
  renderText($('upload-label'), 'Upload Quiz JSON');
  filebutton.addEventListener('change', function () {
    uploadJSON();
  });
}


// Clean up all these functions
export function generatePage() {
  const screen = new Screen({ id: 'admin-console', class: 'adminScreen' });
  const footer = new Footer({
    id: 'Footer',
  });
  //const nav = new Nav({ id: 'nav', title: 'Administrator Console', icons: ['add'], actions: [function () { const modal = new Modal({ type: 'upload', title: 'Upload a Quiz' }); }]});
  createUpload();
  displayQuizzes(params);
}


// new Toggle({id:'toggletest'});


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes


async function displayQuizzes() {
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
  const title = (!quiztitle) ? 'Quiz Deleted!' : quiztitle + ' Deleted!';
  const deleteQuiz = await fetch('/api/delete/quiz/' + uid);
  if (deleteQuiz.ok) {
    displayQuizzes();
    createToast(title, 'tick');
  } else {
    // Code if it failed here
  }
}


export async function deleteQuestion(qid, question) {
  const title = (!question) ? 'Question Deleted!' : question + ' Deleted!';
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
    console.log(upload);
    if (upload.ok) {
      displayQuizzes();
      createToast('Quiz Uploaded Succesfully!', 'uploadIcon');
    } else {
      console.log("NAG BOYE")
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
  if (upload.ok === true) {
    displayQuizzes();
    createToast('Quiz Uploaded Succesfully!', 'uploadIcon');
    filebutton.files = [];
  } else {
    // Something went wrong!
  }
}


// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes

