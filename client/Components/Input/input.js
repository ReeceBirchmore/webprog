'use strict'

import * as Render from '../../Javascript/render.js';


function setState(props) {
  //set text here if exists within the local storage
}




export default class Input {
  constructor(props) {

    
    this.createInput(props);
    this.setType(props);

    this.keyUpEventListener(this.el);

    /*
    this.createContainer();
    this.createInput(props);
    this.setType(props);
    //this.generateStyles();
    this.createLabel(props);
    */
    return this.el;
  }

 


    setType(props) {
      if(props.type === 'multi-select') { props.type = 'checkbox' }
      else if(props.type === 'single-select') { props.type = 'radio' }
      else { this.el.classList.add("textbox") }
      this.el.setAttribute('type', props.type);
      this.el.setAttribute('min', 0);
      this.el.setAttribute('max', 50)
    } 


    createContainer() {
      this.contain = document.createElement("div");
        this.contain.id = "test";
        this.contain.classList.add("container");
    }
   

    createInput(props) {
      this.el = document.createElement("input");
        this.el.id = props.id;
        this.el.classList.add("input");
        //console.log(this.el)
        //this.contain.appendChild(this.el);
        return this.el;
    }





    
    



    createLabel(props) {
      this.label = document.createElement("label");
        this.label.classList.add("label");
      this.text = document.createTextNode(props.options);
        this.label.setAttribute("for", this.el.id);
      this.label.appendChild(this.text);
      this.contain.appendChild(this.label);
    }




    //attach keyup event listener
    keyUpEventListener(el) {
      let answers = [];
      let question = new Object;
        this.el.onblur = function() {
          console.log(el.value);

          if(answers.find(question => question = el.id)) {
            console.log(el.id)
          }

              question.id = el.id,
              question.value = el.value


            answers.push(question);
          
          
            console.log(answers);
            console.log(answers[0])
        }
    }

    // generateStyles() {
    //   this.el.setAttribute("style", Render.useStyles(styles));
    // }

}

