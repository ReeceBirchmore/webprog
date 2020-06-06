'use strict';

export default class Toggle {
  constructor(props) {
    this.createToggleStructure(props);
    return this.el;
  }


  createToggleStructure(text) {
    this.el = document.createElement('div');
    this.el.classList.add('material-toggle');

    this.input = document.createElement('input');
    this.input.id = 'toggle';
    this.input.type = 'checkbox';
    this.input.setAttribute('name', 'toggle');
    this.input.checked = true;

    this.input.classList.add('switch');

    this.label = document.createElement('label');
    this.label.setAttribute('for', 'toggle');


    this.el.append(this.input, this.label);
  }
}
