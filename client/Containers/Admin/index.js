/* eslint-disable no-unused-vars */
'use strict';

import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';
import Screen from '/Components/Screen/screen.js';
import Icon from '/Components/Icon/icon.js';
import { $, createToast, renderText, html } from '/Javascript/render.js';


// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

let quizListObject;
let filebutton;


// Make this neater
export function createUpload() {
  const label = html('label', 'upload-label', $('Footer'), 'upload');
  label.classList.add('button');
  filebutton = html('input', 'file-upload', label);
  filebutton.type = 'file';
  filebutton.accept = '.json';
  label.setAttribute('for', 'file-upload');
  //const icon = new Icon({ id: 'add', renderPoint: label });
  filebutton.addEventListener('change', function () {
    uploadJSON();
  });
}


// Clean up all these functions
export function generatePage() {
  const screen = new Screen({
    id: 'admin-console',
    class: 'adminScreen',
  });
  const footer = new Footer({
    id: 'Footer',
  });
  const nav = new Nav({
    id: 'nav',
    title: 'Administrator Panel',
    elevated: true,
  });
  createUpload();
  displayQuizzes();
}


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes


async function displayQuizzes() {
  let check = document.querySelectorAll('.card-quiz-list');
  check.forEach(element => {
    $('root').removeChild(element);
  });
  check = null;
  if (check === null) {
    const quizlist = await fetch('/api/quizzes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (quizlist.ok) {
      quizListObject = await quizlist.json();
    } else {
      createToast('Error Loading Quizzes', true);
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
  const deleteQuiz = await fetch('/api/delete/quiz/' + uid, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (deleteQuiz.ok) {
    displayQuizzes();
    createToast((!quiztitle) ? 'Quiz Deleted' : quiztitle + ' Deleted', 'tick');
  } else {
    createToast('Failed to Delete Quiz', true);
  }
}


// #endregion
// ////////////////////////////////////////////////////////////// CREATE/UPLOAD
// #region Upload or create a new quiz


export async function createNewQuiz() {
  const upload = await fetch('/api/create/quiz', {
    method: 'POST',
    body: JSON.stringify(title),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  displayQuizzes();
  if (upload.ok) {
    createToast('Quiz Created Succesfully');
  } else {
    createToast('Quiz Creation Failed', true);
  }
}


export async function uploadJSON() {
  const jsonfile = await filebutton.files[0].text();
  upload(jsonfile);
}

async function upload(jsonfile) {
  const upload = await fetch('/api/upload', {
    method: 'POST',
    body: jsonfile,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  displayQuizzes();
  if (upload.ok === true) {
    createToast('Quiz Uploaded Succesfully');
    filebutton.value = '';
  } else {
    createToast('Quiz Upload Failed', true);
  }
}
