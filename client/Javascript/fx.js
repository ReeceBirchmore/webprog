'use strict';

import { $, renderText } from './render.js';


/*************************************************************************
*
* Toast Notification Animation Management
*
**************************************************************************/

let linger;
let destroy;
let bool = false;

export function toastManagement() {
  bool = false;
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
  $('toast').classList.add('remove');
  $('toast').classList.remove('appear');

  setTimeout(function () {
    bool = true;
    $('body').removeChild($('toast'));
  }, 100);
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
* Progress Bar and Nav Title Animation Management
*
**************************************************************************/

export function progressCheck(val, quizLength) {
  if ($('nav-title')) {
    if (val < quizLength - 1) { $('nav-title').textContent = val + 1 + ' of ' + (quizLength - 1); }
  }
  const prog = $('progressSpan');
  prog.style.width = (val / (quizLength - 1)) * 100 + '%';
}


/*************************************************************************
*
* Submission Animation Management
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
}
