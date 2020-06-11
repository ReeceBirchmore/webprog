/* eslint-disable no-unused-vars */
'use strict';

import Divider from '/Components/Divider/divider.js';
import Input from '/Components/Input/input.js';
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
 *  Example of use:
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
    render(this.el, $('root')); // This is classed as a persistent element, it will render itself onto the page
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

    this.buttonsContainer = document.createElement('div');
    this.buttonsContainer.classList.add('card-buttons-container');
    this.el.appendChild(this.buttonsContainer);


    // Link generation
    this.linkInput = new Input({
      id: 'link-' + props.id,
      type: 'text',
      renderPoint: this.el,
      value: 'http://localhost:8080/#/quiz/' + props.id,
      readOnly: true,
    });
    this.linkInput.setAttribute('readonly', true);


    // Icon Generation
    this.binIcon = new Icon({})
    this.binIcon = document.createElement('button');
    this.binIcon.classList.add('icon', 'bin', 'ripple');
    this.linkIcon = document.createElement('button');
    this.linkIcon.classList.add('icon', 'link', 'ripple');
    this.barchartIcon = document.createElement('button');
    this.barchartIcon.classList.add('icon', 'barchart', 'ripple');
    this.editIcon = document.createElement('button');
    this.editIcon.classList.add('icon', 'edit', 'ripple');
    this.buttonsContainer.append(this.binIcon, this.linkIcon, this.barchartIcon, this.editIcon);
  }

  addHandlers(props) {
    this.el.addEventListener('click', function () {
      // Action on clicking the card
    });

    this.linkIcon.addEventListener('click', function () {
      $('link-' + props.id).select();
      $('link-' + props.id).setSelectionRange(0, 99999);
      document.execCommand('copy');
      createToast('Text Copied to Clipboard', 'clipboard');
      // window.open("http://localhost:8080/#/quiz/" + props.id + "/flow/", '_blank');
    });

    this.barchartIcon.addEventListener('click', function () {
      window.location = './#/admin/response/' + props.id;
    });

    this.binIcon.addEventListener('click', function () {
      const popup = window.confirm('Are you sure you want to delete ' + props.quizTitle);
      if (popup === true) deleteQuiz(props.id, props.quizTitle);
    });

    this.editIcon.addEventListener('click', function () {
      window.location = './#/admin/edit/' + props.id;
    });
  }
}