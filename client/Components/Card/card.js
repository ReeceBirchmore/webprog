'use strict'

import * as Render from '../../Javascript/render.js';





export default class Card {
  constructor(props) {
    this.createCard(props);
    //this.generateStyles();
    if(props.title) {
      Render.renderText(this.el, props.title);
    }
    

    if(props.answers) {
      this.showAnswers(props);
    }
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card")
    }


    showAnswers(props) {
      Render.renderText(this.el, "Your answers:", "h2");
      for(let i = 0; i < props.answers.answers.length; i++) {
        let container = document.createElement('div');
          container.classList.add('previewContainer');
        let qNum = Render.renderText(container, props.answers.answers[i].title + ":");
          qNum.classList.add('qNum');
        let preview = Render.renderText(container, props.answers.answers[i].value);
          preview.classList.add('previewText');
        //console.log(container)

        this.el.appendChild(container)

      }
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }
}


