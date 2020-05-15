'use strict'

import Input from '../../Components/Input/input.js';
import Button from '../../Components/Button/button.js';


import * as Admin from '../../Containers/Admin/index.js';
import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';


let quiztitle;
export let filebutton;

export function createUpload() {
  let label = document.createElement("label");
    label.id = "upload-label";
    label.classList.add('upload');
  filebutton = document.createElement("input");
    filebutton.id = "file-upload";
    filebutton.type = "file";
    label.setAttribute ('for', 'file-upload');
  Render.$('modal-content').appendChild(label);
  Render.$('upload-label').appendChild(filebutton);
  Render.renderText(Render.$('upload-label'), "Upload Quiz");
  
  filebutton.addEventListener('change', function() {
    Admin.uploadJSON();
  });


  }


export default class ModalContent {
  constructor(props) {
    console.log(props);
    this.createModalContent(props);
    this.handleModalInformation(props);
  }
  
    createModalContent() {
      this.elcontent = document.createElement("div");
        this.elcontent.id = "modal-content";
        this.elcontent.classList.add("modal-content");
        Render.$('modal').appendChild(this.elcontent);
        console.log(Render.$('modal-content'))
        this.elcontent.addEventListener('click',function (event){
          event.stopPropagation();
       });
    }


    handleModalInformation(props) {
      Render.renderText(this.elcontent, props.title, "h2");

      if(props.type === 'upload') {
        createUpload();

        //CREATE DIVIDER, MAKE OWN COMPONENT
        let divider = document.createElement("div");
          divider.classList.add("separator");
        Render.renderText(divider, "or");
        Render.$('modal-content').appendChild(divider);
        Render.renderText(Render.$('modal-content'), "Generate a new Quiz", "h2");

          quiztitle = new Input({id: 'upload-title', type: 'text', placeholder: "Quiz Name" });
          this.elcontent.appendChild(quiztitle);
            quiztitle.classList.add("input");
         let btn = new Button({id: "start-create-quiz", name:"start-create-quiz", action: "createQuiz", render: "modal", type: 'create'});
      }


      if(props.type === 'info') {
        let linkBox = new Input({id: 'link', type: 'text', value: props.text});
        this.elcontent.appendChild(linkBox);
          linkBox.classList.add('input');
        new Button({id: "copy-link", name:"copy-link", action: "copy", render: "modal-content", text: 'Copy Link'});

        //CREATE DIVIDER, MAKE OWN COMPONENT
        let divider = document.createElement("div");
          divider.classList.add("separator");
        Render.renderText(divider, "or");
        Render.$('modal-content').appendChild(divider);
        Render.renderText(Render.$('modal-content'), "Edit Quiz", "h2");
      }




      if(props.type === 'info-quiz') {
        let linkBox = new Input({id: 'link', type: 'text', value: props.text});
        this.elcontent.appendChild(linkBox);
          linkBox.classList.add('input');
        new Button({id: "copy-link", name:"copy-link", action: "copy", render: "modal-content", text: 'Copy Link'});
      }

    }















    attachButtons(props) {
      //Code for the different button types here!

      if(props.type === 'upload') {
        //Code for showing next/prev buttons, as well as launching upload sequence.
        //This section is to be triggered from handleModalInformation textbox being filled
      }

    }




}


