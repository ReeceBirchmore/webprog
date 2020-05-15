'use strict'


import Modal from '../../Components/Modal/modal.js';

import { $, render, renderText } from '../../Javascript/render.js';
import { j } from '../../Containers/Quiz/index.js';

import * as Admin from '/Containers/Admin/index.js';



export default class Nav {
  constructor(props) {
    this.createFrame(props);
    if(props.return === true) this.displayReturnIcon();
    if(props.add === true) this.displayUploadIcon();
    if(props.close === true) this.displayCloseIcon();
    this.displayTitle(props);
    this.eventHandler(props);    
    render(this.el, $('body'));
  }
   
    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id;
          this.el.classList.add("nav");
    }

    displayTitle(props) {
      let title = renderText(this.el, props.title, "h2");
      title.classList.add('center')
    }

    displayReturnIcon() {
      this.returnIcon = document.createElement('button');
        this.returnIcon.classList.add('icon', 'return', 'ripple');
        this.el.appendChild(this.returnIcon);
    }

    displayUploadIcon() {
      this.uploadIcon = document.createElement('button');
        this.uploadIcon.classList.add('icon', 'add', 'ripple');
        this.el.appendChild(this.uploadIcon);
    }

    displayCloseIcon() {
      this.closeIcon = document.createElement('button');
        this.closeIcon.classList.add('icon', 'close', 'ripple');
        this.el.appendChild(this.closeIcon);
    }


    eventHandler(props) {
      if(props.return) {
        this.returnIcon.addEventListener("click", function() {
          history.back();
        });
      }
      if(props.add) {
        this.uploadIcon.addEventListener("click", function() {
          new Modal({type: 'upload', title: "Upload a Quiz"})
        });
      }
      if(props.close) {
        this.closeIcon.addEventListener("click", function() {
          Admin.generatePage();
        });
      }
    }




}





    // //Handle profile button
    // displayProfile(props) {
    //     this.profile = document.createElement("div");
    //       this.profile.id = props.id + "Profile";
    //       this.profile.setAttribute("style", Render.useStyles(profile));
    //       Render.render(this.profile, this.el);
    // }