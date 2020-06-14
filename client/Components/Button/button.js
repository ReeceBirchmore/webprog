'use strict';


import { $, render, renderText, html } from '/Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';


/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, recommended for further referencing
 *  @property {String}  props.class Allows for adding extra CSS classes for more granular control
 *  @property {Array}   props.actions Actions for the button
 *  @property {String}  props.render The renderpoint for the button, if left blank or ommited, it will default to the root
 *  @property {String}  props.text The text for the button
 *  @property {String}  props.icon An icon to put inside the button, recommended for FABs (Requires matching CSS class)
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
    this.action(props);
    this.renderPoint(props);
    this.extraClass(props);
    if (props.icon) this.icon(props);
  }

  createBtn(props) {
    this.el = html('button', props.id, '', 'button');
    this.el.classList.add('ripple');
    if (props.text) {
      const text = renderText(this.el, props.text);
      text.classList.add('button-text');
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

  extraClass(props) {
    this.el.classList.add(props.class);
  }

  icon(props) {
    const icon = html('div', '', this.el, props.icon);
    icon.classList.add('icon')
  }
}
