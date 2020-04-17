'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';


function addHandler(el, props) {
    el.addEventListener("click", function() {
        //code to popup modal with list of questions here
    })

}


export default class QuestionNumber {
  constructor(props) {
    this.createBtn(props);
    //this.generateStyles();
    addHandler(this.el, props)
    Render.render(this.el, Render.$('root'));
    
    //Generate Question Number here
    //Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("questionNumber")
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(directionControlStyles));
    }

    
    

  }

