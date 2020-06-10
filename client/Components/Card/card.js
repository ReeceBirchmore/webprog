'use strict';

import { html } from '/Javascript/render.js';

/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, recommended for further referencing
 *  @property {Boolean} props.required This should be TRUE if the question is a required question, false by default
 *
 *  The card is called upon in the quiz index.js file. 
 *
 *  Example of use:
 *
 *  const card = new Card({
 *    id: 'card-' + qNum++,
 *    required: true,
 *  });
 *
 */

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
