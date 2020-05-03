'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


function dismiss() {
  FX.toastClear();
}





export default class Toggle {
  constructor(props) {
    
    this.createToggle(props);
    //this.createSlider(props);
    Render.render(this.el, Render.$('root'));
    return this.el;
  }

    createToggle(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add('toggle-label');
    }

    createSlider(props) {
      let action = props.action;
      this.action = Render.renderText(this.el, props.actionText);
      this.action.addEventListener("click", action);
        this.action.classList.add('toastAction');
      
    }
}


