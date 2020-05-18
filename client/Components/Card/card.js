'use strict'

import Button from '../../Components/Button/button.js';
import * as Render from '../../Javascript/render.js';





export default class Card {
  constructor(props) {
    this.createCard(props);
    if(props.title) Render.renderText(this.el, props.title);
    
    if(props.answers) this.showAnswers(props);
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card")
    }


    showAnswers(props) {
      this.generateEnvelope(props);
      // Render.renderText(this.el, "Your answers:", "h2");
      // for(let i = 0; i < props.answers.length / 2; i++) {
      //   let container = document.createElement('div');
      //     container.classList.add('previewContainer');
      //   let qNum = Render.renderText(container, props.answers[i].qid + ". " + props.answers[i].title);
      //     qNum.classList.add('qNum');
      //   let preview = Render.renderText(container, props.answers[i].choices + " ");
      //     preview.classList.add('previewText');
      //   let divider = document.createElement("hr");
      //     divider.classList.add('divider');
      //   this.el.appendChild(divider);
      //   this.el.appendChild(container);
      // }
    }
    

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }




    generateEnvelope(props) {
      let article = document.createElement('article');
        article.id = 'envelopearticle'
        article.classList.add('letter');
      let side1 = document.createElement('div');
        side1.id = 'envelopeside1' 
        side1.classList.add('side');
      Render.renderText(this.el, "Your answers:", "h2");
      let scrollContainer = document.createElement('div');
        scrollContainer.classList.add('scroll-container');
      side1.append(scrollContainer)
      for(let i = 0; i < props.answers.length; i++) {
        let container = document.createElement('div');
          container.classList.add('previewContainer');
        let qNum = Render.renderText(container, props.answers[i].qid + ". " + props.answers[i].title);
          qNum.classList.add('qNum');
        let preview = Render.renderText(container, props.answers[i].choices + " ");
          preview.classList.add('previewText');
          scrollContainer.appendChild(container);
      }
      let side2 = document.createElement('div');
        side2.classList.add('side');
        side2.id = 'envelopeside2';
      let divFront = document.createElement('div');
        divFront.classList.add('envelope', 'envelopefront');
        divFront.id = 'envelopefront'
      let divBack = document.createElement('div');
        divBack.classList.add('envelope', 'envelopeback');
        divBack.id = 'envelopeback';
      Render.$('root').append(article);
      article.append(side1, side2);
      Render.$('root').append(divFront, divBack)


    }
}


