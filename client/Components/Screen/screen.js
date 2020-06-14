'use strict';

import { $, html } from '/Javascript/render.js';

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
 * 
 *  // NOTE: When a new screen is generated, the old screen and ALL of it's children
 *           will be destroyed
 */


export default class Screen {
  constructor(props) {
    this.generateStructure(props);
    this.deleteOldScreen();
  }


  generateStructure(props) {
    if ($('root')) {
      $('root').classList.add('screen-hide');
      $('root').id = 'old-screen';
      if ($('nav')) $('body').removeChild($('nav'));
    }
    this.screen = html('div', 'root', $('body'), props.class);
  }

  deleteOldScreen() {
    if ($('old-screen')) {
      removeAllChildNodes($('old-screen'));
      $('body').removeChild($('old-screen'));
    }
  }

}


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
