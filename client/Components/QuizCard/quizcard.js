/* eslint-disable no-unused-vars */
'use strict';

import Divider from '/Components/Divider/divider.js';


import * as Admin from '/Containers/Admin/index.js';
import { deleteQuiz } from '/Containers/Admin/index.js';

import * as Render from '/Javascript/render.js';
import { $, render, renderText, html } from '/Javascript/render.js';


export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    this.constructTemplate(props);
    this.addHandlers(props);


    Render.render(this.el, Render.$('root'));

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
    const divider = new Divider(this.el, 'Details');
    // Container Generation
    this.overviewContainer = document.createElement('div');
    this.overviewContainer.classList.add('card-overview-container');
    this.el.appendChild(this.overviewContainer);
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('card-details-container');
    this.overviewContainer.appendChild(detailsContainer);
    this.buttonsContainer = document.createElement('div');
    this.buttonsContainer.classList.add('card-buttons-container');
    this.overviewContainer.appendChild(this.buttonsContainer);

    // Icon Generation
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
    this.overviewContainer.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    this.linkIcon.addEventListener('click', function () {
      navigator.clipboard.writeText('http://localhost:8080/#/quiz/' + props.id + '/flow/');
      Render.createToast('Text Copied to Clipboard', 'clipboard');
      // window.open("http://localhost:8080/#/quiz/" + props.id + "/flow/", '_blank');
    });

    this.barchartIcon.addEventListener('click', function () {
      window.location = './#/admin/quiz/response/' + props.id;
    });

    this.binIcon.addEventListener('click', function () {
      const popup = window.confirm('Are you sure you want to delete ' + props.quizTitle);
      if (popup === true) Admin.deleteQuiz(props.id, props.quizTitle);
    });

    this.editIcon.addEventListener('click', function () {
      window.location = './#/admin/quiz/edit/' + props.id;
    });
  }
}
