'use strict';

import { $, renderText } from './render.js';


/*************************************************************************
*
* Toast Notification Animation Management
*
**************************************************************************/

let linger;


export function toastManagement() {
  setTimeout(function () {
    $('toast').classList.add('appear');
  }, 100);

  linger = setTimeout(function () {
    if (!bool) {
      $('toast').classList.add('remove');
      $('toast').classList.remove('appear');
    }
  }, 3000);

  destroy = setTimeout(function () {
    if (!bool) {
      $('root').removeChild($('toast'));
    }
  }, 3500);
}

export function toastClear() {
  
}


/*************************************************************************
*
* Modal Animation Management
*
**************************************************************************/

export function bounceModal() {
  console.log($('modal'));
  $('modal').classList.add('bounce-in');
}


/*************************************************************************
*
* Progress Bar and Question Number Management
*
**************************************************************************/

export function progressCheck(val, quizLength) {
  if ($('qnumber')) {
    if (val < quizLength - 1) { $('qnumber').textContent = val + 1 + ' of ' + (quizLength - 1); }
    if (val === quizLength - 1) { $('qnumber').textContent = 'Finished'; }
  }
  const prog = $('progressSpan');
  prog.style.width = (val / (quizLength - 1)) * 100 + '%';
}


/*************************************************************************
*
* Submission Animation Management, envelope animation
*
**************************************************************************/

export function submitAnimation() {
  $('envelopearticle').classList.add('letter-sent');
  $('envelopeside1').classList.add('side-sent');
  $('envelopefront').classList.add('envelope-sent');
  $('envelopeback').classList.add('envelope-sent');
  $('submitbtn').style.display = 'none';
  if ($('prevbtn')) $('prevbtn').style.display = 'none';
  const text = renderText($('root'), 'Thanks for completing this questionnaire');
  text.classList.add('result-message-sent');
  $('progressSpan').style.display = 'none';
  $('qnumber').style.display = 'none';
}
