'use strict'

import Modal from '../../Components/Modal/modal.js';

import * as Render from '../../Javascript/render.js';



export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    if(props.option) {
      this.constructCreateQuizCardTemplate();
    } else {
      this.constructTemplate(props);
    }
    this.addHandlers(props);
    Render.render(this.el, Render.$('root'));
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card-quiz-list")
    }

    constructTemplate(props) {
      let text = document.createElement("div");
        Render.renderText(text, props.quizTitle);
        text.classList.add("div")
      this.el.appendChild(text);
      let icon = document.createElement("div");
        icon.classList.add("next");
      this.el.appendChild(icon);
    }

    constructCreateQuizCardTemplate() {
      let icon = document.createElement("div");
        icon.classList.add("card-quiz-add-icon");
      this.el.appendChild(icon);
    }

   
    addHandlers(props) {  
      if(!props.option) {
        this.el.addEventListener("click", function() {
          let modal = new Modal({text: "" , title: props.quizTitle})
        });
      } else {
        this.el.addEventListener("click", function() {
        let modal = new Modal({text: "" , title: "Upload or Create A Quiz"})
        });
      }
    }
    
}


