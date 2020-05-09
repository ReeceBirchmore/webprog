'use strict'

import * as Render from '../../Javascript/render.js';





export default class SubmissionCard {
  constructor(props) {
    this.createCard(props);
    //this.generateStyles();
    if(props.title) {
      Render.renderText(this.el, props.title);
    }
    //Render.render(this.el, Render.$('root'));
    
    return this.el;
    //Try not to render within the component generator!
    //
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("submissioncard");
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }
}


