'use strict'

import Input from '/Components/Input/input.js';
import Toggle from '/Components/Input/Toggle.js';

import { $, renderText, createToast} from '../../Javascript/render.js';
import * as Admin from '../../Containers/Admin/index.js';




export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
      renderText(this.el, "Question " + props.questionNum, "h2");
    if(props.type === 'add') {
      this.createAddQuestionTemplate(props);
    } else {
      this.createEditCardTemplate(props);
    }
    this.addHandlers(props);
    return this.el;
  }
  
    createEditCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card-edit");
    }


    createEditCardTemplate(props) {
      this.input = new Input({id: "input-" + props.id, placeholder: props.title, value: props.title, type: 'text', datanumber: props.id, mode: 'edit'});
      this.el.append(this.input);

      let divider = document.createElement("div");
        divider.classList.add("separator");
        renderText(divider, "Question Type");
      this.el.appendChild(divider);

      this.select = new Input({id: "selector-" + props.id, type: "select", types: ['Text', 'Number', 'Multiple Choice', 'Checkboxes'], value: props.input, data: props.id})
      this.el.append(this.select)
      
      this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('card-edit-button-container');
      this.el.append(this.buttonsContainer);
      let toggle = new Toggle();
      this.binIcon = document.createElement("div");
        this.binIcon.classList.add('icon', 'bin');
        this.buttonsContainer.append(this.binIcon, toggle);
    }


    createAddQuestionTemplate(props) {
      //code here
    }

    addHandlers(props) {  
        if(this.binIcon) {
          this.binIcon.addEventListener("click", function() {
            let popup = window.confirm("Are you sure you want to delete " + props.title);
            if (popup === true) Admin.deleteQuestion(props.id, props.quizTitle);
          });
        }
        if(props.type === 'add') {
          this.el.addEventListener("click", function() {
            Admin.addQuestion();
          }); 
        }
      } 
}


