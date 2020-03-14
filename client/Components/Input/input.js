'use strict'

import * as Render from '../../Javascript/render.js';


export class Input {
  constructor(props) {
    this.createCard(props);
    Render.render(this.card);
  }
  

  //Functions to contain state of the card



  //Create card
  createCard(props) {
    this.card = document.createElement("div");
      this.card.id = props.id;
  }



}

