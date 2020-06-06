'use strict';

import Input from '/Components/Input/input.js';
import Divider from '/Components/Divider/divider.js';
import Icon from '/Components/Icon/icon.js';
import Toggle from '/Components/Input/toggle.js';

import { $, renderText, html } from '/Javascript/render.js';
import * as Admin from '/Containers/Admin/index.js';
import * as Edit from '/Containers/Edit/index.js';


export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
    this.createEditCardTemplate(props);
    this.constructOverlay(props);
    this.addHandlers(props);
    return this.el;
  }

  createEditCard(props) {
    // Overall Cards Container
    this.giantContainer = html('div', 'giantcontainer-' + props.id, $('root'), 'card-container');
    this.giantContainer.addEventListener('click', function () {
      Edit.cardButtonsOverlay(props.id);
    });

    // Overlay for extra settings buttons, under the card, revelead by action
    this.overlay = html('div', 'overlay-' + props.id, this.giantContainer, 'overlay-container');
    this.overlay.addEventListener('click', function () {
      event.stopPropagation();
    });

    // The main attraction, the card itself, change to HTML function
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('card-edit', 'elevated');
    this.el.addEventListener('click', function () {
      event.stopPropagation();
    });

    // Append the card to the container (Change to render function)
    $('giantcontainer-' + props.id).append(this.el);
  }

  createEditCardTemplate(props) {
    // Question Number
    const titleContainer = html('div', '', this.el, 'card-title-container');
    renderText(titleContainer, 'Question ' + props.questionNum, 'h2');

    // Hamburger Icon
    const menuIcon = new Icon({ id: 'hamburger', renderPoint: titleContainer, actions: function () { Edit.cardButtonsOverlay(props.id); } });

    // Title Input
    this.input = new Input({ id: 'input-' + props.id, placeholder: props.title, value: props.title, type: 'text', datanumber: props.id, mode: 'edit' });
    this.el.append(this.input);

    // Select Type Input
    this.select = new Input({ id: 'selector-' + props.id, type: 'select', types: ['text', 'number', 'single-select', 'multi-select'], value: props.input, qid: props.qid });
    this.el.append(this.select);
  }


  constructOverlay(props) {
    renderText(this.overlay, 'Settings', 'h2', '', 'p');

    // Basic structure of settings, one box to contain text and toggles
    const requiredBox = html('div', '', this.overlay, 'optionbox');

    // Required Question Toggle, RENAME ALL THIS BEFORE DEPLOYMENT
    const fucker = html('div', 'cunt', requiredBox, 'fuckingContainer');
    const requiredToggle = new Toggle();
    fucker.append(requiredToggle);
    const text = renderText(requiredBox, 'Required', 'p', '', 'fuckingText');


    const deleteBox = html('div', '', this.overlay, 'optionbox');
    const deletebtn = document.createElement('button');
    deletebtn.id = 'file-upload';
    deletebtn.type = 'file';
    deletebtn.textContent = "Delete Question";
    deletebtn.classList.add('button');
    deleteBox.appendChild(deletebtn);
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
