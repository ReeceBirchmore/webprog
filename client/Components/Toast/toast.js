'use strict';

import Icon from '/Components/Icon/icon.js';
import * as Render from '../../Javascript/render.js';
import { $ } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


function dismiss() {
  FX.toastClear();
}


function animate(toast) {
  setTimeout(function() {
    toast.classList.add('appear');
  }, 100);
  setTimeout(function() {
    toast.classList.remove('appear');
  }, 2000);
}


export default class Toast {
  constructor(props) {
    this.createToast(props);
    this.attachIcon(props.icon);
    if (props.text) Render.renderText(this.el, props.text, 'p', 'toast');
    animate(this.el);
    return this.el;
  }

  createToast(props) {
    this.el = document.createElement('div');
    this.el.id = 'toast';
    this.el.classList.add('toast');
  }

  attachIcon(icon) {
    const toastIcon = new Icon({
      id: icon,
      renderPoint: this.el,
    });
  }

  // actionButton(props) {
  //   const action = props.action;
  //   this.action = Render.renderText(this.el, props.actionText);
  //   this.action.addEventListener('click', function () {
  //     if (action === null) {
  //       dismiss();
  //     } else {
  //       action(props.param);
  //       dismiss();
  //     }
  //   });
  //   this.action.classList.add('toastAction');
  // }

  animate() {
    FX.toastManagement();
  }
}
