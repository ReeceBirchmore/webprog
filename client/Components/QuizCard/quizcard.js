'use strict'

import * as Render from '../../Javascript/render.js';



export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    this.constructTemplate(props);
    //this.renderText(props);

    Render.render(this.el, Render.$('root'));
    
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card-quizlist")
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

    renderText(props) {
      if(props.quizTitle) {
        Render.renderText(this.el, props.quizTitle, "h2");
      }
      if(props.questions) {
        Render.renderText(this.el, props.questions + " Questions");
      }
      if(props.expire) {
        Render.renderText(this.el, props.expire);
      }
      if(props.author) {
        Render.renderText(this.el, props.author);
      }
    }
    
}


