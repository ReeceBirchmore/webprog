'use strict'

import * as Render from '../../Javascript/render.js';




export default class Toggle {
  constructor(props) {
    this.createToggleStructure(props);
    return this.el;
  }

 

    createToggleStructure(props) {
        this.el = document.createElement('div');
            this.el.classList.add('material-toggle');
        
        this.input = document.createElement('input');
            this.input.id = 'toggle';
            this.input.type = 'checkbox'
            this.input.setAttribute('name', 'toggle');
            this.input.checked = true;

            this.input.classList.add('switch');

        this.label = document.createElement('label');
            this.label.setAttribute('for', 'toggle');
            
            
        this.el.append(this.input, this.label);    
        

    }


   







    keyUpEventListener(el, props) {
      el.onkeyup = function() {
        selection = el.value;
        }
      el.onblur = function() {
        textHolder = el.value;
        inputIndex = answers.response.findIndex((question => question.id == el.id))
        if(inputIndex >= 0) {
          answers.response[inputIndex].value = el.value;
        } else {
          question = new Object ({
            id: el.id,
            title: props.title,
            value: el.value
          });
          answers.response.push(question);
        }
      }
    }
}

