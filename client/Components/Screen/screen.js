'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';

import {cursorCoords} from '../../Javascript/app.js';





export default class Screen {
  constructor(props) {
    this.maths();
    this.generateStructure(props);
    this.animateEntry();
  }

    maths() {
      let mainHeight = window.innerHeight; //Y value
      let mainWidth = window.innerWidth; //X value
      let ySum = cursorCoords.y / mainHeight;
      this.yTotal = ySum * 100;
      let xSum = cursorCoords.x / mainWidth;
      this.xTotal = xSum * 100;
    }


    generateStructure(props) {
      if(Render.$('root')) {
          Render.$('root').classList.add('screen-hide');
          Render.$('root').id = 'old-screen';
          Render.$('body').removeChild(Render.$('nav'));
      }
        this.screen = document.createElement('div');
          this.screen.id = 'root';
          this.screen.classList.add(props.class);
          this.screen.style.transformOrigin = this.xTotal + '%' + this.yTotal + '%';
          Render.$('body').append(this.screen);
    }



    animateEntry() {
      setTimeout(function() {
      if(Render.$('old-screen')) {
        Render.$('body').removeChild(Render.$('old-screen'));
      }
    }, 100);
    }


    animateExit() {

    }
}


