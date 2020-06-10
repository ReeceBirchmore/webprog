'use strict';

import { html } from '../../Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';

/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id Must reference a name in the CSS containing links to the icon (REQUIRED)
 *  @property {Function} props.actions The function to be called upon by the icon, no action if left blank.
 *  @property {HTMLElement} props.renderPoint The reference to the element on which to attach the icon (REQUIRED)
 *
 *  Typically, the icon generation is called upon by another component.
 *
 *  Example of use:
 *
 *  const icon = new Icon({
 *    id: props.icons[i],
 *    renderPoint: this.el,
 *    actions: props.actions[i],
 *  });
 *
 */

export default class Icon {
  constructor(props) {
    this.generateIcon(props);
    this.assignIcon(props);
    if (props.actions) eventHandler(this.el, props.event, props.actions);
    return this.el;
  }


  generateIcon(props) {
    this.el = html('button', props.id, props.renderPoint, 'ripple');
  }

  assignIcon(props) {
    this.el.classList.add('icon', props.id);
  }
}
