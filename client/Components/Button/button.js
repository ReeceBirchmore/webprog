'use strict';


import { $, render, renderText, html } from '/Javascript/render.js';
import * as Quiz from '/Containers/Quiz/index.js';
import * as Admin from '/Containers/Admin/index.js';
import * as FX from '/Javascript/fx.js';


function addHandler(el, props) {
  el.addEventListener('click', function () {
    if (props.action === 'Quiz.up') {
      Quiz.increase(0);
    }

    if (props.action === 'Quiz.down') {
      Quiz.decrease(0);
    }


    if (props.action === 'routerNav') {
      Router.get(props.action);
    }


    if (props.action === 'toast') {
      FX.toastManagement();
    }


    if (props.action === 'progress') {
      FX.progressCheck(props.param);
    }


    if (props.action === 'openQuiz') {
      Quiz.openQuiz(props.param);
    }


    if (props.action === 'toLinear') {
      Quiz.toLinear(props.param);
    }


    if (props.action === 'submit') {
      Quiz.submitQuiz();
    }


    if (props.action === 'upload') {
      Admin.uploadJSON();
    }

    if (props.action === 'createQuiz') {
      Admin.createNewQuiz({ answers }.answers.response[0].value);
    }
  });
}

export let input1;


export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles(props);
    addHandler(this.el, props);
    this.renderPoint(props);
  }

  createBtn(props) {
    this.el = html('button', props.id, '', 'button');
    this.el.classList.add('ripple');
    const text = renderText(this.el, props.text);
    text.classList.add('button-text');
  }

  generateStyles(props) {
    switch (props.type) {
      case 'previous':
        this.el.classList.add('left');
        break;

      case 'next':
        this.el.classList.add('right');
        break;

      case 'submit':
        this.el.classList.add('submit');
        break;
    }

    if (props.type === 'create') {
      const text = document.createElement('div');
      renderText(text, 'Create Quiz');
      text.classList.add('div');
      this.el.appendChild(text);
      this.el.classList.add('upload');
    }

    if (props.type === 'else') {
      // empty code
    }
  }


  renderPoint(props) {
    if (!props.render) {
      render(this.el, $('root'));
    } else {
      render(this.el, $(props.render));
    }
  }
}
