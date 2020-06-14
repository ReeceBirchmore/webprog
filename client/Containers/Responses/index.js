'use strict';

import Card from '/Components/Card/card.js';
import Divider from '/Components/Divider/divider.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';
import { $, createToast, renderText, render, pointer, html } from '/Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';

let answerData;
let questions;
let quizInfo;
let answerArray = [];
let uid;
let result;

/****************************************************************************************
*
* Perform fetch requests to get all the data required
*
****************************************************************************************/


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
  generateResponsesPage(questions, answerData, quizInfo[0]);
}


/****************************************************************************************
*
* Generate the responses as a CSV
*
****************************************************************************************/

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
  result = keys.join(',') + '\n';
  // Build the Records
  for (let i = 0; i < data.length; i++) {
    const rows = [];
    for (let j = 0; j < data[i].responses.length; j++) {
      if (data[i].responses[j].choices[0].length > 1) {
        const temp = data[i].responses[j].choices[0].join(' / ');
        rows.push(temp);
      } else {
        rows.push(data[i].responses[j].choices[0][0]);
      }
    }
    // Push records into CSV
    currentrow[i] = rows;
    result += currentrow[i].join(',') + '\n';
  }
  // Trigger Download
  downloadCSV(result);
}

function downloadCSV(result) {
  result = 'data:text/csv;charset=utf-8,' + result;
  const data = encodeURI(result);
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', quizInfo[0].title + ' Responses.csv');
  link.click();
  return result;
}

/****************************************************************************************
*
* Generate The Page
*
****************************************************************************************/

function generateResponsesPage(questions, answerData, quizdetails) {
  answerArray = []; // Reset the array with each load to prevent buildup
  if ($('Footer')) $('Footer').remove();
  const screen = new Screen({
    id: 'admin-response-quiz',
    class: 'noFooter',
  });
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

  render(detailsCard);
  renderText(detailsCard, quizdetails.title, 'h2');
  const divider = new Divider(detailsCard, 'Quiz Information');

  if (answerData.length === 0) {
    renderText(detailsCard, 'This quiz has not had any responses yet.');
    return;
  } else {
    const link = renderText(detailsCard, pointer + ' here to download all responses as a CSV', 'p');
    eventHandler(link, '', function () { mergeAnswers(answerData); });
  }

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


/****************************************************************************************
*
* Get the answer data together to form groups
*
****************************************************************************************/


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


/****************************************************************************************
*
* Display bar charts for the groups if they are single or multi select
*
****************************************************************************************/


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


/****************************************************************************************
*
* Render a list of answers
*
****************************************************************************************/

function renderList(answerData, k, list) {
  const load = $('card-' + (k + 1));
  if (load) {
    $('card-' + (k + 1)).append(list);
  }
}
