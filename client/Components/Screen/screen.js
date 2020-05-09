'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';







export default class Screen {
  constructor(props) {
    this.createScreen(props);
    Render.render(this.el, Render.$('root'));
    return this.el;
  }

  createScreen(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add('screen-' + props.id);
    }

    actionButton(props) {
      let action = props.action;
      this.action = Render.renderText(this.el, props.actionText);
      this.action.addEventListener("click", action);
        this.action.classList.add('toastAction');
      //this.action.setAttribute("style", Render.useStyles(actionStyles));
    }
}


