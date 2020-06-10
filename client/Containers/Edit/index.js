'use strict';

import EditCard from '/Components/Card/editcard.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';
import Icon from '/Components/Icon/icon.js';
import Button from '/Components/Button/button.js';
import Divider from '/Components/Divider/divider.js';

import * as Admin from '/Containers/Admin/index.js';
import { $, createToast, renderText, html } from '/Javascript/render.js';
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

export function buildEditor(quizid) {
  uid = quizid;
  const screen = new Screen({ id: 'admin-edit-quiz', class: 'adminScreen', title: 'Quiz Editor' });
  gatherDetails(quizid);
}

async function gatherDetails(quizid) {
  const questionnaire = await fetch('/api/quizzes/' + quizid);
  if (questionnaire.ok) {
    const qData = await questionnaire.json();
    if (qData.length !== 0) {
      const nav = new Nav({
        id: 'nav',
        title: 'Edit ' + qData[0].title,
        icons: ['return', 'add'],
        actions: [function () { window.location = './#/admin' }, function () { saveQuestionnaire(); }] });
      editQuiz(quizid);
    } else {
      console.log('quiz didnt exist');
    }
  } else {
    const qData = [{ msg: 'Failed to load cards' }];
  }
}


async function editQuiz(uid) {
  let check = document.querySelectorAll('.card-linear');
  check.forEach(element => {
    $('root').removeChild(element);
  });
  check = null;
  if (check === null) {
    const response = await fetch('/api/questions/' + uid);
    if (response.ok) {
      questionlist = await response.json();
      let i = 1;
      questionlist.forEach(question => {
        console.log(question.options);
        // PreMake the Edited Question Array!!
        const options = Object.create(optionObject);
        options.title = question.question;
        options.type = question.input;
        options.id = question.id;

        options.option = (question.options === null) ? [] : question.options;

        arrOfQuiz.arr.push(options);


        // Questions pulled from DB OBJECT
        const questionObject = {
          id: question.id,
          quizid: question.quizid,
          question: question.question,
          type: question.input,
          options: question.options,
        };

        questionArray.push(questionObject);


        const card = new EditCard({ id: 'card-' + question.id, title: question.question, questionNum: i++, input: question.input, qid: question.id });


        // Turn into HTML
        const group = document.createElement('div');
        group.id = 'options-' + question.id;
        group.classList.add('option-group');
        card.append(group);

        if (question.options !== null) {
          question.options.forEach(option => {
            const optionbox = html('div', '', card, 'optionbox');
            const deleteIcon = new Icon({
              id: 'close',
              renderPoint: optionbox,
            });

            const list = document.createElement('p');
            list.textContent = option;
            optionbox.append(list);
          });

          // Container for new option button
          const newOption = document.createElement('div');
        }
      });
    }
  }
  const card = new EditCard({ id: 'add-question', type: 'add' });
  $('root').append(card);
}

export async function addQuestion() {
  saveQuestionnaire(questionlist);
}


// Array and Object to store the data as the user edits the quiz
let optionCount = 0;
let optionTextCount = 0;


export function changeQuestionType(id) {
  const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
  if (inputIndex === -1) {
    const options = Object.create(optionObject);
    options.type = $('selector-card-' + id).value;
    options.id = parseInt(id);
    options.option = [];
    arrOfQuiz.arr.push(options);
    console.log(arrOfQuiz);
  } else {
    console.log(arrOfQuiz, 'EXISTS');
    arrOfQuiz.arr[inputIndex].type = $('selector-card-' + id).value;
  }

  switch ($('selector-card-' + id).value) {
    case 'text':
      $('card-' + id).removeChild($('options-' + id));
      break;
    case 'number':
      $('card-' + id).removeChild($('options-' + id));
      break;
    case 'single-select':
    case 'multi-select':
      const option = document.createElement('div');
      option.classList.add('optionbox');
      // Make a component
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'option-' + optionCount++;
      input.setAttribute('data-id', id);
      // Attach the group, if it doesnt already exist
      // STILL NEEDS WORK
      // Append the input, add event listeners
      $('options-' + id).append(option);
      option.append(input);
      input.addEventListener('input', function () {
        if ($('options-text-' + optionTextCount) === null) {
          const optionbox = html('div', 'options-text-' + optionTextCount, $('options-' + id), 'optionbox');
          const deleteIcon = new Icon({
            id: 'close',
            renderPoint: optionbox,
          });
          const list = document.createElement('p');
          list.id = 'text-' + optionTextCount;
          list.textContent = input.value;
          optionbox.append(list);
          // const optiontext = html('label', 'options-text-' + optionTextCount, $('options-' + id), 'label');
          // optiontext.textContent = input.value;
        } else {
          $('text-' + optionTextCount).textContent = input.value;
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          optionTextCount++;
          addOption(input.value, id);
          input.value = '';
        }
      });
      break;
  }
}


function addOption(value, id) {
  // Find if the object already exists in the array (User returning to edit question)
  const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === parseInt(id));
  if (inputIndex === -1) {
    console.log('DIDNT EXIST');
    const options = Object.create(optionObject);
    options.option = [];
    options.option.push(value);
    options.id = parseInt(id);
    arrOfQuiz.arr.push(options);
  } else {
    console.log(arrOfQuiz);
    arrOfQuiz.arr[inputIndex].option.push(value);
  }

  console.log(arrOfQuiz);
}


// Save the questionnaire, send the object array off to the server
async function saveQuestionnaire() {
  const sendOption = await fetch('/api/create/option/' + uid, {
    method: 'POST', // or 'PUT'
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
