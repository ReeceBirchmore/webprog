'use strict'

import * as Render from '../../Javascript/render.js';


const styles = {
  'background-color': 'white',
  'width': '90vw',
  'min-height': '20%',
  'margin-top': '1rem',
  'border':'thin solid grey',
  'border-radius': '12px',
  'display':'flex',
  'flex-direction':'column',
  'align-items':'center',
  'box-sizing':'border-box',
  'padding':'1rem',
  'text-align':'left!important'
};




export default class Input {
  constructor(props) {
    this.createInput(props);
    this.generateType(props);
    this.generateStyles();
    return this.el;
  }
    
  
  createInput(props) {
    this.el = document.createElement("input");
      this.el.id = props.id;
      
  }

    generateType(props) {
      this.el.setAttribute('type', props.type)
    }


    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }

}

