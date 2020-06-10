'use strict';

import { render, $ } from '../../Javascript/render.js';


export default class Footer {
  constructor() {
    this.createFrame();
    render(this.el, $('root')); // This is classed as a persistent element, it will render itself onto the page
  }

  createFrame() {
    this.el = document.createElement('div');
    this.el.id = 'Footer';
    this.el.classList.add('footer');
  }
}
