'use strict'

import * as Render from '../../Javascript/render.js';

const styles = {
  'background-color': 'white',
  'width': '90vw',
  'min-height': '60%',
  'margin-top': '1rem',
  'border-style': 'solid',
  'border-width': 'thin',
  'border-color': 'grey',
  'border-radius': '18px'
};

const flowStyles = {

  'background-color': 'white',
  'width': '90vw',
  'min-height': '60%',
  'margin-top': '1rem',
  'border-style': 'solid',
  'border-width': 'thin',
  'border-color': 'grey',
  'border-radius': '18px'
};

export default class Card {
  constructor(props) {
    this.createCard(props);
    this.generateStyles();
    Render.renderText(this.el, props.title);
    return this.el;
    //Try not to render within the component generator!
    //Render.render(this.el, Render.$('root'));
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(flowStyles));
    }
}


