'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js';
import * as FX from '../../Javascript/fx.js';


const directionControlStyles = {
  'background-color': 'white',
  'width': '40vw',
  'height': '5rem',
  'margin-top':'1rem'
};

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
      if(props.action === 'Quiz.upDown') {
        Quiz.upDown(props.param);
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


    })

}


export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles();
    addHandler(this.el, props)
    Render.render(this.el, Render.$('root'));
    Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("button");
        this.el.id = props.id;
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(directionControlStyles));
    }

    
    

  }

