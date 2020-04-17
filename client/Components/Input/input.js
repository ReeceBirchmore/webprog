'use strict'

import * as Render from '../../Javascript/render.js';


function setState(props) {
  
}




export default class Input {
  constructor(props) {
    this.createInput(props);
    this.setType(props);
    //this.generateStyles();
    return this.el;
  }

    //attach keyup event listener
    keyUpEventListener(props) {
      
    }
    
    createInput(props) {
      this.el = document.createElement("input");
        this.el.id = props.id;
        this.el.classList.add("input");
    }

    setType(props) {
      if(props.type === 'multi-select') props.type = 'checkbox';
      if(props.type === 'single-select') props.type = 'radio';
      this.el.setAttribute('type', props.type);
    } 

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }

}

