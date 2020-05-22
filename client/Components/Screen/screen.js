'use strict';

import { $ } from '../../Javascript/render.js';
import { cursorCoords } from '../../Javascript/app.js';


const history = {
  page1: '',
  page2: '',
};


export default class Screen {
  constructor(props) {
    this.maths();
    this.generateStructure(props);
    this.deleteOldScreen();
  }

  maths() {
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
      $('body').removeChild($('nav'));
    }
    this.screen = document.createElement('div');
    this.screen.id = 'root';
    this.screen.classList.add(props.class);
    this.screen.style.transformOrigin = this.xTotal + '%' + this.yTotal + '%';
    $('body').append(this.screen);
  }


  setScroll(props) {
    if (props.scroll) {
      $('body').style.marginTop = '20vh';
    } else {
      $('body').style.marginTop = '0';
    }
    const offset = $('root').offsetTop;
    ['mousewheel', 'touchmove'].forEach(evt =>
      $('root').addEventListener(evt, function (e) {
        if (window.scrollY === offset) {
          $('root').style.overflowY = 'scroll';
        } else {
          console.log('JEEJRJE');
          $('root').style.overflowY = 'hidden';
        }
      }),
    );
  }


  deleteOldScreen() {
    setTimeout(function () {
      if ($('old-screen')) {
        $('body').removeChild($('old-screen'));
      }
    }, 100);
  }
}
