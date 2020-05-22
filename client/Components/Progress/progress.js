'use strict';

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
import * as Quiz from '/Javascript/quiz.js';


export default class Progress {
  constructor(props) {
    this.createBar(props);
    Render.render(this.el, Render.$('root'));
    this.setProgress(Quiz.quiz);
    return this.el;
  }

  createBar(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('metre');
  }

  setProgress() {
    this.span = document.createElement('span');
    this.span.id = 'progressSpan';
    Render.render(this.span, this.el);
    FX.progressCheck();
  }
}
