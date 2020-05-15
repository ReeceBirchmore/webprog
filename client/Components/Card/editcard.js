'use strict'

import Input from '/Components/Input/input.js';


import * as Render from '../../Javascript/render.js';





export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
    if(props.title) {
      Render.renderText(this.el, "Question " + props.questionNum);
    }
    this.createEditCardTemplate(props);
    return this.el;
  }
  
    createEditCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card-edit")
    }


    createEditCardTemplate(props) {
      this.input = new Input({id: 'test-id', placeholder: props.title, value: props.title, type: 'text'});
      this.el.append(this.input);

      this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('card-edit-button-container');
      this.el.append(this.buttonsContainer);


      this.select = new Input({id: "selector", type: "dropdown", value: ['text', 'number', 'multi-select', 'single-select']})
      //console.log(this.select)
      this.el.append(this.select)

      this.binIcon = document.createElement("div");
        this.binIcon.classList.add('icon', 'bin');
        this.buttonsContainer.appendChild(this.binIcon);



    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }
}



