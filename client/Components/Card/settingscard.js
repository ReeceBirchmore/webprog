'use strict';

import Input from '/Components/Input/input.js';
import Divider from '/Components/Divider/divider.js';
import Icon from '/Components/Icon/icon.js';
import Toggle from '/Components/Toggle/toggle.js';

import { $, renderText, html, render, pointer } from '/Javascript/render.js';
import * as Admin from '/Containers/Admin/index.js';
import * as Edit from '/Containers/Edit/index.js';

import { editTitle, enableQuiz, enableRestrict, enableBack } from '/Containers/Edit/index.js';


/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, recommended for further referencing
 *  @property {Boolean} props.required This should be TRUE if the question is a required question, false by default
 *
 *  The card is called upon in the quiz index.js file.
 *
 *  Example of use:
 *
 *  const card = new Card({
 *    id: 'card-' + qNum++,
 *    required: true,
 *  });
 *
 */

export default class SettingsCard {
  constructor(props) {
    this.createCard(props);
    this.constructTemplate(props);
    return this.el;
  }

  createCard(props) {
    this.el = html('div', (!props.id) ? '' : props.id, '', '');
    this.el.classList.add(((!props.class) ? 'card-linear' : props.class), 'elevated');
    if (props.required) this.el.setAttribute('data-required', props.required);
    render(this.el);
  }


  constructTemplate(props) {
    // Title Input
    this.input = new Input({
      id: 'input-quiztitle',
      placeholder: props.title,
      value: props.title,
      type: 'text',
      renderPoint: this.el,
      eventListeners: false,
    });
    this.titleChangeHandler();


    // Enable the quiz?
    const enableQuizContainer = html('div', '', this.el, 'card-title-container');
    renderText(enableQuizContainer, 'Enable Quiz', 'h3');
    this.enablequiz = new Toggle({
      id: 'toggle-enablequiz',
      renderPoint: enableQuizContainer,
      checked: props.enabled,
      class: 'material-toggle-settings',
    });
    const enabled = ($('toggle-enablequiz').checked === true) ? 'Quiz Enabled' : 'Quiz Disabled';
    renderText(enableQuizContainer, enabled, 'p', 'text-enablequiz', 'small');
    $('text-enablequiz').style.color = (props.enabled === true) ? 'black' : '#AAA5AF';
    this.enableQuizHandler(props);


    // Allow the back button?
    const backContainer = html('div', '', this.el, 'card-title-container');
    renderText(backContainer, 'Back Button', 'h3');
    this.enableBack = new Toggle({
      id: 'toggle-enableback',
      renderPoint: backContainer,
      checked: props.allowBack,
      class: 'material-toggle-settings',
    });
    const backbutton = ($('toggle-enableback').checked === true) ? 'Button Enabled' : 'Button Disabled';
    renderText(backContainer, backbutton, 'p', 'text-enableback', 'small');
    $('text-enableback').style.color = (props.allowBack === true) ? 'black' : '#AAA5AF';
    this.enableBackHandler(props);



    // Restrict the amount of answers per device?
    const restrictContainer = html('div', '', this.el, 'card-title-container');
    renderText(restrictContainer, 'Limit Attempts', 'h3');
    this.enableBack = new Toggle({
      id: 'toggle-enablerestrict',
      renderPoint: restrictContainer,
      checked: props.restricted,
      class: 'material-toggle-settings',
    });
    const restrict = ($('toggle-enablerestrict').checked === true) ? 'Restricted' : 'Unrestricted';
    renderText(restrictContainer, restrict, 'p', 'text-enablerestrict', 'small');
    $('text-enablerestrict').style.color = (props.restricted === true) ? 'black' : '#AAA5AF';
    this.enableRestrictHandler(props);

  }



  titleChangeHandler() {
    this.input.addEventListener('input', function () {
      editTitle($('input-quiztitle').value);
    });
  }

  enableQuizHandler() {
    this.enablequiz.addEventListener('change', function () {
      $('text-enablequiz').textContent = ($('toggle-enablequiz').checked === true) ? 'Quiz Enabled' : 'Quiz Disabled';
      $('text-enablequiz').style.color = ($('toggle-enablequiz').checked === true) ? 'black' : '#AAA5AF';
      enableQuiz($('toggle-enablequiz').checked);
    });
  }

  enableBackHandler() {
    this.enableBack.addEventListener('change', function () {
      $('text-enableback').textContent = ($('toggle-enableback').checked === true) ? 'Button Enabled' : 'Button Disabled';
      $('text-enableback').style.color = ($('toggle-enableback').checked === true) ? 'black' : '#AAA5AF';
      enableBack($('toggle-enableback').checked);
    });
  }

  enableRestrictHandler() {
    this.enableBack.addEventListener('change', function () {
      $('text-enablerestrict').textContent = ($('toggle-enablerestrict').checked === true) ? 'Restricted' : 'Unrestricted';
      $('text-enablerestrict').style.color = ($('toggle-enablerestrict').checked === true) ? 'black' : '#AAA5AF';
      enableRestrict($('toggle-enablerestrict').checked);
    });
  }
}
