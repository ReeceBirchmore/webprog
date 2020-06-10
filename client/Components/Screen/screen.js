'use strict';

import { $, html } from '/Javascript/render.js';
import { cursorCoords } from '/Javascript/app.js';


/*********************************************************************
 *
 *  @typedef  {Object}      Props
 *  @property {String}      props.id ID to assign the element, recommended for further referencing
 *  @property {String}      props.class Specify a specific overriding class the screen should have
 *
 *
 *  Example of use:
 *
 *  const screen = new Screen({
 *    id: 'admin-console',
 *    class: 'adminScreen',
 *  });
 */


export default class Screen {
  constructor(props) {
    this.maths();
    this.generateStructure(props);
    this.deleteOldScreen();
  }

  maths() {
    // Initially created to allow for the window to open based on the position touched, animations
    // have since been removed to save on performance. Can be readded by adding a scale-up css keyframe
    // animation to the screen class in question
    const mainHeight = window.innerHeight; // Y value
    const mainWidth = window.innerWidth; // X value
    const ySum = cursorCoords.y / mainHeight;
    this.yTotal = ySum * 100;
    const xSum = cursorCoords.x / mainWidth;
    this.xTotal = xSum * 100;
  }


  generateStructure(props) {
    if ($('root')) {
      $('root').classList.add('screen-hide');
      $('root').id = 'old-screen';
      if ($('nav')) $('body').removeChild($('nav'));
    }

    this.screen = html('div', 'root', $('body'), props.class)
    this.screen.style.transformOrigin = this.xTotal + '%' + this.yTotal + '%';
  }

  deleteOldScreen() {
    setTimeout(function () {
      if ($('old-screen')) {
        $('body').removeChild($('old-screen'));
      }
    }, 100);
  }
}
