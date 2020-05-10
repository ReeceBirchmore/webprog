'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';
import * as Card from '../../Containers/Quiz/index.js';


const directionControlStyles = {
  'background-color': 'white',
  'width': '40vw',
  'height': '3rem',
  'margin-top':'1rem'
};

const next = {
  'width':'100%!important'
}

const previous = {

}

const submit = {

}

const closeStyles = {
 //code
}

const submitStyles = {
 //code
}

const confirmStyles = {
  //code
}


function addHandler(el, props) {
    el.addEventListener("click", function() {
      if(props.action === 'Quiz.up') {
        Quiz.increase(0);
        
        // FX.moveCard();
        // setTimeout(function() {
        //   Quiz.up(); 
        //  }, 100);

      }

      if(props.action === 'Quiz.down') {
        //   Quiz.down(); 
        // setTimeout(function() {
        //   FX.returnCard();
        //  }, 100);
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

    })

}


export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles(props);
    addHandler(this.el, props)
    this.renderPoint(props);
    //Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("button");
        this.el.id = props.id;
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


    }


    renderPoint(props) {
      if(!props.render) {
        Render.render(this.el, Render.$('root'));
      } else {
        Render.render(this.el, Render.$(props.render))
      }
    }
    
    

  }

