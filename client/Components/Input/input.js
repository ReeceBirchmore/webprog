'use strict'

import { renderText, $, createToast, render, removeRender } from '../../Javascript/render.js';
import { toastClear } from '../../Javascript/fx.js'
import { j, answers1 } from '../../Containers/Quiz/index.js';

function setState(props) {
  //set text here if exists within the local storage
}

export let textHolder;



export let options = { qNumber: '', choices: [], title: '' };


let selection;
let inputIndex;






export default class Input {
  constructor(props) {
    //this.setType(props);
    this.createInputType(props);
    return this.group;
  }

 

  createInputType(props) {
    this.group = document.createElement('div');
      this.group.classList.add('group');

    if(props.type === 'select') {
      console.log("DRFFGfd")
      let wrap = document.createElement('div');
        wrap.classList.add('wrap')
      let group = document.createElement('div');
        group.classList.add('select');
      let input = document.createElement('select');
        input.classList.add('select-text');
        input.id = props.id;
      props.types.forEach(option => {
          let selectOption; selectOption = document.createElement('option');
          selectOption.text = option;
          selectOption.classList.add('option')
          input.add(selectOption);
      });
      let highlight = document.createElement('span');
        highlight.classList.add('select-highlight');
      let selectBar = document.createElement('span');
        selectBar.classList.add('select-bar');
      this.group.append(wrap);
      wrap.append(group);
      group.append(input, highlight, selectBar)
    }

    if(props.type === 'text' || props.type === 'number') {  
      let input = document.createElement('input');
        input.type = props.type;
        if(props.placeholder) input.placeholder = props.placeholder;
        if(props.value) input.value = props.value;
        input.id = props.id
      let highlight = document.createElement('span');
        highlight.classList.add('highlight')
      let bar = document.createElement('span');
        bar.classList.add('bar');
      this.group.appendChild(input);
      this.group.appendChild(highlight);
      this.group.appendChild(bar);
      this.keyUpEventListener(input, props);
    }

    if(props.type === 'single-select') { 
      let input = document.createElement('input');
        input.type = 'radio';
        input.name = props.name;
        input.id = props.id;
        input.value = props.options;
        //Need to seperate question choices from answers table to allow 3D quizzing
        //if(props.linkedQ != null) input.setAttribute('data-link-q', props.linkedQ)
      let textLabel = document.createElement('label');
        textLabel.setAttribute('for', props.id);
        textLabel.classList.add('pure-material-radio');
      let span = document.createElement('span');
        span.textContent = props.options; 
      this.group.append(textLabel);
      textLabel.appendChild(input);
      textLabel.appendChild(span);
      this.radioEventListener(this.group, props);
    }

    if(props.type === 'multi-select') {
      let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = props.name;
        input.id = props.id;
        input.value = props.options;
      let textLabel = document.createElement('label');
        textLabel.setAttribute('for', props.id);
        textLabel.classList.add('pure-material-checkbox');
       let span = document.createElement('span');
        span.textContent = props.options; 
      this.group.append(textLabel);
      textLabel.appendChild(input);
      textLabel.appendChild(span);
      this.checkboxEventListener(this.group, props);
    }
  }





  setRestrictions(props) {

  }





    radioEventListener(el, props) {
      el.addEventListener('change', function(e) {
            options.qNumber = j + 1;
            options.choices = [e.target.value];
            options.linkedQ = e.target.getAttribute('data-link-q');
        return;
    });
  }
    checkboxEventListener(el, props) {
      el.addEventListener('change', function(e) {
              options.qNumber = j + 1;
              options.choices.push(e.target.value);
          return;
      });
    }
    keyUpEventListener(el, props) {
      el.onblur = function() {
          options.qNumber = j + 1;
          options.choices.push(el.value);
        return;
    }
  }
}
