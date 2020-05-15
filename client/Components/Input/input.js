'use strict'

import * as Render from '../../Javascript/render.js';


function setState(props) {
  //set text here if exists within the local storage
}

export let textHolder;
export let answers = {response: [] };
export let question = new Object;
let selection;
let inputIndex;

export default class Input {
  constructor(props) {
    this.setType(props);
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


    if(props.type === 'text') {  
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
  }






    setType(props) {
      if(props.value === 'multi-select') { props.value = 'Checkboxes'; this.createDropDown(props); }
      if(props.value === 'single-select') { props.value = 'Multiple Choice'; this.createDropDown(props);}
      if(props.type === 'dropdown') { props.type = 'select'; this.createDropDown(props); return;}
      if(props.value === 'text') {  }
    } 




    createDropDown(props) {
      let input = document.createElement('input');
        input.type = props.type;
    }















    createContainer() {
      this.contain = document.createElement("div");
        this.contain.id = "test";
        this.contain.classList.add("container");
    }
   

    createInput(props) {
      this.el = document.createElement("input");
        this.el.id = props.id;
        this.el.classList.add("input");
        return this.el;
    }




    
    



    createLabel(props) {
      this.label = document.createElement("label");
        this.label.classList.add("label");
      this.text = document.createTextNode(props.options);
        this.label.setAttribute("for", this.el.id);
      this.label.appendChild(this.text);
      this.contain.appendChild(this.label);
    }











    keyUpEventListener(el, props) {
      el.onkeyup = function() {
        selection = el.value;
        }
      el.onblur = function() {
        textHolder = el.value;
        inputIndex = answers.response.findIndex((question => question.id == el.id))
        if(inputIndex >= 0) {
          answers.response[inputIndex].value = el.value;
        } else {
          question = new Object ({
            id: el.id,
            title: props.title,
            value: el.value
          });
          answers.response.push(question);
        }
      }
    }
}

