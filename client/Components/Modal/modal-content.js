'use strict';

import Input from '../../Components/Input/input.js';
import Button from '../../Components/Button/button.js';
import Divider from '/Components/Divider/divider.js';

import * as Admin from '../../Containers/Admin/index.js';
import { $, renderText, html } from '../../Javascript/render.js';
import eventHandler from '/Javascript/eventhandlers.js';

let quiztitle;


export function createUpload() {
  const label = document.createElement('label');
  label.id = 'upload-label';
  label.classList.add('upload');
  filebutton = document.createElement('input');
  filebutton.id = 'file-upload';
  filebutton.type = 'file';
  label.setAttribute('for', 'file-upload');
  $('modal-content').appendChild(label);
  $('upload-label').appendChild(filebutton);
  renderText($('upload-label'), 'Upload Quiz');
  filebutton.addEventListener('change', function () {
    Admin.uploadJSON();
  });
}


export default class ModalContent {
  constructor(props) {
    console.log(props);
    this.constructContentStructure(props);
    this.handleModalInformation(props);
  }

  constructContentStructure() {
    this.elContent = html('div', 'modal-content', $('modal'), 'modal-content');
  }


  handleModalInformation(props) {
    renderText(this.elContent, props.content.title, 'h2', 'modal-title');
    const divider = new Divider(this.elContent, 'Information');
    const backButtonDetails = (props.content.allowback === false) ? 'disabled' : 'enabled';
    renderText(this.elContent, 'The author has ' + backButtonDetails + ' the back and clear buttons for this quiz', 'li', '', 'p');

    // if (props.type === 'upload') {
    //   createUpload();

    //   // CREATE DIVIDER, MAKE OWN COMPONENT
    //   const divider = document.createElement('div');
    //   divider.classList.add('separator');
    //   renderText(divider, 'or');
    //   $('modal-content').appendChild(divider);
    //   renderText($('modal-content'), 'Generate a new Quiz', 'h2');

    //   quiztitle = new Input({ id: 'upload-title', type: 'text', placeholder: 'Quiz Name' });
    //   this.elcontent.appendChild(quiztitle);
    //   quiztitle.classList.add('input');
    //   const btn = new Button({ id: 'start-create-quiz', name: 'start-create-quiz', action: 'createQuiz', render: 'modal', type: 'create' });
    // }


    // if (props.type === 'info') {
    //   const linkBox = new Input({ id: 'link', type: 'text', value: props.text });
    //   this.elcontent.appendChild(linkBox);
    //   linkBox.classList.add('input');
    //   new Button({ id: 'copy-link', name: 'copy-link', action: 'copy', render: 'modal-content', text: 'Copy Link' });

    //   // CREATE DIVIDER, MAKE OWN COMPONENT
    //   const divider = document.createElement('div');
    //   divider.classList.add('separator');
    //   renderText(divider, 'or');
    //   $('modal-content').appendChild(divider);
    //   renderText($('modal-content'), 'Edit Quiz', 'h2');
    // }


    // if (props.type === 'info-quiz') {
    //   const linkBox = new Input({ id: 'link', type: 'text', value: props.text });
    //   this.elcontent.appendChild(linkBox);
    //   linkBox.classList.add('input');
    //   new Button({ id: 'copy-link', name: 'copy-link', action: 'copy', render: 'modal-content', text: 'Copy Link' });
    // }
  }
}
