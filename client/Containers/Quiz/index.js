/* eslint-disable no-unused-vars */
'use strict';


import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import Input, { options } from '/Components/Input/input.js';
import Progress from '/Components/Progress/progress.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';


import * as Admin from '/Containers/Admin/index.js';
import { $, renderText, createToast, html } from '/Javascript/render.js';
import * as FX from '/Javascript/fx.js';
import { shuffle } from '/Javascript/stackManagement.js';


// #endregion Imports
// ////////////////////////////////////////////////////////////// Declare widely used variables
// #region  Variable Declaration

export const answersObject = { responses: [], time: '' }; // Object Array used to store answers as the user progresses
export let flowCount = 0; // Card Stack Position Counter
export const arrOfCards = []; // Array of HTML card elements generated for the quiz
export const cardStackArr = { cards: [] }; // cardStackArray
export let questions; // Used to store questions array pulled from database

let questionDataObject; // Questionnaire Data Object pulled from database
let uid; // Quiz ID


// Sort these
let startTime;

// #endregion Variables
// ////////////////////////////////////////////////////////////// GENERATE PAGE
// #region  Generate Quiz Setup

/****************************************************************
 *
 *  This function will start the process of creating the screen,
 *  generating questions and sorting the card stack
 *
 ***************************************************************/

export function generateQuiz(param) {
  const screen = new Screen({
    id: 'quiz',
    class: 'quizScreen',
  });
  uid = param;
  flowCount = 0;
  generateQuestionnaire(uid);
}

// #endregion
// ////////////////////////////////////////////////////////////// GENERATE CARDS AND INPUTS
// #region Generate Cards and Inputs

/****************************************************************
 *
 *  This function will start the process of pulling the data
 *  from the database, dragging out quiz data (settings)
 *
 ***************************************************************/

export async function generateQuestionnaire(uid) {
  const questionnaire = await fetch('/api/quizzes/' + uid.id);
  if (questionnaire.ok) {
    questionDataObject = await questionnaire.json();
  } else {
    questionDataObject = [{ msg: 'Failed to load cards' }];
    return;
  }

  if (questionDataObject[0] !== undefined) {
    // Build the footer
    const footer = new Footer();
    // Build the Next Button
    const button = new Button({
      id: 'nextbtn',
      text: 'Next',
      action: function () { increase(); },
      render: 'Footer',
      type: 'next',
    });
    // If the quiz does not allow the back button, disable it and enlarge the next button
    if (questionDataObject[0].allowback !== false) {
      const button = new Button({
        id: 'prevbtn',
        text: 'Previous',
        action: function () { decrease(); },
        render: 'Footer',
        type: 'previous',
      });
      $('nextbtn').style.width = '8rem';
    }
    generateQuestions(uid);
  } else {
    console.error('This questionnaire does not exist');
  }
}


/****************************************************************
 *
 *  This function will start the process of pulling data from
 *  the database in order for the questionnaire to display.
 *  It also handles the generation of input, card and text
 *  components
 *
 ***************************************************************/

async function generateQuestions(uid) {
  const response = await fetch('/api/questions/' + uid.id);
  if (response.ok) {
    questions = await response.json();
    generateCards(questions);
  } else {
    createToast('Failed to Load Questions', true);
  }
}


/****************************************************************
 *
 *  This function does the heavy lifting of generating each
 *  card, giving the cards the appropriate data and such
 *
 ***************************************************************/

function generateCards(questions) {
  // Generate the progress bar
  const progress = new Progress({
    id: 'progressBar',
    qnum: '1 of ' + questions.length,
  });

  // Generate the NavBar
  const nav = new Nav({
    id: 'nav',
    title: questionDataObject[0].title,
    icons: [(questionDataObject[0].allowback !== false) ? 'clear' : null],
    actions: [function () { if (questionDataObject[0].allowback !== false) { location.reload(); } }],
  });

  // Define the question number (Primarily used for IDs)
  let qNum = 1;

  // Begin looping through the returned questions array
  questions.forEach(question => {
    const card = new Card({ id: 'card-' + qNum++, required: true });

    // Create the option type text to appear above the question
    let info;
    switch (question.input) {
      case 'number':
      case 'text':
        info = 'Enter your response';
        break;
      case 'single-select':
        info = 'Select one';
        break;
      case 'multi-select':
        info = 'Select one or more';
        break;
    }
    const typeinfo = renderText(card, info, 'p', 'type-info', 'subtext');


    // We will now display the question text
    const text = renderText(card, question.question, 'label', '', 'label');

    text.setAttribute('for', 'input-question-' + qNum);

    // Finally, we will setup the inputs (Multiple Choice)
    const quesContainer = html('div', '', card, 'scroll-container');
    if (question.options !== null && question.options.length > 0) {
      for (let x = 0; x < question.options.length; x++) {
        const input = new Input({
          id: 'input-' + x + '-question-' + qNum,
          type: question.input,
          options: question.options[x],
          name: qNum,
          linkedQ: 3,
          renderPoint: quesContainer,
        });
      }
    } else {
      // If not multiple options, display usual text input field
      const input = new Input({
        id: 'input-question-' + qNum,
        type: question.input,
        title: question.question,
        renderPoint: quesContainer,
        min: question.min,
        max: question.max,
      });
      console.log(question.min, question.max);
    }
    // Push newly generated card to the ArrayOfCards
    arrOfCards.push(card);
  });
  shuffle();
}


