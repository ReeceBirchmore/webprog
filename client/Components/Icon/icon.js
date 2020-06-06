'use strict';

import { html } from '../../Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';


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
