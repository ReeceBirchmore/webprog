'use strict';

import * as FX from '/Javascript/fx.js';
import { render, renderText } from '/Javascript/render.js';


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


  createToggleStructure(props) {

    this.el = document.createElement('div');
    this.el.classList.add('material-toggle');

    if (props.class) this.el.classList.add(props.class)


    this.input = document.createElement('input');
    this.input.id = props.id;
    this.input.type = 'checkbox';
    this.input.setAttribute('name', props.id);
    this.input.checked = props.checked;

    this.input.classList.add('switch');

    this.label = document.createElement('label');
    this.label.setAttribute('for', props.id);


    this.el.append(this.input, this.label);
  }
}
