'use strict'

import * as Render from '../../Javascript/render.js';


function setState(props) {
  //set text here if exists within the local storage
}


export let answers = [];
export let question = new Object;
let selection;
let inputIndex;

export default class Input {
  constructor(props) {
    this.test(props);
    
    //this.createInput(props);
    //this.setType(props);
    

    /*
    this.createContainer();
    this.createInput(props);
    this.setType(props);
    //this.generateStyles();
    this.createLabel(props);
    */
    return this.group;
  }

 

  test(props) {
    this.group = document.createElement('div');
      this.group.classList.add('group');
    let input = document.createElement('input');
      input.type = props.type;
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






    setType(props) {
      if(props.type === 'multi-select') { props.type = 'checkbox' }
      else if(props.type === 'single-select') { props.type = 'radio' }
      else { this.el.classList.add("textbox") }
      this.el.setAttribute('type', props.type);
      this.el.setAttribute('min', 0);
      this.el.setAttribute('max', 50)
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




    //attach keyup event listener
    keyUpEventListener(el, props) {
      console.log(props)
      el.onkeyup = function() {
        selection = el.value;
        }
      el.onblur = function() {
        inputIndex = answers.findIndex((question => question.id == el.id))
        if(inputIndex >= 0) {
          answers[inputIndex].value = el.value;
        } else {
          question = new Object ({
            id: el.id,
            title: props.title,
            value: el.value
          });
          answers.push(question);
        }
        //console.log(answers);
      }
    }

    // generateStyles() {
    //   this.el.setAttribute("style", Render.useStyles(styles));
    // }

}

