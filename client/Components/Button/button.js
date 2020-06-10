'use strict';


import { $, render, renderText, html } from '/Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';


/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, recommended for further referencing
 *  @property {String}  props.type Type of button (allows for precise css placement)
 *  @property {Array}   props.actions Actions for the button
 *  @property {String}  props.render The renderpoint for the button, if left blank or ommited, it will default to the root
 *  @property {String}  props.text The text for the button
 *
 *  The button is called upon in all main container files.
 *
 *  Example of use:
 *
 *  const button = new Button({
 *    id: 'nextbtn',
 *    text: 'Next',
 *    action: function () { increase(); },
 *    render: 'Footer',
 *    type: 'next',
 *  });
 *
 */

export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles(props);
    this.action(props);
    this.renderPoint(props);
  }

  createBtn(props) {
    this.el = html('button', props.id, '', 'button');
    this.el.classList.add('ripple');
    const text = renderText(this.el, props.text);
    text.classList.add('button-text');
  }

  generateStyles(props) {
    switch (props.type) {
      case 'previous':
        this.el.classList.add('left');
        break;

      case 'next':
        this.el.classList.add('right');
        break;

      case 'submit':
        this.el.classList.add('submit');
        break;

      case 'error':
        // Error code
        break;
    }
  }

  action(props) {
    eventHandler(this.el, 'click', props.action, true);
  }

  renderPoint(props) {
    if (!props.render) {
      render(this.el, $('root'));
    } else {
      render(this.el, $(props.render));
    }
  }
}
