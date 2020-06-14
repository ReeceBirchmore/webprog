'use strict';

import { renderText, render } from '/Javascript/render.js';


/*********************************************************************
 *
 *  @property {HTMLElement} el The element to append the new divider to (REQUIRED)
 *  @property {String} text The text to include in the middle of the divider
 *
 */

export default class Divider {
  constructor(el, text) {
    this.createDivider(el, text);
  }

  createDivider(el, text) {
    const divider = document.createElement('div');
    divider.classList.add('separator');
    renderText(divider, text);
    if (el !== undefined) render(divider, el);
  }
}
