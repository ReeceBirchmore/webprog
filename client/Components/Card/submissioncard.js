'use strict';

import { $, renderText, html } from '/Javascript/render.js';

/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID to assign the element, recommended for further referencing
 *  @property {Array}       props.answers Stored Object Array of the answers given from the user
 *
 *  The submission card is called in the StackManagement.js file
 *
 *  Example of use:
 *
 *  const card = new SubmissionCard({
 *    id: 'card-submit',
 *    answers: answersObject.responses,
 *  });
 *
 */


export default class SubmissionCard {
  constructor(props) {
    this.createCard(props);
    this.generateEnvelope(props);
  }

  createCard(props) {
    this.el = html('div', (!props.id) ? '' : props.id, '', '');
    this.el.classList.add(((!props.class) ? 'card' : props.class), 'elevated');
  }


  generateEnvelope(props) {
    const article = html('article', 'envelopearticle', $('root'), 'letter');
    const side1 = html('div', 'envelopeside1', article, 'side');
    const scrollContainer = html('div', 'scroll-container', side1, 'scroll-container');
    renderText(scrollContainer, 'Your answers:', 'h2');
    for (let i = 0; i < props.answers.length; i++) {
      const container = html('div', '', scrollContainer, 'previewContainer');
      const qNum = renderText(container, props.answers[i].qid + '. ' + props.answers[i].title);
      qNum.classList.add('qNum');
      renderText(container, props.answers[i].choices + ' ');
    }
    const side2 = html('div', 'envelopeside2', article, 'side');
    const divFront = html('div', 'envelopefront', $('root'));
    divFront.classList.add('envelope', 'envelopefront');
    const divBack = html('div', 'envelopeback', $('root'));
    divBack.classList.add('envelope', 'envelopeback');
  }
}
