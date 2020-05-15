'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


function dismiss() {
  FX.toastClear();
}





export default class Toast {
  constructor(props) {
    this.createToast(props);
    if(props.text) Render.renderText(this.el, props.text);
    this.actionButton(props);
    this.animate();
    return this.el;
  }

    createToast(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add('toast');
    }

    actionButton(props) {
      let action = props.action;
      this.action = Render.renderText(this.el, props.actionText);
      this.action.addEventListener("click", function() {
        if(action === null) {
          dismiss();
        } else {
          action(props.param); 
          dismiss();
        }
        
      });
        this.action.classList.add('toastAction');
    }

    animate() {
        FX.toastManagement();
    }







}


