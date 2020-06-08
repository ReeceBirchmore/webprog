'use strict';

import Icon from '/Components/Icon/icon.js';
import { $, renderText } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


function dismiss() {
  FX.toastClear();
}


function animate(toast) {
  setTimeout(function () {
    toast.classList.add('appear');
  }, 100);
  setTimeout(function () {
    toast.classList.remove('appear');
  }, 2000);
}


// #endregion
// ////////////////////////////////////////////////////////////// Toast Build
// #region Toast Class

/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID is automatically assigned
 *  @property {String}  props.icon Icon to attach to the toast, must have a respective CSS class to appear
 *  @property {String}   props.text Text for the snackbar
 *  @property {Boolean}  props.error True or False, To determine the snackbars colour, default is False.
 *
 */


export default class Toast {
  constructor(props) {
    this.createToast(props);
    this.attachIcon(props.icon);
    if (props.text) renderText(this.el, props.text, 'p', 'toast');
    animate(this.el);
    return this.el;
  }

  createToast(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('toast', 'elevated');
    if (props.error === true) this.el.classList.add('error');
  }

  attachIcon(icon) {
    const toastIcon = new Icon({
      id: icon,
      renderPoint: this.el,
    });
  }
}
