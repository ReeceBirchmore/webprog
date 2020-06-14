'use strict';

import Divider from '/Components/Divider/divider.js';
import Input from '/Components/Input/input.js';
import Icon from '/Components/Icon/icon.js';
import { deleteQuiz } from '/Containers/Admin/index.js';
import { $, render, renderText, html, createToast } from '/Javascript/render.js';


/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, optional but recommended for further referencing
 *  @property {String}  props.quizTitle Title of the questionnaire
 *  @property {String}  props.uid ID of the questionnaire (REQUIRED)
 *
 *
 *  The QuizCard is called upon in the Admin index.js file.
 *
 *  const card = new QuizCard({
 *    id: quiz.quizid,
 *    quizTitle: quiz.title,
 *    uid: quiz.quizid,
 *  });
 *
 */

export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    this.constructTemplate(props);
    this.addHandlers(props);
    render(this.el); // This is classed as a persistent element, it will render itself onto the page
    return this.el;
  }

  createCard(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('card-quiz-list', 'elevated');
  }

  constructTemplate(props) {
    // Title Container Generation
    const titleContainer = html('div', props.id, this.el, 'card-title-container');
    renderText(titleContainer, props.quizTitle, 'h2');
    // Divider Generation
    const divider = new Divider(this.el, 'Actions');
    // Button container Generation
    this.buttonsContainer = html('div', '', this.el, 'card_buttons_container');
    // Link generation
    this.linkInput = new Input({
      id: 'link-' + props.id,
      type: 'text',
      renderPoint: this.el,
      value: window.location.href.split('/')[2] + '/#/quiz/' + props.id,
      readOnly: true,
    });
    this.linkInput.setAttribute('readonly', true);
    // Icon Generation
    this.bin = new Icon({ id: 'bin', class: 'bin', renderPoint: this.buttonsContainer });
    this.previewIcon = new Icon({ id: 'preview', class: 'preview', renderPoint: this.buttonsContainer });
    this.linkIcon = new Icon({ id: 'link', class: 'link', renderPoint: this.buttonsContainer });
    this.barchartIcon = new Icon({ id: 'barchart', class: 'barchart', renderPoint: this.buttonsContainer });
    this.editIcon = new Icon({ id: 'edit', class: 'edit', renderPoint: this.buttonsContainer });
  }

  addHandlers(props) {
    this.el.addEventListener('click', function (e) {
      // Action on clicking the card
      e.stopPropagation();
    });

    this.linkIcon.addEventListener('click', function () {
      $('link-' + props.id).select();
      $('link-' + props.id).setSelectionRange(0, 99999);
      document.execCommand('copy');
      createToast('Text Copied to Clipboard', 'clipboard');
    });

    this.previewIcon.addEventListener('click', function () {
      const link = html('a');
      link.href = '/#/quiz/' + props.id;
      link.target = '_blank';
      link.click();
    });

    this.barchartIcon.addEventListener('click', function () {
      window.location = './#/admin/response/' + props.id;
    });

    this.bin.addEventListener('click', function () {
      const popup = window.confirm('Are you sure you want to delete ' + props.quizTitle);
      if (popup === true) deleteQuiz(props.id, props.quizTitle);
    });

    this.editIcon.addEventListener('click', function () {
      window.location = './#/admin/edit/' + props.id;
    });
  }
}
