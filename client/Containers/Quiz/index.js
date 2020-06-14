/* eslint-disable no-unused-vars */
'use strict';


import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import Input, { options } from '/Components/Input/input.js';
import Progress from '/Components/Progress/progress.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';

import { $, renderText, createToast, html, render, responseType, pointer } from '/Javascript/render.js';
import * as FX from '/Javascript/fx.js';
import eventHandler from '/Javascript/eventhandlers.js';
import { shuffle } from '/Javascript/stackManagement.js';


// #endregion Imports
// ////////////////////////////////////////////////////////////// Declare widely used variables
// #region  Variable Declaration

export const answersObject = { responses: [], time: '' }; // Object Array used to store answers as the user progresses
export let flowCount = 0; // Card Stack Position Counter
export const arrOfCards = []; // Array of HTML card elements generated for the quiz
export const cardStackArr = { cards: [] }; // cardStackArray, used for visible cards on screen
export let questions; // Used to store questions array pulled from database

let questionDataObject; // Questionnaire Data Object pulled from database
let uid; // Quiz ID


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

/****************************************************************************************
*
*  This function will start the process of pulling the data
*  from the database, dragging out quiz data (settings)
*  If the data fetch is succesful, it will begin to load some
*  elements onto the screen
*
*  1) Run the fetch request to retrieve the questionnaire data
*  2) Store this data in the questionnaireDataObject variable
*  3) Perform a check to ensure the data being pulled is correctly formatted
*  4) Perform a check to ensure the questionnaire is enabled (via the editor)
*  5) Check if the questionnaire has restricted the submission attempts
*     - Perform a check to ensure the user isn't attempting to return for a second submission
*     - IF the user has already submitted once, end the loading process and do NOT proceed.
*  6) Generate the Footer
*  7) Generate the Next Button, append it to Footer and attach the increase(); action
*  8) Perform a check to see if the questionnaire allows for use of the back button
*     - IF yes, generate the Previous button
*     - IF no, do not generate a button
*  9) run the generateQuestions() function, pass through the UID (quizID)
*
****************************************************************************************/

export async function generateQuestionnaire(uid) {
  const questionnaire = await fetch('/api/quizzes/' + uid.id);
  if (questionnaire.ok) {
    questionDataObject = await questionnaire.json();
  } else {
    createToast('Failed To Load The Quiz', true);
    return;
  }

  if (questionDataObject[0] !== undefined) {
    // Prevent loading if the questionnaire has been disabled
    if (questionDataObject[0].enabled === false) {
      createToast('This Questionnaire Has Been Disabled', true);
      return;
    }


    // Prevent multiple submissions if the questionnaire has the submission restrictions enabled
    if (questionDataObject[0].restrict === true && window.localStorage.getItem(uid.id) === 'true') {
      createToast('You Are Only Allowed One Attempt', true);
      return;
    }

    // Generate the footer
    const footer = new Footer();

    // Generate the Next Button
    const button = new Button({
      id: 'nextbtn',
      text: 'Next',
      action: function () { increase(); },
      render: 'Footer',
      class: 'right',
    });

    // Generate the Back Button (IF allowback is enabled)
    if (questionDataObject[0].allowback !== false) {
      const button = new Button({
        id: 'prevbtn',
        text: 'Previous',
        action: function () { decrease(); },
        render: 'Footer',
        class: 'left',
      });
      $('nextbtn').style.width = '8rem';
    }

    // Run the generateQuestions function, pass through the UID (quiz ID)
    generateQuestions(uid);
  } else {
    createToast('This Quiz Does Not Exist', true);
  }
}


