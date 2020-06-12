/* eslint-disable no-unused-vars */
'use strict';

import Input from '/Components/Input/input.js';
import Divider from '/Components/Divider/divider.js';
import Icon from '/Components/Icon/icon.js';
import Toggle from '/Components/Toggle/toggle.js';

import { $, renderText, html, render, pointer } from '/Javascript/render.js';
import * as Admin from '/Containers/Admin/index.js';
import * as Edit from '/Containers/Edit/index.js';

import { optionTextCount, addOption, removeOptionEventListeners } from '/Containers/Edit/index.js';

export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
    this.createEditCardTemplate(props);
    this.optionConstraints(props);
    if (props.options !== null) this.optionsGenerate(props);
    this.addHandlers(props);
    return this.el;
  }

  createEditCard(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('card-linear', 'elevated');
  }

  createEditCardTemplate(props) {
    // Question Number and Required Toggle
    const titleContainer = html('div', '', this.el, 'card-title-container');
    renderText(titleContainer, 'Question ' + props.questionNum, 'h2');
    this.toggle = new Toggle({
      id: 'toggle-' + props.qid,
      renderPoint: titleContainer,
    });

    // Title Input
    this.input = new Input({
      id: 'title-' + props.qid,
      placeholder: props.title,
      value: props.title,
      type: 'text',
      renderPoint: this.el,
      eventListeners: false,
    });

    // Select Type Input
    this.select = new Input({
      id: 'selector-' + props.qid,
      type: 'select',
      types: ['text', 'number', 'single-select', 'multi-select', 'range', 'date'],
      value: props.input,
      qid: props.qid,
      eventListeners: false,
      renderPoint: this.el,
    });

    // Render the card on the page
    render(this.el, $('root'));

    // Append a pre-prepared group to the card
    this.group = html('div', 'group-' + props.qid, $('card-' + props.qid));
    this.group.setAttribute('data-type', props.input);
  }


  optionConstraints(props) {
    // Number Input Constraints (Min/Max)
    if (props.input === 'number') {
      this.min = new Input({
        id: 'min-' + props.qid,
        placeholder: 'Enter Min',
        type: 'text',
        renderPoint: this.group,
        eventListeners: false,
      });
      this.max = new Input({
        id: 'max-' + props.qid,
        placeholder: 'Enter Max',
        type: 'text',
        renderPoint: this.group,
        eventListeners: false,
      });
    }
    // Multi Option Input
    if (props.input === 'single-select' || props.input === 'multi-select') {
      this.optionInput = new Input({
        id: 'optionInput-' + props.qid,
        placeholder: 'Enter options',
        type: 'text',
        renderPoint: this.group,
        eventListeners: false,
      });
      renderText($('group-' + props.qid), pointer + ' options to delete', 'p', '', 'subtext');
      this.addEventHandlers(props);
    }
  }


  /******************************************************************************
   *
   * The below function will is used to list any options that already exist for
   * the question, it will find their position in the options array and use this
   * as the options ID, this means that adding more later on can be simplified by
   * using this method, making detection, addition and removal much easier.
   *
   * 1) Create a group box for all the options (for easier removal when switching)
   * 2) Cycle through the props.options array of existing options
   * 3) Find the array index, set that as the options ID and append it to the group
   *
   ******************************************************************************/

  optionsGenerate(props) {
    this.optionsGroup = html('div', 'options-' + props.qid, this.el, 'option_group');

    props.options.forEach(options => {
      const inputIndex = props.options.findIndex(option => option === options);
      const option = html('div', 'option-' + inputIndex, this.optionsGroup, 'selector-toolbar');
      renderText(option, options, 'p', '', 'option_text');
      removeOptionEventListeners(props.qid, inputIndex, $('optionInput-' + props.qid).value);
    });
  }


  /******************************************************************************
   *
   * The below function will attach event listeners to the inputs so we can modify
   * the data for saving the questionnaire state
   *
   * 1) Wait until the enter key has been pressed
   * 2) Run the addOption function in the Edit index.js (Add the option to props.options)
   * 2A) IF the addOption returns true (Value isn't a duplicate) proceed, else, stop
   * 3) Search through the updated props.options, find the index of the new value
   * 4) Create an element, give it the ID of the index found above
   * 5) Render the text value onto the element
   * 6) Clear the input ready for the next value
   *
   ******************************************************************************/

  addEventHandlers(props) {
    this.optionInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (addOption($('optionInput-' + props.qid).value, props.qid) === true) {
          const inputIndex = props.options.findIndex(option => option === $('optionInput-' + props.qid).value);
          const newOption = html('p', 'option-' + inputIndex, $('options-' + props.qid), 'selector-toolbar');
          renderText(newOption, $('optionInput-' + props.qid).value, 'p', '', 'option_text');
          removeOptionEventListeners(props.qid, inputIndex, $('optionInput-' + props.qid).value);
          $('optionInput-' + props.qid).value = '';
        }
      }
    });
  }


  /******************************************************************************
   *
   * The below function will attach event listeners to the icons so we can delete
   * or insert questions
   *
   *
   ******************************************************************************/

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
