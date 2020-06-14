'use strict';

import { render, $ } from '/Javascript/render.js';

/*********************************************************************
 *
 *  This class has no special properties, to declare it write:
 *
 *  const footer = new Footer();
 *
 */


export default class Footer {
  constructor() {
    this.createFrame();
    render(this.el, $('body')); // This is classed as a persistent element, it will render itself onto the page
  }

  createFrame() {
    this.el = document.createElement('div');
    this.el.id = 'Footer';
    this.el.classList.add('footer');
  }
}
