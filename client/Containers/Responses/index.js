/* eslint-disable no-new-object */
/* eslint-disable no-unused-vars */
'use strict';

import Card from '/Components/Card/card.js';
import Divider from '/Components/Divider/divider.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';

import { $, createToast, renderText, render, pointer, html } from '/Javascript/render.js';


import eventHandler from '/Javascript/eventhandlers.js';


// #endregion
// ////////////////////////////////////////////////////////////// VARIABLES
// #region  Variable Declaration


let answerData;
let questions;
let quizInfo;
let quizLength;
let answerArray = [];
let uid;

let result;

// #endregion
// ////////////////////////////////////////////////////////////// DATA FETCHING DB
// #region  Collect all required data from database (Quiz information, Questions, Answers)


export async function viewResponses(quizid) {
  uid = quizid;
  const answerlist = await fetch('/api/answers/' + uid);
  if (answerlist.ok) {
    answerData = await answerlist.json();
  } else {
    createToast('Failed to Load Answers', true);
    return;
  }
  const response = await fetch('/api/questions/' + uid);
  if (response.ok) {
    questions = await response.json();
  } else {
    createToast('Failed to Load Questions', true);
    return;
  }
  const quizdetails = await fetch('/api/quizzes/' + uid);
  if (quizdetails.ok) {
    quizInfo = await quizdetails.json();
  }
  // Pre-prepare the CSV for download
  if (answerData.length > 0) mergeAnswers(answerData);
  generateResponsesPage(questions, answerData, quizInfo[0]);
}


// #endregion
// ////////////////////////////////////////////////////////////// CSV GENERATOR
// #region  Generate CSV


function mergeAnswers(data) {
  const titles = [];
  const headers = new Object();
  const currentrow = new Object();
  // Push all questions from the first object into a new object
  for (let i = 0; i < data[0].responses.length; i++) {
    headers[i] = data[0].responses[i].title;
    titles.push(headers[i]);
  }
  // First Object Now Contains All Questions (For Top Of CSV Sheet)
  const keys = Object.values(titles);
  // Build The Records
  // Push all answers from one response sector into an array
  // Join the array onto the current result variable (.join)
  // Add new line at the end
  // Rinse and repeat
  // Download CSV
  // This took me ages pls
  result = keys.join(',') + '\n';
  for (let i = 0; i < 2; i++) {
    const rows = [];
    for (let j = 0; j < data[i].responses.length; j++) {
      if (data[i].responses[j].choices[0].length > 1) {
        const temp = data[i].responses[j].choices[0].join(' / ');
        rows.push(temp);
      } else {
        rows.push(data[i].responses[j].choices[0][0]);
      }
    }
    currentrow[i] = rows;
    result += currentrow[i].join(',') + '\n';
  }
}

function downloadCSV(result) {
  result = 'data:text/csv;charset=utf-8,' + result;
  const data = encodeURI(result);
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', quizInfo[0].title + '.csv');
  link.click();
  return result;
}

// #endregion
// ////////////////////////////////////////////////////////////// GENERATE PAGE STRUCTURE
// #region  Generate Page


function generateResponsesPage(questions, answerData, quizdetails) {
  answerArray = []; // Reset the array with each load to prevent buildup
  if (answerData.length !== 0) quizLength = answerData[0].responses.length;
  const screen = new Screen({ id: 'admin-response-quiz', class: 'adminScreen', type: 'response', scroll: true });
  const nav = new Nav({
    id: 'nav',
    title: answerData.length + ' Responses',
    icons: ['return'],
    actions: [function () { window.location = './#/admin'; }],
    elevated: true,
  });

  let numberCount = 1;

  // Quiz details overview Card
  const detailsCard = new Card({
    id: 'details-card',
    class: 'card-linear',
  });

  render(detailsCard, $('root'));
  renderText(detailsCard, quizdetails.title, 'h2');
  const divider = new Divider(detailsCard, 'Quiz Information');

  if (answerData.length === 0) {
    renderText(detailsCard, 'This quiz has not had any responses yet.');
    return;
  } else {
    const link = renderText(detailsCard, pointer + ' here to download your answers as a CSV', 'p');
    eventHandler(link, '', function () { downloadCSV(result); });
  }


  // ---------------------------------------------------------------------- //
  questions.forEach(question => {
    const card = new Card({ id: 'card-' + numberCount++, class: 'card-linear' });
    const text = renderText(card, question.question, 'label', '', 'label');

    const divider = new Divider(card, 'Answers');

    if (question.input === 'multi-select' || question.input === 'single-select') {
      let optionContainer;
      for (let h = 0; h < question.options.length; h++) {
        optionContainer = html('div', 'question-' + (numberCount - 1) + '-' + h, card, 'option-bar')
        renderText(optionContainer, question.options[h], 'p');
      }
    }
    render(card);

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
        list.textContent = answerData[i].responses[k].choices[0];
        renderList(answerData, k, list);
      }
      if (answerData[i].responses[k].type === '') {
        // console.log('No answer given');
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
    if (questions[i].input === 'multi-select' || questions[i].input === 'single-select') {
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


function renderList(answerData, k, list) {
  const load = $('card-' + (k + 1));
  if (load) {
    $('card-' + (k + 1)).append(list);
  }
}
