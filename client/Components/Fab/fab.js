'use strict'


import Modal from '../../Components/Modal/modal.js';

import { $, render } from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';
import * as Card from '../../Containers/Quiz/index.js';

export default class Fab {
  constructor(props) {
    this.createBtn(props);


    render(this.el, $('root'));
  }
  
    createBtn(props) {
      this.el = document.createElement("div");

        this.el.classList.add('fab');
        this.el.addEventListener("click", function(el) {
          console.log(el)
          if (!el.target.classList.contains('fab-expand')) {
            el.target.classList.add('fab-expand');
          } else {
            el.target.classList.remove('fab-expand');
          }
        });
    }  
  }

