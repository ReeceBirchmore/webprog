'use strict'


import Modal from '../Modal/modal.js';

import * as Render from '../../Javascript/render.js';
import { j } from '../../Containers/Quiz/index.js';

const navbar = {
    'position':'fixed',
    'background-color': 'black',
    'z-index' :' 10000',
    'width': '100vw',
    'height': '10%',
    'display': 'flex',
    'flex-direction': 'row',
    'justify-content':'space-between'
};




// function handleProfile(props) {
//   Render.setState('visibility', props);
// }




export default class Navlinks {
  constructor(props) {
    console.log(props)
    this.displayLinks(props);
  }


    
    displayLinks(props) {
      if(props.title) {
        console.log(props.title);
        Render.renderText(Render.$('nav'), props.title);
      }
      return;
    }



    eventHandler(props) {
      this.el.addEventListener("click", function() {
        console.log(j);
        let modal = new Modal({text: "Click to continue", title:"Example Questionnaire"})
      });
    }

    //Handle Hamburger menu
    displayMenuButton(props) {
      


    }





}

