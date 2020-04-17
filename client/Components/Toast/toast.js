'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


const actionStyles = {
  'color': '#ffeb3b',
  'text-transform': 'uppercase',
  'padding-left':'2rem',
}




function dismiss() {
  FX.toastClear();
}





export default class Toast {
  constructor(props) {
    this.createToast(props);
    if(props.text) {
      Render.renderText(this.el, props.text);
    }
    this.actionButton(props);
    Render.render(this.el, Render.$('root'));
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
      this.action.addEventListener("click", action);
        this.action.setAttribute("style", Render.useStyles(actionStyles));
    }

    animate() {
      setTimeout(function() {
        FX.toastManagement();
    }, 1000);
    }







}


