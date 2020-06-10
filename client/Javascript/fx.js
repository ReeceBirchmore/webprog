'use strict';

import { $, renderText } from './render.js';

/*************************************************************************
*
* Progress Bar and Question Number Management
* @property {Int} val The number (for example, the current question number the user is on)
* @property {Int} quizLength The overall length of the quiz
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
