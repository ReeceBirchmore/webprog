'use strict';

import EditCard from '/Components/Card/editcard.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';

import * as Admin from '/Containers/Admin/index.js';
import { $, createToast, renderText, html } from '/Javascript/render.js';
import * as FX from '/Javascript/fx.js';

// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


let uid;
const questionArray = [];
let questionlist;


export function buildEditor(quizid) {
  uid = quizid;
  const screen = new Screen({ id: 'admin-edit-quiz', class: 'adminScreen', title: 'Quiz Editor' });
  gatherDetails(quizid);
  editQuiz(quizid);
}

async function gatherDetails(quizid) {
  const questionnaire = await fetch('/api/quizzes/' + quizid);
  if (questionnaire.ok) {
    const qData = await questionnaire.json();
    const nav = new Nav({ id: 'nav', icons: ['add', 'info'], actions: [function () { saveQuestionnaire(); }, function () { Admin.uploadJSON(); }] });
  } else {
    const qData = [{ msg: 'Failed to load cards' }];
  }
}


async function editQuiz(uid) {
  let check = document.querySelectorAll('.card-edit');
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
        const questionObject = {
          id: question.id,
          quizid: question.quizid,
          question: question.question,
          type: question.input,
          options: question.options,
        };

        questionArray.push(questionObject);
        const card = new EditCard({ id: 'card-' + question.id, title: question.question, questionNum: i++, input: question.input, qid: question.id });
        $('root').append(card);
        const group = document.createElement('div');
        group.id = 'options-' + question.id;
        group.classList.add('option-group');
        card.append(group);
        if (question.options != null) {
          question.options.forEach(option => {
            const optionbox = document.createElement('div');
            optionbox.classList.add('optionbox');

            const closeIcon = document.createElement('div');
            closeIcon.classList.add('icon', 'close');
            const list = document.createElement('p');
            list.textContent = option;
            optionbox.append(closeIcon, list);
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
const arrOfQuiz = { arr: [] };
const optionObject = {
  type: '',
  option: [],
  id: '',
};


export function changeQuestionType(id) {
  const options = Object.create(optionObject);
  options.type = $('selector-card-' + id).value;
  options.id = id;
  options.option = [];
  arrOfQuiz.arr.push(options);
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
          const optiontext = html('label', 'options-text-' + optionTextCount, $('options-' + id), 'label');
          optiontext.textContent = input.value;
        } else {
          $('options-text-' + optionTextCount).textContent = input.value;
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
  const inputIndex = arrOfQuiz.arr.findIndex(option => option.id === id);
  if (inputIndex === -1) {
    console.log("DIKEJADF");
    const options = Object.create(optionObject);
    options.option = [];
    options.option.push(value);
    options.id = id;
    arrOfQuiz.arr.push(options);
  } else {
    arrOfQuiz.arr[inputIndex].option.push(value);
  }
  console.log(arrOfQuiz.arr);
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


  // questionlist.forEach(question => {
  //   const arrPosition = questionArray.findIndex(questionArr => questionArr.id === question.id);
  //   questionArray[arrPosition].input = $('selector-card-' + question.id).value;
  //   questionArray[arrPosition].question = $('input-card-' + question.id).value;
  //   console.log(document.querySelectorAll('[data-id]'));
  //   if (document.querySelectorAll('[data-id]') === question.id) {
  //     console.log('MATCH');
  //   }
  // });
  // console.log(questionArray);
}
