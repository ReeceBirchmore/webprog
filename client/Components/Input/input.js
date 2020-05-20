'use strict'

import { renderText, $, createToast, render, removeRender } from '../../Javascript/render.js';
import { toastClear } from '../../Javascript/fx.js'
import { j, answers1, increase } from '../../Containers/Quiz/index.js';








export let options = { qNumber: '', choices: [], title: '', type: '' };








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
      let wrap = document.createElement('div');
        wrap.classList.add('wrap')
      let group = document.createElement('div');
        group.classList.add('select');
      let input = document.createElement('select');
        input.classList.add('select-text');
        input.id = props.id;
        input.setAttribute('data-number', '1')
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
      group.append(input, highlight, selectBar);
      this.dropdownEventListener(input, props);
    }

    if(props.type === 'text' || props.type === 'number') {  
      let input = document.createElement('input');
        input.type = props.type;
        if(props.placeholder) input.placeholder = props.placeholder;
        input.id = props.id;
        console.log(input.id)
        input.value = (window.sessionStorage.getItem(input.id)) ? window.sessionStorage.getItem(input.id) : '';
        input.setAttribute('data-number', props.datanumber);
        input.setAttribute('data-mode', props.mode);
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
      this.group.classList.add('selector-toolbar')
      let input = document.createElement('input');
        input.type = 'radio';
        input.name = props.name;
        input.id = props.id;
        input.value = props.options;
        //Need to seperate question choices from answers table to allow 3D quizzing
        //if(props.linkedQ != null) input.setAttribute('data-link-q', props.linkedQ)
      let textLabel = document.createElement('label');
        textLabel.setAttribute('for', props.id);
        //textLabel.classList.add('pure-material-radio');
      let span = document.createElement('span');
        span.textContent = props.options; 
      this.group.append(input, textLabel);
      //textLabel.appendChild(input);
      textLabel.appendChild(span);
      this.radioEventListener(input, props);
    }



    if(props.type === 'multi-select') {
      this.group.classList.add('selector-toolbar')
      let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = props.name;
        input.id = props.id;
        input.value = props.options;
      let textLabel = document.createElement('label');
        textLabel.setAttribute('for', props.id);
        //textLabel.classList.add('pure-material-checkbox');
       let span = document.createElement('span');
        span.textContent = props.options; 
      this.group.append(input, textLabel);
      //textLabel.appendChild(input);
      textLabel.appendChild(span);
      this.checkboxEventListener(input, props);
    }


    // if(props.type === 'multi-select') {
    //   let input = document.createElement('input');
    //     input.type = 'checkbox';
    //     input.name = props.name;
    //     input.id = props.id;
    //     input.value = props.options;
    //   let textLabel = document.createElement('label');
    //     textLabel.setAttribute('for', props.id);
    //     textLabel.classList.add('pure-material-checkbox');
    //    let span = document.createElement('span');
    //     span.textContent = props.options; 
    //   this.group.append(textLabel);
    //   textLabel.appendChild(input);
    //   textLabel.appendChild(span);
    //   this.checkboxEventListener(input, props);
    // }




  }


    dropdownEventListener(el, props) {
      el.addEventListener('change', function(e) {
        console.log(el.value);

      });
    }


    radioEventListener(el, props) {
      el.addEventListener('change', function(e) {
            options.qNumber = j + 1;
            options.choices = [e.target.value];
            options.linkedQ = e.target.getAttribute('data-link-q');
            options.type = el.type;
        return;
    });
  }


    checkboxEventListener(el, props) {
      el.addEventListener('change', function(e) {
        let inputIndex = answers1.responses.findIndex((question => question.qid == j + 1));
        if(el.checked === true) {
            if(inputIndex != -1) {
              answers1.responses[inputIndex].choices[0].push(e.target.value);
              options.type = el.type;
            } else {
              options.qNumber = j + 1;
              options.choices.push(e.target.value);
              options.type = el.type;
            }
          } else {
            if(answers1.responses[inputIndex]) {
              let valueToDelete = answers1.responses[inputIndex].choices[0].findIndex((choice => choice === e.target.value));
              if(valueToDelete  != -1) {
                answers1.responses[inputIndex].choices[0].splice(valueToDelete, 1);
              }
            } else {
              let valueToDelete = options.choices.findIndex((choice => choice === e.target.value));
              options.choices.splice(valueToDelete, 1);
            } 
          }
          return;
      });
    }

    keyUpEventListener(el, props) {
      el.onblur = function() {
        console.log(el.id)
          window.sessionStorage.setItem(el.id, el.value)
          options.qNumber = j + 1;
          options.choices.push(el.value);
          options.type = el.type;
        return;
    }
      el.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') increase();
      });
  }
}
