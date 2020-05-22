'use strict';

import { $, renderText, html } from '../../Javascript/render.js';


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
