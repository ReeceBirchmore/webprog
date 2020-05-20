'use strict'


import { renderText, $ } from '../../Javascript/render.js';





export default class Divider {
  constructor(el, text) {
    this.createDivider(el, text);
    return;
  }
  
    createDivider(el, text) {
      let divider = document.createElement("div");
      divider.classList.add("separator");
      renderText(divider, text);
      el.appendChild(divider);
    }
}


