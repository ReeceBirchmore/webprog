'use strict';

import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import QuizCard from '/Components/Card/quizcard.js';
import Screen from '/Components/Screen/screen.js';
import Button from '/Components/Button/button.js';
import { $, createToast, html } from '/Javascript/render.js';


let quizListObject;
let filebutton;


/******************************************************************************
*
* This function will handle generating the main structure of the page
*
******************************************************************************/

export function generatePage() {
  const screen = new Screen({
    id: 'admin-console',
    class: 'adminScreen',
  });
  if ($('Footer')) $('Footer').remove();
  const footer = new Footer({
    id: 'Footer',
  });

  const nav = new Nav({
    id: 'nav',
    title: 'Administrator Panel',
    elevated: true,
  });

  const createNew = new Button({
    id: 'create-quiz',
    render: 'Footer',
    action: function () { createNewQuiz(); },
    text: 'Generate',
    class: 'create',
  });

  $('create-quiz').classList.add('large');
  const label = html('label', 'upload-label', $('Footer'), 'create');
  label.textContent = 'Upload';
  label.classList.add('button', 'ripple', 'large');
  filebutton = html('input', 'file-upload', label);
  filebutton.type = 'file';
  filebutton.accept = '.json';
  label.setAttribute('for', 'file-upload');
  filebutton.addEventListener('change', function () {
    uploadJSON();
  });

  displayQuizzes();
}


/******************************************************************************
*
* This function will handle creating a new quiz from scratch
*
*******************************************************************************/

async function createNewQuiz() {
  const questionnaire = await fetch('/api/create/quiz/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (questionnaire.ok) {
    const quizid = await questionnaire.json();
    window.location = './#/admin/edit/' + quizid;
  }
}


/******************************************************************************
*
* This function will retrieve the quizzes available from the database and
* create a card for each one, displaying it onto the webpage
*
*******************************************************************************/

async function displayQuizzes() {
  const quizlist = await fetch('/api/quizzes/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (quizlist.ok) {
    quizListObject = await quizlist.json();
    quizListObject.forEach(quiz => {
      const card = new QuizCard({
        id: quiz.quizid,
        quizTitle: quiz.title,
        type: 'quiz',
        uid: quiz.quizid,
      });
    });
  } else {
    createToast('Error Loading Quizzes', true);
  }
}


/******************************************************************************
*
* This function will handle deleting a questionnaire form the list
*
* // NOTE: This function is called from the QuizCard component (bin icon)
*
*******************************************************************************/

export async function deleteQuiz(uid, quiztitle) {
  const deleteQuiz = await fetch('/api/delete/quiz/' + uid, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (deleteQuiz.ok) {
    generatePage();
    createToast((!quiztitle) ? 'Quiz Deleted' : quiztitle + ' Deleted', 'tick');
  } else {
    createToast('Failed to Delete Quiz', true);
  }
}


/******************************************************************************
*
* This function will handle upload a JSON file to be put onto the database
*
* // NOTE: If the file structure of the uploaded JSON does NOT meet the spec
* //       outlined in the README.md, the upload will be rejected and it will
*          fail.
*
*******************************************************************************/

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
  if (upload.ok === true) {
    generatePage();
    createToast('Quiz Uploaded Succesfully');
    filebutton.value = '';
  } else {
    createToast('Quiz Upload Failed', true);
  }
}
