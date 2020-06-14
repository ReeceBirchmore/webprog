'use strict';

import { renderText, render, html, createToast } from '/Javascript/render.js';
import { cardCounter, answersObject, increase, handleAnswers } from '/Containers/Quiz/index.js';
import { changeQuestionType } from '/Containers/Edit/index.js';


export const options = { qNumber: '', choices: [], title: '', type: '' };


/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID to assign the element, recommended for further referencing
 *  @property {Int}         props.name For Multi Option questions, allows reference to a group of options
 *  @property {Array}       props.options List of options (If the input type is multiple option)
 *  @property {HTMLElement} props.renderPoint Reference for where to attach the input (REQUIRED)
 *  @property {String}      props.type The type of input to be displayed
 *  @property {Int}         props.min The minimum value for a number input
 *  @property {Int}         props.min The maximum value for a number input
 *  @property {Boolean}     props.eventListeners If true, use the event listeners built into this file, else, disregard
 *
 *
 *  The inputs are called upon by all files (minus Response index.js)
 *
 *  Example of use:
 *
 *  const input = new Input({
 *     id: 'input-' + x + '-question-' + qNum,
 *     type: question.input,
 *     options: question.options[x],
 *     name: qNum,
 *     renderPoint: quesContainer,
 *     min: question.min,
 *     max: question.max
 *   });
 *
 */


export default class Input {
  constructor(props) {
    this.createInputGroup(props);
    this.generateType(props);
    if (props.renderPoint) render(this.group, props.renderPoint);
    return this.group;
  }


  createInputGroup() {
    this.group = document.createElement('div');
    this.group.classList.add('group');
  }

  generateType(props) {
    switch (props.type) {
      case 'select':
        const wrap = html('div', '', this.group, 'wrap');
        const group = html('div', '', wrap, 'select');
        const input = html('select', props.id, group, 'select-text');
        input.setAttribute('data-number', props.qid);
        props.types.forEach(option => {
          const selectOption = html('option', '', '', 'option');
          if (option === props.value) selectOption.selected = true;
          selectOption.text = option;
          input.add(selectOption);
        });
        html('span', '', group, 'select-highlight');
        html('span', '', group, 'select-bar');
        dropdownEventListener(input, props);
        break;

      case 'text':
      case 'number':
        this.input = html('input', props.id, this.group);
        if (props.placeholder) this.input.placeholder = props.placeholder;
        if (props.type) this.input.type = props.type;
        if (props.value) this.input.value = props.value;
        if (props.min) this.input.min = props.min;
        if (props.max) this.input.max = props.max;
        html('span', '', this.group, 'highlight');
        html('span', '', this.group, 'bar');
        if (props.eventListeners !== false) keyUpEventListener(this.input, props);
        break;

      case 'single-select':
        this.group.classList.add('selector-toolbar');
        this.input = html('input', props.id, this.group);
        this.input.type = 'radio';
        if (props.name) this.input.name = props.name;
        if (props.options) this.input.value = props.options;
        this.textLabel = html('label', '', this.group);
        if (props.id) this.textLabel.setAttribute('for', props.id);
        renderText(this.textLabel, props.options, 'span');
        if (props.eventListeners !== false) radioEventListener(this.input, props);
        break;

      case 'multi-select':
        this.group.classList.add('selector-toolbar');
        this.input = html('input', props.id, this.group);
        this.input.type = 'checkbox';
        if (props.name) this.input.name = props.name;
        if (props.options) this.input.value = props.options;
        this.textLabel = html('label', '', this.group);
        if (props.id) this.textLabel.setAttribute('for', props.id);
        renderText(this.textLabel, props.options, 'span');
        if (props.eventListeners !== false) checkboxEventListener(this.input, props);
        break;
    }
  }
}

// The below code is to handle the states of the inputs, each input will report the values back to the
// main calling JS file (quiz index.js) and store the answers using eventlisteners

// Dropdown Event Listeners
function dropdownEventListener(el) {
  el.addEventListener('change', function () {
    changeQuestionType(el.dataset.number);
  });
}


// Radio Event Listeners
function radioEventListener(el) {
  el.addEventListener('change', function (e) {
    options.qNumber = cardCounter + 1;
    options.choices = [e.target.value];
    options.linkedQ = e.target.getAttribute('data-link-q');
    options.type = el.type;
  });
}

// Checkbox Event Listeners
function checkboxEventListener(el) {
  el.addEventListener('change', function (e) {
    const inputIndex = answersObject.responses.findIndex(question => question.qid === cardCounter + 1);
    if (el.checked === true) {
      if (inputIndex !== -1) {
        answersObject.responses[inputIndex].choices[0].push(e.target.value);
        options.type = el.type;
      } else {
        options.qNumber = cardCounter + 1;
        options.choices.push(e.target.value);
        options.type = el.type;
      }
    } else {
      if (answersObject.responses[inputIndex]) {
        const valueToDelete = answersObject.responses[inputIndex].choices[0].findIndex(choice => choice === e.target.value);
        if (valueToDelete !== -1) {
          answersObject.responses[inputIndex].choices[0].splice(valueToDelete, 1);
        }
      } else {
        const valueToDelete = options.choices.findIndex(choice => choice === e.target.value);
        options.choices.splice(valueToDelete, 1);
      }
    }
  });
}

// Text/Number Field Event Listeners
// Built in error validation
function keyUpEventListener(el) {
  el.addEventListener('input', function (e) {
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
      e.preventDefault();
      createToast('Entry Must Be Between ' + el.max + ' and ' + el.min, true);
      return;
    }
   
    options.qNumber = cardCounter + 1;
    options.choices[0] = el.value;
    options.type = el.type;
  });
  el.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      handleAnswers();
      increase();
    }
  });
}
