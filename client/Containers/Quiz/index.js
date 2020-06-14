'use strict';


import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import Input, { options } from '/Components/Input/input.js';
import Progress from '/Components/Progress/progress.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import Screen from '/Components/Screen/screen.js';
import { $, renderText, createToast, html, responseType, pointer } from '/Javascript/render.js';
import { progressCheck, submitAnimation } from '/Javascript/fx.js';
import eventHandler from '/Javascript/eventhandlers.js';
import { shuffle } from '/Javascript/stackManagement.js';

export const answersObject = { responses: [], time: '' }; // Object Array used to store answers as the user progresses
export let cardCounter = 0; // Card Stack Position Counter
export const arrOfCards = []; // Array of HTML card elements generated for the quiz
export const cardStackArr = { cards: [] }; // cardStackArray, used for visible cards on screen
export let questions; // Used to store questions array pulled from database

let questionnaireObject; // Questionnaire Data Object pulled from database
let quizid; // Quiz ID


/****************************************************************************************
*
*  This function will start the process of creating the screen,
*  generating questions and sorting the card stack
*
****************************************************************************************/

export function generateQuiz(param) {
  const screen = new Screen({
    id: 'quiz',
    class: 'quizScreen',
  });
  quizid = param;
  cardCounter = 0;
  generateQuestionnaire(quizid);
}


/****************************************************************************************
*
*  This function will start the process of pulling the data
*  from the database, dragging out quiz data (settings)
*  If the data fetch is succesful, it will begin to load some
*  elements onto the screen
*
****************************************************************************************/

