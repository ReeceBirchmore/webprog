'use strict'

import * as Render from '../../Javascript/render.js';



export default class QuizCard {
  constructor(props) {
    this.createCard(props);
  
    this.renderText(props);

    Render.render(this.el, Render.$('root'));
    
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("quizCard")
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


