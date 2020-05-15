'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as Admin from '../../Containers/Admin/index.js';
import * as FX from '../../Javascript/fx.js';
import * as Card from '../../Containers/Quiz/index.js';

import { answers } from '/Components/Input/input.js';


function addHandler(el, props) {
    el.addEventListener("click", function() {
      if(props.action === 'Quiz.up') {
        Quiz.increase(0);
      }

      if(props.action === 'Quiz.down') {
        Quiz.decrease(0);
      }


      if(props.action === 'routerNav') {
        Router.get(props.action)
      }



      if(props.action === 'toast') {
        FX.toastManagement();
      }


      if(props.action === 'progress') {
        FX.progressCheck(props.param)
      }


      if(props.action === 'openQuiz') {
        Quiz.openQuiz(props.param);
      }


      if(props.action === 'toLinear') {
        Quiz.toLinear(props.param);
      }


      if(props.action === 'submit') {
        Quiz.submitQuiz();
      }


      if(props.action === 'upload') {
        Admin.uploadJSON();
      }

      if(props.action === 'createQuiz') {
        Admin.createNewQuiz({answers}.answers.response[0].value);
      }

      if(props.action === 'copy') {
        
        let copyText = Render.$('link');
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        Render.createToast("Text Copied to Clipboard", FX.toastClear, 'close')
      }


    })

}

export let input1;


export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles(props);
    addHandler(this.el, props)
    this.renderPoint(props);
  }
  
    createBtn(props) {
      this.el = document.createElement("button");
        this.el.id = props.id;
        this.el.classList.add("button");
        if(props.text) {
          let text = document.createElement("div");
          Render.renderText(text, props.text);
            text.classList.add("div")
          this.el.appendChild(text);
          
        }
    }











    generateStyles(props) {
      if(props.type === 'previous') {
        let icon = document.createElement("div");
          icon.classList.add("prev")
          this.el.appendChild(icon);
        let text = document.createElement("div");
          Render.renderText(text, "Previous");
            text.classList.add("div")
          this.el.appendChild(text);
        this.el.classList.add("button");
        this.el.classList.add("left")
        }
      if(props.type === 'next') {
        let text = document.createElement("div");
          Render.renderText(text, "Next");
            text.classList.add("div")
            this.el.appendChild(text);
          let icon = document.createElement("div");
            icon.classList.add("next")
            this.el.appendChild(icon);
          this.el.classList.add("button");
          this.el.classList.add("right");
        }
        if(props.type === 'submit') {
          let text = document.createElement("div");
          Render.renderText(text, "Submit");
            text.classList.add("div")
            this.el.appendChild(text);
          this.el.classList.add("button");
          this.el.classList.add("right");
        }

        if(props.type === 'create') {
          let text = document.createElement("div");
          Render.renderText(text, "Create Quiz");
            text.classList.add("div")
            this.el.appendChild(text);
          this.el.classList.add("upload");
        }

        if(props.type === 'else') {
          //empty code
        }
        
    }


    renderPoint(props) {
      if(!props.render) {
        Render.render(this.el, Render.$('root'));
      } else {
        Render.render(this.el, Render.$(props.render))
      }
    }
    
    

  }

