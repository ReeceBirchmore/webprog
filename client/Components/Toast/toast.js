'use strict';

import Icon from '/Components/Icon/icon.js';
import { $, renderText, render } from '/Javascript/render.js';


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
 *  @property {String}   props.text Text for the snackbar
 *  @property {Boolean}  props.error True or False, To determine the snackbars colour, default is False.
 *
 *  The toast function is in the render.js file, call upon the createToast function instead of directly calling it!
 *
 *  Example of use:
 *
 *  const toast = new Toast({
 *    id: 'toast',
 *    text: message,
 *    error: error,
 *  });
 */


export default class Toast {
  constructor(props) {
    this.createToast(props);
    this.attachIcon(props);
    this.attachText(props);
    animate(this.el);
    render(this.el, $('body')); // This is classed as a persistennt element, it will render itself onto the page
    return this.el;
  }

  createToast(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('toast', 'elevated');
    if (props.error === true) this.el.classList.add('error');
  }

  attachIcon(props) {
    const toastIcon = new Icon({
      id: (props.error === true) ? 'close' : 'tick',
      renderPoint: this.el,
    });
  }

  attachText(props) {
    if (props.text) renderText(this.el, props.text, 'p', 'toast');
  }
}
