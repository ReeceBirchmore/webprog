'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
import * as Quiz from '/Javascript/quiz.js';

const actionStyles = {
  'color': '#ffeb3b',
  'text-transform': 'uppercase',
  'padding-left':'2rem',
}




function dismiss() {
  FX.toastClear();
}





export default class Progress {
  constructor(props, quiz) {
    this.createBar(props);
    Render.render(this.el, Render.$('root'));
    this.setProgress(Quiz.quiz);
    return this.el;
  }

    createBar(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add('metre');
    }

    setProgress(quiz) {
      this.span = document.createElement("span");
        this.span.id = "progressSpan";
        //Render.renderText(this.el, quiz[1].questions.length);
        Render.render(this.span, this.el);
        FX.progressCheck();
    }


}


