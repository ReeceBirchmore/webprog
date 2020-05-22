'use strict';

import { html } from '../../Javascript/render.js';


export default class Card {
  constructor(props) {
    this.createCard(props);
    return this.el;
  }


  createCard(props) {
    this.el = html('div', (!props.id) ? '' : props.id, '', '');
    this.el.classList.add(((!props.class) ? 'card' : props.class), 'elevated');
    if (props.required) this.el.setAttribute('data-required', props.required);
  }
}
