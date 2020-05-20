'use strict'

import { $, renderText, createToast } from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';

import {cursorCoords} from '../../Javascript/app.js';


const history = {
  page1: '',
  page2: ''
}


export default class Screen {
  constructor(props) {
    this.maths();
    this.generateStructure(props);
    this.deleteOldScreen();
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
      
      // if($('root')) {
      //   console.log(this.screenPosition);
      // }


      // if(this.screenPosition === -1) {
      //   console.log("NEW SCREEN CREATED");
      //   console.log(historyArray);
      //   if(historyArray.length === 2) {
      //     //apply styles for second page rendering here
      //   } else {
      //     historyArray[0].classList.add(props.class);
      //   }


      // } else {
      //   console.log("SCREEN ALREADY EXISTS");

      // }

      




      if($('root')) {
          $('root').classList.add('screen-hide');
          $('root').id = 'old-screen';
          $('body').removeChild($('nav'));
      }
        this.screen = document.createElement('div');
          this.screen.id = 'root';
          this.screen.classList.add(props.class);
          //this.screen.style.transformOrigin = this.xTotal + '%' + this.yTotal + '%';
          $('body').append(this.screen);
    }
    
    deleteOldScreen() {
      setTimeout(function() {
      if($('old-screen')) {
        $('body').removeChild($('old-screen'));
      }
    }, 100);
    }

}