export async function generateQuestionnaire(quizid) {
  const questionnaire = await fetch('/api/quizzes/' + quizid.id);
  if (questionnaire.ok) {
    questionnaireObject = await questionnaire.json();
  } else {
    createToast('Failed To Load The Quiz', true);
    return;
  }

  // Only proceed if the questionnaireObject is valid
  if (questionnaireObject[0] !== undefined) {
    // Prevent loading if the questionnaire has been disabled
    if (questionnaireObject[0].enabled === false) {
      createToast('This Questionnaire Has Been Disabled', true);
      const nav = new Nav({ title: 'This questionnaire was disabled by the Admin', elevated: true});
      const footer = new Footer();
      return;
    }

    
    // Prevent multiple submissions if the questionnaire has the submission restrictions enabled
    if (questionnaireObject[0].restrict === true && window.localStorage.getItem(quizid.id) === 'true') {
      createToast('You Are Only Allowed One Attempt', true);
      const nav = new Nav({ title: 'You have already submitted a response', elevated: true});
      const footer = new Footer();
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
    if (questionnaireObject[0].allowback !== false) {
      const button = new Button({
        id: 'prevbtn',
        text: 'Previous',
        action: function () { decrease(); },
        render: 'Footer',
        class: 'left',
      });
      $('nextbtn').style.width = '8rem';
    }

    // Run the generateQuestions function, pass through the quizid (quiz ID)
    generateQuestions(quizid);
  } else {
    createToast('This Quiz Does Not Exist', true);
  }
}


/****************************************************************************************
 *
 *  This function will pull that questions from the database, based off the ID (quizid.id)
 *  pulled from the URL above and generate the Nav bar
 *
 ****************************************************************************************/

async function generateQuestions(quizid) {
  const response = await fetch('/api/questions/' + quizid.id);
  if (response.ok) {
    questions = await response.json();
    generateCards(questions);
  } else {
    createToast('Failed to Load Questions', true);
  }
  const nav = new Nav({
    id: 'nav',
    title: questionnaireObject[0].title,
    icons: [(questionnaireObject[0].allowback !== false) ? 'clear' : null],
    actions: [function () { if (questionnaireObject[0].allowback !== false) { location.reload(); } }],
  });
}


/****************************************************************************************
*
*  This function will setup the Progress Bar, Cards and Inputs
*  for the page.
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


/****************************************************************************************
 *
 *  This function will handle the answers, when the next button is pressed it calls upon 
 *  this function to do the following:
 *
 *  - Create a new object
 *  - Use exported data from input.js to fill in the object
 *  - Push the object into an array named Answers
 *
 ****************************************************************************************/

export function handleAnswers() {
  // Answer object to be created to store user data
  const response = {
    qid: cardCounter + 1,
    choices: (options.choices.length === 0) ? [''] : [options.choices],
    title: questions[cardCounter].question,
    type: options.type,
  };

  // Find if the above object already exists in the array (User returning to edit question)
  const inputIndex = answersObject.responses.findIndex(question => question.qid === cardCounter + 1);
  if (inputIndex === -1) {
    answersObject.responses.push(response);
  } else {
    if (options.choices.length !== 0) {
      answersObject.responses[inputIndex].choices = [options.choices];
    }
  }

  // Clear the choices array again ready for the next question
  options.choices = [];
  options.type = '';
}


/****************************************************************************************
*
*  These functions control the flow of the stack, they also perform
*  some validation checks to ensure the questions have
*  been correctly answered.
*
****************************************************************************************/

export function increase() {
  if ((questions[cardCounter].required === true && options.choices.length <= 0)) {
    createToast('This is a Required Question!', true);
  } else if ($('input-question-' + (cardCounter + 2)) && $('input-question-' + (cardCounter + 2)).type === 'number' && (parseInt($('input-question-' + (cardCounter + 2)).value) < parseInt($('input-question-' + (cardCounter + 2)).min) || parseInt($('input-question-' + (cardCounter + 2)).value) > parseInt($('input-question-' + (cardCounter + 2)).max))) {
    createToast('Select a Number Between ' + $('input-question-' + (cardCounter + 2)).min + ' and ' + $('input-question-' + (cardCounter + 2)).max, true);
  } else {
    handleAnswers();
    if (cardCounter < arrOfCards.length) {
      cardCounter++;
      $('card-' + cardCounter).classList.add('card-remove');

      shuffle('shuffle');
      progressCheck(cardCounter, arrOfCards.length + 1);
    }
  }
}

export function decrease() {
  if (cardCounter !== 0) {
    $('card-' + cardCounter).classList.remove('card-remove');
    cardCounter--;
    if (arrOfCards[cardCounter + 3]) {
      $('root').removeChild(arrOfCards[cardCounter + 3]);
    }
    shuffle('shuffle');
    progressCheck(cardCounter, arrOfCards.length + 1);
  }
}


/****************************************************************************************
*
*  This function will allow the user to submit the questionnaire
*  It will take the data from the answers array, stringify it
*  and send it to the backend to be processed and posted onto
*  the database.
*
****************************************************************************************/

export async function submitQuiz() {
  if (questionnaireObject[0].restrict === true) {
    window.localStorage.setItem(quizid.id, true);
  }
  submitAnimation();
  const submit = await fetch('/api/submit/' + quizid.id, {
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
  const link = renderText($('root'), pointer + ' here to download your answers as a CSV', 'p', '', 'result-message-sent');
  eventHandler(link, '', function () { CSV(answersObject.responses); });
}


/****************************************************************************************
*
* Download the users answers as a CSV
*
****************************************************************************************/

function CSV(data) {
  const titles = [];
  const headers = new Object();
  const rows = [];
  let result;
  // Push all questions from the first object into a new object
  for (let i = 0; i < data.length; i++) {
    headers[i] = data[i].title;
    titles.push(headers[i]);
  }
  // First Object Now Contains All Questions (For Top Of CSV Sheet)
  const keys = Object.values(titles);
  result = keys.join(',') + '\n';
  // Build the Records
  for (let i = 0; i < data.length; i++) {
    if (data[i].choices[0].length > 1) {
      const temp = data[i].choices[0].join(' / ');
      rows.push(temp);
    } else {
      rows.push(data[i].choices[0][0]);
    }
  }
  // Push records into CSV
  result += rows.join(',') + '\n';
  // Trigger Download
  downloadCSV(result);
}

function downloadCSV(result) {
  result = 'data:text/csv;charset=utf-8,' + result;
  const data = encodeURI(result);
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', questionnaireObject[0].title + ' Responses.csv');
  link.click();
  return result;
}
