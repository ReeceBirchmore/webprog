'use strict'

import Input from '../../Components/Input/input.js';
import ModalContent from '../../Components/Modal/modal-content.js';

import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';



export function hideModal() {
  if(Render.$('modalbg')) {
    Render.$('modal').classList.add('modal-destroy');
    Render.$('modalbg').classList.add('modal-bg-destroy');
    setTimeout(function() {
      // Render.removeRender(Render.$('modalbg'));
      Render.$('body').removeChild(Render.$('modalbg'));
    },200);
  }
}



export default class Modal {
  constructor(props) {
    this.createModalbg(props);
    Render.render(this.bg, Render.$('body'));
    this.createModal(props);
    Render.render(this.el, this.bg);
  }
  
    createModalbg() {
      this.bg = document.createElement("div");
        this.bg.id = "modalbg";
        this.bg.classList.add("modal-bg");
        this.bg.addEventListener("click", hideModal, false);
        return this.bg;
    }

    createModal(props) {
      this.el = document.createElement("div");
        this.el.id = "modal";
        this.el.classList.add("modal");
        this.bg.appendChild(this.el);
        this.el.addEventListener('click',function (event){
          event.stopPropagation();
       });
       
       new ModalContent({type: props.type, title: props.title, text: props.text, params: props.param});
    }
}


