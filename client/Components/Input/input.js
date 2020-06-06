'use strict';

import { renderText, $, createToast, render, removeRender, html } from '../../Javascript/render.js';
import { toastClear } from '../../Javascript/fx.js';
import { flowCount, answersObject, increase } from '../../Containers/Quiz/index.js';

import * as Admin from '../../Containers/Admin/index.js';
import * as Edit from '/Containers/Edit/index.js';


export const options = { qNumber: '', choices: [], title: '', type: '' };


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
      case undefined:
        this.input = html('input', props.id, this.group);
        if (props.placeholder) this.input.placeholder = props.placeholder;
        if (props.type) this.input.type = props.type;
        if (props.value) this.input.value = props.value;
        this.highlight = html('span', '', this.group, 'highlight');
        this.bar = html('span', '', this.group, 'bar');
        this.keyUpEventListener(this.input, props);
        break;

      case 'single-select':
        this.group.classList.add('selector-toolbar');
        this.input = html('input', props.id, this.group);
        this.input.type = 'radio';
        if (props.name) this.input.name = props.name;
        if (props.options) this.input.value = props.options;
        // Need to seperate question choices from answers table to allow 3D quizzing
        // if(props.linkedQ != null) input.setAttribute('data-link-q', props.linkedQ)
        this.textLabel = html('label', '', this.group);
        if (props.id) this.textLabel.setAttribute('for', props.id);
        renderText(this.textLabel, props.options, 'span');
        this.radioEventListener(this.input, props);
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
        this.checkboxEventListener(this.input, props);
        break;
    }
  }


  setType() {
    // code for setting type
  }

  setAttributes() {
    // code for setting attributes
  }


  /* Event listeners to rework */

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
          console.log("EXISTS")
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
      console.log(el.id);
      window.sessionStorage.setItem(el.id, el.value);
      options.qNumber = flowCount + 1;
      options.choices.push(el.value);
      options.type = el.type;
    };
    el.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') increase();
    });
  }
}
