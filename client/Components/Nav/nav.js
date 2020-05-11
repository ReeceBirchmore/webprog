'use strict'


import Modal from '../../Components/Modal/modal.js';
import Navlinks from '/Components/Navlinks/navlinks.js';

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




export default class Nav {
  constructor(props) {
    this.createFrame(props);
    this.displayTitle(props);
    this.displayQuestions(props);
    this.eventHandler(props);
    Render.render(this.el, Render.$('root'));
    return this.el;
  }
   
    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id;
          this.el.classList.add("nav");
    }

    //Handle profile button
    displayProfile(props) {
        this.profile = document.createElement("div");
          this.profile.id = props.id + "Profile";
          this.profile.setAttribute("style", Render.useStyles(profile));
          //handleProfile(props);
          Render.render(this.profile, this.el);
    }

    //Handle Title
    displayTitle(props) {
      Render.renderText(this.el, props.title, "h2");
    }


    displayQuestions(props) {
      if(props.questions) {
        Render.renderText(this.el, props.questions + " questions");
      }
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

