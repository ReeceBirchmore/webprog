'use strict';


import Icon from '/Components/Icon/icon.js';
import { $, render, renderText, html } from '../../Javascript/render.js';

/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, optional but recommended
 *  @property {Array}   props.icons Icons to attach to the Navbar, icon name must have matching class in CSS
 *  @property {Array}   props.actions Actions for the respective icons, the number of actions should match the number of icons
 *  @property {String}  props.title The title to be used on the nav, optional but recommended
 *
 */


export default class Nav {
  constructor(props) {
    this.createNav(props);
    this.displayTitle(props);
    this.iconGeneration(props);
    render(this.el, $('body')); // This is a persistent element, it will render itself to the page
  }

  createNav(props) {
    this.el = html('div', props.id, '', 'nav');
  }

  displayTitle(props) {
    if (props.title) renderText(this.el, props.title, 'p', 'nav-title', 'center');
  }

  iconGeneration(props) {
    if (props.icons) {
      for (let i = 0; i < props.icons.length; i++) {
        if(props.icons[0] !== null) {
          const icon = new Icon({
            id: props.icons[i],
            renderPoint: this.el,
            actions: props.actions[i],
          });
        }
      }
    }
  }
}
