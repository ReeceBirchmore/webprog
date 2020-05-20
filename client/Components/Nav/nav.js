'use strict'


import Modal from '../../Components/Modal/modal.js';

import { $, render, renderText } from '../../Javascript/render.js';
import { j } from '../../Containers/Quiz/index.js';

import * as Admin from '/Containers/Admin/index.js';



export default class Nav {
  constructor(props) {
    this.createFrame(props);
    if(props.return === true) this.displayReturnIcon();
    if(props.add === true) this.displayUploadIcon();
    if(props.close === true) this.displayCloseIcon();
    if(props.clear === true) this.displayClearButton();
    if(props.title) { 
      this.displayTitle(props);
      this.el.style.boxShadow = "0 0 0 rgba(0,0,0,0.01), 0 2px 5px rgba(0,0,0,0.22)";
    } else {
      this.displayQuestionNumber(props);
    }
    this.eventHandler(props);    
    render(this.el, $('body'));
  }
   
    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id;
          this.el.classList.add("nav");
    }

    displayTitle(props) {
      let title = renderText(this.el, props.title, "h2");

    }


    displayQuestionNumber(props) {
      let currentNumber = renderText(this.el, '1 ', 'p');
        currentNumber.id = 'questionNumber';
        currentNumber.style.paddingRight = "0.2rem";
      let questionnaireProgress = renderText(this.el, " of " + props.length);
      questionnaireProgress.classList.add('questionNum')
    }


    displayClearButton() {
      this.clearIcon = document.createElement('button');
        this.clearIcon.classList.add('icon', 'clear', 'ripple');
        this.el.appendChild(this.clearIcon);
        this.addHandlers();
    }

    displayReturnIcon() {
      this.returnIcon = document.createElement('button');
        this.returnIcon.classList.add('icon', 'return', 'ripple');
        this.el.appendChild(this.returnIcon);
    }

    displayUploadIcon() {
      this.uploadIcon = document.createElement('button');
        this.uploadIcon.classList.add('icon', 'add', 'ripple');
        this.el.appendChild(this.uploadIcon);
    }

    displayCloseIcon() {
      this.closeIcon = document.createElement('button');
        this.closeIcon.classList.add('icon', 'close', 'ripple');
        this.el.appendChild(this.closeIcon);
    }


    eventHandler(props) {
      if(props.return) {
        this.returnIcon.addEventListener("click", function() {
          history.back();
        });
      }
      if(props.add) {
        this.uploadIcon.addEventListener("click", function() {
          new Modal({type: 'upload', title: "Upload a Quiz"})
        });
      }
      if(props.close) {
        this.closeIcon.addEventListener("click", function() {
          Admin.generatePage();
        });
      }
    }


    addHandlers() {
        if(this.clearIcon) {
          this.clearIcon.addEventListener("click", function() {
            sessionStorage.clear();
            location.reload();
          });
      }
    }
}

