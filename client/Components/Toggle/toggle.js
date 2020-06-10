'use strict';

import * as Render from '/Javascript/render.js';
import * as FX from '/Javascript/fx.js';
import { render } from '/Javascript/render.js';


/*********************************************************************
 *
 *  @typedef  {Object}    Props
 *  @property {String}    props.id ID is automatically assigned
 *  @property {String}    props.text Text for the snackbar
 *  @property {Boolean}   props.error True or False, To determine the snackbars colour, default is False.
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

export default class Toggle {
  constructor(props) {
    this.createToggleStructure(props);
    render(this.el, props.renderPoint);
    return this.el;
  }


  createToggleStructure(text) {
    this.el = document.createElement('div');
    this.el.classList.add('material-toggle');

    this.input = document.createElement('input');
    this.input.id = 'toggle';
    this.input.type = 'checkbox';
    this.input.setAttribute('name', 'toggle');
    this.input.checked = true;

    this.input.classList.add('switch');

    this.label = document.createElement('label');
    this.label.setAttribute('for', 'toggle');


    this.el.append(this.input, this.label);
  }
}
