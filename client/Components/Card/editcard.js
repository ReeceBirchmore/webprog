'use strict';

import Input from '/Components/Input/input.js';
import Divider from '/Components/Divider/divider.js';
import Icon from '/Components/Icon/icon.js';
import Toggle from '/Components/Toggle/toggle.js';

import { $, renderText, html, render } from '/Javascript/render.js';
import * as Admin from '/Containers/Admin/index.js';
import * as Edit from '/Containers/Edit/index.js';


export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
    this.createEditCardTemplate(props);
    this.addHandlers(props);
    return this.el;
  }

  createEditCard(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('card-linear', 'elevated');
    this.toggle = new Toggle({ renderPoint: this.el });
  }

  createEditCardTemplate(props) {
    // Question Number
    const titleContainer = html('div', '', this.el, 'card-title-container');
    renderText(titleContainer, 'Question ' + props.questionNum, 'h2');

    // Title Input
    this.input = new Input({ id: 'input-' + props.id, placeholder: props.title, value: props.title, type: 'text', datanumber: props.id, mode: 'edit' });
    this.el.append(this.input);

    // Select Type Input
    this.select = new Input({ id: 'selector-' + props.id, type: 'select', types: ['text', 'number', 'single-select', 'multi-select'], value: props.input, qid: props.qid });
    this.el.append(this.select);
    

    render(this.el, $('root'));
  }




  createAddQuestionTemplate(props) {
    // code here
  }

  addHandlers(props) {
    if (this.binIcon) {
      this.binIcon.addEventListener('click', function () {
        const popup = window.confirm('Are you sure you want to delete ' + props.title);
        if (popup === true) Admin.deleteQuestion(props.id, props.quizTitle);
      });
    }
    if (props.type === 'add') {
      this.el.addEventListener('click', function () {
        Admin.addQuestion();
      });
    }
  }
}