/****************************************************************
 *
 *  This function will pull that questions from the database,
 *  based off the ID (uid.id) pulled from the URL above.
 *
 *  If the fetch is succeful, it will start the generateCards
 *  function and create an object variable named questions.
 *
 *  Generate the Navbar, the details on the nav are dependant on
 *  whether the fetch requests were succesful
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
  const nav = new Nav({
    id: 'nav',
    title: questionDataObject[0].title,
    icons: [(questionDataObject[0].allowback !== false) ? 'clear' : null],
    actions: [function () { if (questionDataObject[0].allowback !== false) { location.reload(); } }],
  });
}


/****************************************************************************************
*
*  function generateCards(questions)
*
*  @property {Object} questions - The array of all questions retrieved for the questionnaire
*
*  This function will setup the Progress Bar, Cards and Inputs
*  for the page.
*
*  1) Load the progress bar, we will use the questions.length
*     to measure the progress of the questionnaire
*  2) Define the qNum, this is to keep track of the question
*     number as it is created.
*  3) Load up a forEach loop on the questions object array:
*     - Create a new card object, ID as card-qNum.
*     - Create the text of the question using question.question.
*     - Set the text to For the input (to allow better accessibility).
*     - Create the question containers, the container is of a fixed
*       size to ensure scrolling is forced if overflowing.
*     - Iterate over the questions that have multiple options.
*        - Create a new input, give it the appropriate type, name, ID and options
*          And set its renderPoint to the container created above.
*        - Ensure the input creation contains any and all restrictions required.
*     - Iterate over the questions that are not multiple input.
*        - Create a new input, give it the appropriate type, name, ID and set its
*          renderPoint to the container created above.
*        - Ensure the input creation contains any and all restrictions required.
*  4) Push the newly created card (with all attached components) to the array arrOfCards
*  5) Once complete, run the shuffle function (located in the stackManagement.js)
*
***************************************************************************************/

function generateCards(questions) {
  // Generate the progress bar
  const progress = new Progress({
    id: 'progressBar',
    qnum: '1 of ' + questions.length,
  });

  // Define the question number (Used for IDs)
  let qNum = 1;

  // Begin looping through the returned questions array
  questions.forEach(question => {
    // Generate A Card
    const card = new Card({ id: 'card-' + qNum });

    // Generate the Response Type Hint
    responseType(card, question);

    // Generate the Restrictions Hint

    // Generate The Question Text
    const text = renderText(card, question.question, 'label', '', 'label');
    text.setAttribute('for', 'input-question-' + qNum);

    // Generate A Container For Inputs
    const questionContainer = html('div', '', card, 'scroll-container');

    // Generate the Multiple Choice Question Variants
    if (question.options !== null && question.options.length > 0) {
      for (let x = 0; x < question.options.length; x++) {
        const input = new Input({
          id: 'input-' + x + '-question-' + qNum,
          type: question.input,
          options: question.options[x],
          name: qNum,
          linkedQ: 3,
          renderPoint: questionContainer,
        });
      }
    } else {
      console.log(question.min, question.max);
      // Generate the Other Question Variants
      const input = new Input({
        id: 'input-question-' + qNum,
        type: question.input,
        title: question.question,
        renderPoint: questionContainer,
        min: question.min,
        max: question.max,
      });
    }


    // Push Card Into Array
    arrOfCards.push(card);
    qNum++;
  });
  // Run the Shuffle Function (stackManagement JS)
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
    choices: (options.choices.length === 0) ? [''] : [options.choices],
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

export async function submitQuiz() {
  if (questionDataObject[0].restrict === true) {
    window.localStorage.setItem(uid.id, true);
  }
  FX.submitAnimation();
  const submit = await fetch('/api/submit/' + uid.id, {
    method: 'POST',
    body: JSON.stringify(answersObject),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (submit.ok) {
    createToast('Quiz Submitted');
  } else {
    createToast('Submission Failed', true);
  }
  console.log(answersObject);
  const link = renderText($('root'), pointer + ' here to download your answers as a CSV', 'p', '', 'result-message-sent');
  eventHandler(link, '', function () { downloadCSV({ filename: questionDataObject[0].title + '.csv' }, answersObject.responses); });
}


/*********************************************************
 *
 * Download the users answers as a CSV
 *
 ********************************************************/


function downloadFile(fileName, urlData) {
  const aLink = document.createElement('a');
  const csv = 'data:text/csv;charset=utf-8,';
  const data = encodeURI(csv);
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', 'test.csv');
  link.click();
}


export function downloadCSV(args, file) {
  const filename = 'export.csv';

  const csv = 'data:text/csv;charset=utf-8,' + csv;

  const data = encodeURI(csv);
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
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
