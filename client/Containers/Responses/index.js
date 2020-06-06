'use strict';

import Card from '/Components/Card/card.js';
import Divider from '/Components/Divider/divider.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';

import { $, createToast, renderText } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


// #endregion
// ////////////////////////////////////////////////////////////// VARIABLES
// #region  Variable Declaration


let answerData;
let questions;
let quizInfo;
let quizLength;
let answerArray = [];



// #endregion
// ////////////////////////////////////////////////////////////// DATA FETCHING DB
// #region  Collect all required data from database (Quiz information, Questions, Answers)


export async function viewResponses(uid) {
  console.log(uid)
  const answerlist = await fetch('/api/answers/' + uid);
  if (answerlist.ok) {
    answerData = await answerlist.json();
  } else {
    answerData = [{ msg: 'Failed to load cards' }];
    return;
  }
  const response = await fetch('/api/questions/' + uid);
  if (response.ok) {
    questions = await response.json();
  } else {
    questions = [{ msg: 'Failed to load cards' }];
    createToast(questions[0].msg, FX.toastClear, 'Close');
    return;
  }
  const quizdetails = await fetch('/api/quizzes/' + uid);
  if (quizdetails.ok) {
    quizInfo = await quizdetails.json();
  }

  console.log(questions, answerData, quizInfo[0])

  generateResponsesPage(questions, answerData, quizInfo[0]);
}


// #endregion
// ////////////////////////////////////////////////////////////// GENERATE PAGE STRUCTURE
// #region  Generate Page


function generateResponsesPage(questions, answerData, quizdetails) {
  answerArray = []; // Reset the array with each load to prevent buildup
  if (answerData.length !== 0) quizLength = answerData[0].responses.length;
  const screen = new Screen({ id: 'admin-response-quiz', class: 'adminScreen', type: 'response', scroll: true });
  const nav = new Nav({ id: 'nav', title: answerData.length + ' Responses', return: true });


  let numberCount = 1;


  // Quiz details overview Card
  const detailsCard = new Card({ id: 'details-card', class: 'card-linear' });
  $('root').append(detailsCard);
  renderText(detailsCard, quizdetails.title, 'h2');
  const divider = new Divider(detailsCard, 'Quiz Information');
  if (answerData.length === 0) {
    renderText(detailsCard, 'This quiz has not had any responses yet.');
    return;
  } else {
    if (quizdetails.allowback === false || quizdetails.allowback === null) {
      renderText(detailsCard, 'The back button is disabled for this quiz.', 'p');
    }
    if (quizdetails.timelimit != null) {
      renderText(detailsCard, 'This quiz has a time limit of ' + quizdetails.timelimit + 'minutes.', 'p');
    }
    let time = 0;
    answerData.forEach(answer => { time += answer.time; });
    time = time / answerData.length;
    renderText(detailsCard, 'On average, this quiz takes ' + parseInt(time)  + ' seconds to complete.', 'p');
  }

  questions.forEach(question => {
    const card = new Card({ id: 'card-' + numberCount++, class: 'card-linear' });
    card.classList.add('card-linear');
    const text = renderText(card, question.question, 'label');
    text.classList.add('label');
    const divider = new Divider(card, 'Answers');

    if (question.input === 'multi-select' || question.input === 'single-select') {
      let optionContainer;
      for (let h = 0; h < question.options.length; h++) {
        optionContainer = document.createElement('div');
        optionContainer.classList.add('option-bar');
        optionContainer.id = 'question-' + (numberCount - 1) + '-' + h;
        renderText(optionContainer, question.options[h], 'p');
        card.append(optionContainer);
      }
    }

    $('root').append(card);

    const answerObject = {
      qid: numberCount - 1,
      arr: [],
    };

    answerArray.push(answerObject);
  });

  scrapeData(questions, answerData);
}


// #endregion
// ////////////////////////////////////////////////////////////// DATA COLLECTION
// #region  Scrape the data from the database


function scrapeData(questions, answerData) {
  for (let i = 0; i < answerData.length; i++) {
    for (let k = 0; k < answerData[i].responses.length; k++) {
      if (answerData[i].responses[k].type === 'checkbox' || answerData[i].responses[k].type === 'radio') {
        const object = answerArray[k];
        for (let j = 0; j < answerData[i].responses[k].choices[0].length; j++) {
          const choice = answerData[i].responses[k].choices[0][j];
          object.arr.push(choice);
        }
      }
      if (answerData[i].responses[k].type === 'text' || answerData[i].responses[k].type === 'number') {
        const list = document.createElement('p');
        console.log(answerData[i].responses[k])
        list.textContent = answerData[i].responses[k].choices[0];
        renderList(answerData, k, list);
      }
      if (answerData[i].responses[k].type === '') {
        //console.log('No answer given');
      }
    }
  }
  renderBars(answerArray, questions, answerData);
}


// #endregion
// ////////////////////////////////////////////////////////////// BAR CHART
// #region  Render the bar charts


function renderBars(answerArray, questions, answerData) {
  for (let i = 0; i < answerArray.length; i++) {
    if (questions[i].input === 'multi-select' || questions[i].input === 'single-select' ) {
      for (let j = 0; j < questions[i].options.length; j++) {

        const span = document.createElement('span');
        const tempArr = answerArray[i].arr.filter(value => value === questions[i].options[j]);
        span.style.width = (tempArr.length / (answerData.length)) * 100 + '%';
        $('question-' + (i + 1) + '-' + j).append(span);
        renderText($('question-' + (i + 1) + '-' + j), parseInt(span.style.width) + '%');
      }
    }
  }
}


// #endregion
// ////////////////////////////////////////////////////////////// LIST ITEMS
// #region  Render list items


async function renderList(answerData, k, list) {
  console.log(k);
  const load = await $('card-' + (k));
  if (load) {
    console.log($('card' + (k + 2)));
    $('card-' + (k + 1)).append(list);
  }
}
