'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';
import * as Card from '../../Containers/Quiz/index.js';

export default class Fab {
  constructor(props) {
    this.createBtn(props);
    //addHandler(this.el, props)
    this.renderPoint(props);
    //Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add('fab')
    }


    renderPoint(props) {
      if(!props.render) {
        Render.render(this.el, Render.$('root'));
      } else {
        Render.render(this.el, Render.$(props.render))
      }
    }
    
    

  }

