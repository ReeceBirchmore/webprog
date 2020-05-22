'use strict';

import Modal from '../../Components/Modal/modal.js';
import * as Admin from '../../Containers/Admin/index.js';

import * as Render from '../../Javascript/render.js';


export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    if (props.option) {
      this.constructCreateQuizCardTemplate();
    } else {
      this.constructTemplate(props);
    }
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
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('card-title-container');
    this.el.appendChild(titleContainer);
    Render.renderText(titleContainer, props.quizTitle, 'h2');
    const openIcon = document.createElement('div');
    openIcon.classList.add('icon-next');
    titleContainer.appendChild(openIcon);

    // Divider Generation
    const divider = document.createElement('div');
    divider.classList.add('separator');
    Render.renderText(divider, 'Details');
    this.el.appendChild(divider);

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


    // Quiz Details Generation
    Render.renderText(detailsContainer, '5 Questions');
    Render.renderText(detailsContainer, '5 Responses');
  }


  constructCreateQuizCardTemplate() {
    const icon = document.createElement('div');
    icon.classList.add('card-quiz-add-icon');
    this.el.appendChild(icon);
  }


  addHandlers(props) {
    if (props.type === 'quiz') {
      this.el.addEventListener('click', function () {
        const modal = new Modal({ type: 'info', title: props.quizTitle, text: 'http://localhost:8080/quiz/' + props.uid + '/flow/' });
      });
      this.overviewContainer.addEventListener('click', function (event) {
        event.stopPropagation();
      });


      this.linkIcon.addEventListener('click', function () {
        navigator.clipboard.writeText('http://localhost:8080/#/quiz/' + props.id + '/flow/');
        Render.createToast('Text Copied to Clipboard', null, 'close');
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
    if (props.type === 'create') {
      this.el.addEventListener('click', function () {
        const modal = new Modal({ type: 'upload', title: 'Upload a Quiz' });
      });
    }
  }
}
