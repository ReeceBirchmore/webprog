'use strict'

import * as Render from '../../Javascript/render.js';


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

const profile = {
    'background-color': 'white',
    'z-index':' 10000',
    'width': '10vw',
    'background-image': 'url("./assets/images/account.svg")' 
}



// function handleProfile(props) {
//   Render.setState('visibility', props);
// }




export default class NavBar {
  constructor(props) {
    this.createFrame(props);
    //this.displayProfile(props);
    
    //Render.setState(this.el);
  }
   
    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id + "Nav";
          this.el.setAttribute("style", Render.useStyles(navbar));
          Render.render(this.el, Render.$('nav'));
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
      //code,
    }


    //Handle Hamburger menu
    displayMenuButton(props) {
      


    }





}

