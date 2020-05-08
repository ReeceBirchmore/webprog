'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';
import * as Card from '../../Containers/Quiz/index.js';


const directionControlStyles = {
  'background-color': 'white',
  'width': '40vw',
  'height': '3rem',
  'margin-top':'1rem'
};

const next = {
  'width':'100%!important'
}

const previous = {

}

const submit = {

}

const closeStyles = {
 //code
}

const submitStyles = {
 //code
}

const confirmStyles = {
  //code
}



export default class Star {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles(props);
    addHandler(this.el, props)
    this.renderPoint(props);
    Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("button");
        this.el.id = props.id;
    }

    generateStyles(props) {
      this.el.setAttribute("style", Render.useStyles(directionControlStyles));
    }


    renderPoint(props) {
      if(!props.render) {
        Render.render(this.el, Render.$('root'));
      } else {
        Render.render(this.el, Render.$(props.render))
      }
    }
    
    

  }

