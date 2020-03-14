'use strict'

import * as Render from '../../Javascript/render.js';


const styles = {
    'background-color': 'black',
    'z-index' :' 10000',
    'width': '100vw',
    'height': '100%',
};












export default class NavBar {
  constructor(props) {
    this.createFrame(props);
    this.generateStyles();
    Render.render(this.el, Render.$('nav'));
  }

    createFrame(props) {
        this.el = document.createElement("div");
          this.el.id = props.id + "Nav";
    }

    generateStyles() {
        this.el.setAttribute("style", Render.useStyles(styles));
    }
}

