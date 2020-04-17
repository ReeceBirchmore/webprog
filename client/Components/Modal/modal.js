'use strict'

import * as Render from '../../Javascript/render.js';




function hideModal() {
  if(Render.$('modalbg')) {
    Render.removeRender(Render.$('modalbg'))
  }
}



export default class Modal {
  constructor(props) {
    this.createModal(props);
    this.createModalContent(props);
    this.renderText(props);

    Render.render(this.bg, Render.$('root'));
    Render.render(this.el, this.bg);
   
    //Try not to render within the component generator!
    //
  }
  
    createModal() {
      this.bg = document.createElement("div");
        this.bg.id = "modalbg";
        this.bg.classList.add("modal");
        this.bg.addEventListener("click", hideModal);
    }

    createModalContent() {
      this.el = document.createElement("div");
        this.el.id = "modal";
        this.el.classList.add("modal-content");
    }


    renderText(props) {
      Render.renderText(this.el, props.title, "h2");
      Render.renderText(this.el, props.text)
    }


}


