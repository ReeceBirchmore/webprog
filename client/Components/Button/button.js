'use strict'

import * as Render from '../../Javascript/render.js';
import * as Quiz from '../../Containers/Quiz/index.js'

const styles = {
  'background-color': 'white',
  'width': '40vw',
  'height': '5rem',
  'margin-top':'1rem'
};

export default class Button {
  constructor(props) {
    this.createBtn(props);
    this.generateStyles();
    this.addHandler(props)
    Render.render(this.el, Render.$('root'));
    Render.renderText(this.el, props.name);
  }
  
    createBtn(props) {
      this.el = document.createElement("button");
        this.el.id = props.id;
    }

    generateStyles() {
      this.el.setAttribute("style", Render.useStyles(styles));
    }

    addHandler(props) {
      this.el.addEventListener("click", function() {
        Quiz.upDown(props.action);
      })
    }

  }

