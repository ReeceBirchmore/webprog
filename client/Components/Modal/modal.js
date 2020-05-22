'use strict';

import ModalContent from '../../Components/Modal/modal-content.js';
import { $, html } from '../../Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';

export function hideModal() {
  if ($('modalbg')) {
    $('modal').classList.add('modal-destroy');
    $('modalbg').classList.add('modal-bg-destroy');
    setTimeout(function () {
      // Render.removeRender(Render.$('modalbg'));
      $('body').removeChild($('modalbg'));
    }, 200);
  }
}


export default class Modal {
  constructor(props) {
    this.createModalbg();
    this.createModal();
    this.modalContent(props);
  }

  createModalbg() {
    this.bg = html('div', 'modalbg', $('body'), 'modal-bg');
    eventHandler(this.bg, 'click', hideModal, false);
  }

  createModal() {
    this.el = html('div', 'modal', this.bg, 'modal');
    eventHandler(this.el, 'click', '', false);
  }

  modalContent(props) {
    const content = new ModalContent({ content: props.content });
  }
}
