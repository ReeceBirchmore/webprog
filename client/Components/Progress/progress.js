'use strict';

import { $, render, renderText, html } from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


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
    let qnumber = html('p', 'qnumber', this.el, 'p');
    qnumber.textContent = props.qnum;
  }

  setProgress() {
    this.span = document.createElement('span');
    this.span.id = 'progressSpan';
    render(this.span, this.el);
    FX.progressCheck();
  }
}
