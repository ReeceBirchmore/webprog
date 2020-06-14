'use strict';

import { render } from '/Javascript/render.js';


/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID of the toggle, optional yet recommended
 *  @property {String}      props.class Sometimes more granular control over the positioning is required
 *  @property {Boolean}     props.checked Determine whether the toggle will be on or off, false by default
 *  @property {HTMLElement} props.renderPoint The element on which to render the toggle
 *  Example of use:
 *
 *  const toggle = new Toggle({
 *    id: 'toggle-' + props.qid,
 *    renderPoint: titleContainer,
 *    checked: props.required,
 *    class: 'left',
 *  });
 *
 */

export default class Toggle {
  constructor(props) {
    this.createToggleStructure(props);
    render(this.el, props.renderPoint);
    return this.el;
  }


  createToggleStructure(props) {
    this.el = document.createElement('div');
    this.el.classList.add('material-toggle');
    if (props.class) this.el.classList.add(props.class);
    this.input = document.createElement('input');
    this.input.id = props.id;
    this.input.type = 'checkbox';
    this.input.setAttribute('name', props.id);
    this.input.checked = props.checked;
    this.input.classList.add('switch');
    this.label = document.createElement('label');
    this.label.setAttribute('for', props.id);
    this.el.append(this.input, this.label);
  }
}
