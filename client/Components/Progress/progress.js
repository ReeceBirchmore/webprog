'use strict';

import { $, render, html } from '/Javascript/render.js';
import { progressCheck } from '/Javascript/fx.js';


/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID to assign the element, recommended for further referencing
 *  @property {String}      props.qnum For the initial text to appear (before being controlled by FX Manager)
 *
 *
 *  Example of use:
 *
 *  const progress = new Progress({
 *    id: 'progressBar',
 *    qnum: '1 of ' + questions.length,
 *  });
 */


export default class Progress {
  constructor(props) {
    this.createBar(props);
    render(this.el, $('root'));
    this.questionNumberProgress(props);
    this.setProgress();
    return this.el;
  }

  createBar(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('metre');
  }

  questionNumberProgress(props) {
    const qnumber = html('p', 'qnumber', this.el, 'p');
    qnumber.textContent = props.qnum;
  }

  setProgress() {
    this.span = document.createElement('span');
    this.span.id = 'progressSpan';
    render(this.span, this.el);
    progressCheck();
  }
}
