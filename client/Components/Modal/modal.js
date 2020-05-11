'use strict'

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';



function hideModal() {
  if(Render.$('modalbg')) {
    Render.$('modal').classList.add('modal-destroy');
    Render.$('modalbg').classList.add('modal-bg-destroy');
    setTimeout(function() {
      Render.removeRender(Render.$('modalbg'));
    },200);
  }
}



export default class Modal {
  constructor(props) {
    this.createModalbg(props);
    Render.render(this.bg, Render.$('root'));
    this.createModal(props);
    this.createModalContent(props);
    this.renderText(props);
    Render.render(this.el, this.bg);
  }
  
    createModalbg() {
      this.bg = document.createElement("div");
        this.bg.id = "modalbg";
        this.bg.classList.add("modal-bg");
        this.bg.addEventListener("click", hideModal);
        return this.bg;
    }

    createModal() {
      this.el = document.createElement("div");
        this.el.id = "modal";
        this.el.classList.add("modal");
        this.bg.appendChild(this.el);
        return this.el;
    }

    createModalContent() {
      this.elcontent = document.createElement("div");
        this.elcontent.id = "modal-content";
        this.elcontent.classList.add("modal-content");
        this.el.appendChild(this.elcontent);
    }

    renderText(props) {
      Render.renderText(this.elcontent, props.title, "h2");
      Render.renderText(this.elcontent, props.text)
    }


}


