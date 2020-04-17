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




export default class Footer {
  constructor(props) {
    this.createFrame(props);

    
    //Render.setState(this.el);
  }
   
    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id;
          this.el.classList.add('footer');
          Render.render(this.el, Render.$('Footer'));
    }





    //Handle profile button TODELETE
    displayProfile(props) {
        this.profile = document.createElement("div");
          this.profile.id = props.id + "Profile";
          this.profile.setAttribute("style", Render.useStyles(profile));
          //handleProfile(props);
          Render.render(this.profile, this.el);
    }






}