/****************************************************************
 *
 *  This function will handle the answers, when the next button
 *  is pressed it calls upon this function to do the following:
 *
 *  - Create a new object
 *  - Use exported data from input.js to fill in the object
 *  - Push the object into an array named Answers
 *
 ***************************************************************/

export function handleAnswers() {
  // Answer object to be created to store user data
  const response = {
    qid: flowCount + 1,
    choices: (options.choices.length === 0) ? ['No Answer'] : [options.choices],
    title: questions[flowCount].question,
    type: options.type,
  };

  // Find if the above object already exists in the array (User returning to edit question)
  const inputIndex = answersObject.responses.findIndex(question => question.qid === flowCount + 1);
  if (inputIndex === -1) {
    answersObject.responses.push(response);
  } else {
    if (options.choices.length !== 0) {
      answersObject.responses[inputIndex].choices = [options.choices];
    }
  }

  // Directional Quizzing, place counter to directional quiz question number
  if (options.linkedQ) flowCount = options.linkedQ;

  // Clear the choices array again ready for the next question
  options.choices = [];
  options.type = '';
}


/****************************************************************
 *
 *  These functions control the flow of the stack, they also perform
 *  some validation checks to ensure the questions have
 *  been correctly answered.
 *
 ***************************************************************/


export function increase() {
  if ((questions[flowCount].required === true && options.choices.length <= 0)) {
    createToast('This is a Required Question!', true);
  } else if ($('input-question-' + (flowCount + 2)) && $('input-question-' + (flowCount + 2)).type === 'number' && (parseInt($('input-question-' + (flowCount + 2)).value) < parseInt($('input-question-' + (flowCount + 2)).min) || parseInt($('input-question-' + (flowCount + 2)).value) > parseInt($('input-question-' + (flowCount + 2)).max))) {
    createToast('Select a Number Between ' + $('input-question-' + (flowCount + 2)).min + ' and ' + $('input-question-' + (flowCount + 2)).max, true);
  } else {
    handleAnswers();
    if (flowCount < arrOfCards.length) {
      flowCount++;
      $('card-' + flowCount).classList.add('card-remove');
      shuffle('shuffle');
      FX.progressCheck(flowCount, arrOfCards.length + 1);
    }
  }
}

export function decrease() {
  if (flowCount !== 0) {
    $('card-' + flowCount).classList.remove('card-remove');
    flowCount--;
    if (arrOfCards[flowCount + 3]) {
      $('root').removeChild(arrOfCards[flowCount + 3]);
    }
    shuffle('shuffle');
    FX.progressCheck(flowCount, arrOfCards.length + 1);
  }
}


/****************************************************************
 *
 *  This function will allow the user to submit the questionnaire
 *  It will take the data from the answers array, stringify it
 *  and send it to the backend to be processed and posted onto
 *  the database.
 *
 ***************************************************************/


// SORT OUT
function timeDifference() {
  const endTime = new Date();
  answersObject.time = -diff_minutes(startTime, endTime);
}
function diff_minutes(dt2, dt1) {
  const diff = (dt2 - dt1) / 1000;
  return (diff);
}


export async function submitQuiz() {
  FX.submitAnimation();
  timeDifference();
  const submit = await fetch('/api/submit/' + uid.id, {
    method: 'POST',
    body: JSON.stringify(answersObject),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (submit.ok) {
    createToast('Quiz Submitted!', false);
  } else {
    createToast('Submission Failed!', true);
  }

  // CHANGE THIS TO RENDERTEXT, USE EVENTHANDLER JS
  const link = document.createElement('p');
  link.addEventListener('click', function () {
    downloadCSV({ filename: questionDataObject[0].title + '.csv' });
  });
  link.classList.add('result-message-sent');
  link.textContent = 'Tap here to download your answers';
  $('root').appendChild(link);
}


/*********************************************************
 *
 * Download the users answers as a CSV
 *
 ********************************************************/

function downloadCSV(args) {
  let csv = convertArrayOfObjectsToCSV({
    data: answersObject.responses,
  });
  if (csv == null) return;

  const filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  const data = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

function convertArrayOfObjectsToCSV(args) {
  let result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });
  return result;
}


/**
 * Take an array of objects of similar structure and convert it to a CSV.
 * @source     https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
 * @modifiedBy sators
 * @param      {Array}  options.data            Array of data
 * @param      {String} options.columnDelimiter Column separator, defaults to ","
 * @param      {String} options.lineDelimiter   Line break, defaults to "\n"
 * @return     {String}                         CSV
 */
export default ({ data = null, columnDelimiter = ',', lineDelimiter = '\n' }) => {
  let result, ctr, keys;

  if (data === null || !data.length) {
    return null;
  }

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(item => {
    ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) {
        result += columnDelimiter;
      }

      result += typeof item[key] === 'string' && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};
