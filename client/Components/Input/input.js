'use strict';

import { renderText, $, render, html } from '/Javascript/render.js';
import { flowCount, answersObject, increase, handleAnswers } from '/Containers/Quiz/index.js';
import * as Edit from '/Containers/Edit/index.js';


export const options = { qNumber: '', choices: [], title: '', type: '' };


/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID to assign the element, recommended for further referencing
 *  @property {Int}         props.name For Multi Option questions, allows reference to a group of options
 *  @property {Array}       props.options List of options (If the input type is multiple option)
 *  @property {HTMLElement} props.renderPoint Reference for where to attach the input (REQUIRED)
 *  @property {String}      props.type The type of input to be displayed
 *
 *
 *  Example of use:
 *
 *  const input = new Input({
 *     id: 'input-' + x + '-question-' + qNum,
 *     type: question.input,
 *     options: question.options[x],
 *     name: qNum,
 *     renderPoint: quesContainer,
 *   });
 */


export default class Input {
  constructor(props) {
    this.createInput(props);
    if (props.renderPoint) render(this.group, props.renderPoint);
    return this.group;
  }


  createInput(props) {
    this.group = document.createElement('div');
    this.group.classList.add('group');
    if (props.type === 'select') {
      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      const group = document.createElement('div');
      group.classList.add('select');
      const input = document.createElement('select');
      input.classList.add('select-text');
      input.id = props.id;
      input.setAttribute('data-number', props.qid);
      props.types.forEach(option => {
        const selectOption = document.createElement('option');
        if (option === props.value) selectOption.selected = true;
        selectOption.text = option;
        selectOption.classList.add('option');
        input.add(selectOption);
      });
      const highlight = document.createElement('span');
      highlight.classList.add('select-highlight');
      const selectBar = document.createElement('span');
      selectBar.classList.add('select-bar');
      this.group.append(wrap);
      wrap.append(group);
      group.append(input, highlight, selectBar);
      this.dropdownEventListener(input, props);
    }

    switch (props.type) {
      case 'text':
      case 'number':
        this.input = html('input', props.id, this.group);
        if (props.placeholder) this.input.placeholder = props.placeholder;
        if (props.type) this.input.type = props.type;
        if (props.value) this.input.value = props.value;
        if (props.readOnly) this.input.readOnly = true;
        if (props.min) this.input.min = props.min;
        if (props.max) this.input.max = props.max;

        this.highlight = html('span', '', this.group, 'highlight');
        this.bar = html('span', '', this.group, 'bar');
        if (props.eventListeners !== false) this.keyUpEventListener(this.input, props);
        break;

      case 'single-select':
        this.group.classList.add('selector-toolbar');
        this.input = html('input', props.id, this.group);
        this.input.type = 'radio';
        if (props.name) this.input.name = props.name;
        if (props.options) this.input.value = props.options;
        this.textLabel = html('label', '', this.group);
        // Need to seperate question choices from answers table to allow 3D quizzing
        // if(props.linkedQ != null) input.setAttribute('data-link-q', props.linkedQ)
        if (props.id) this.textLabel.setAttribute('for', props.id);
        renderText(this.textLabel, props.options, 'span');
        if (props.eventListeners !== false) this.radioEventListener(this.input, props);
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
        if (props.eventListeners !== false) this.checkboxEventListener(this.input, props);
        break;
    }
  }

  // The below code is to handle the states of the inputs, each input will report the values back to the
  // main calling JS file (quiz index.js) and store the answers using eventlisteners
  dropdownEventListener(el) {
    el.addEventListener('change', function () {
      Edit.changeQuestionType(el.dataset.number);
    });
  }

  radioEventListener(el) {
    el.addEventListener('change', function (e) {
      options.qNumber = flowCount + 1;
      options.choices = [e.target.value];
      options.linkedQ = e.target.getAttribute('data-link-q');
      options.type = el.type;
    });
  }

  checkboxEventListener(el) {
    el.addEventListener('change', function (e) {
      const inputIndex = answersObject.responses.findIndex(question => question.qid === flowCount + 1);
      if (el.checked === true) {
        if (inputIndex !== -1) {
          console.log(answersObject.responses[inputIndex].choices)
          answersObject.responses[inputIndex].choices.push(e.target.value);
          options.type = el.type;
        } else {
          options.qNumber = flowCount + 1;
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

  keyUpEventListener(el) {
    el.onblur = function () {
      options.qNumber = flowCount + 1;
      options.choices[0] = el.value;
      options.type = el.type;
      console.log(options.choices)
    };
    el.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        handleAnswers();
        increase();
      }
    });
  }
}
