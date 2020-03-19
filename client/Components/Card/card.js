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




export default class Card {
  constructor(props) {
    this.createCard(props);
    this.generateStyles();
    if(props.title) {
      Render.renderText(this.el, props.title);
    }
    return this.el;
    //Try not to render within the component generator!
    //Render.render(this.el, Render.$('root'));
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }
}


