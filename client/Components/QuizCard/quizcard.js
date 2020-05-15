'use strict'

import Modal from '../../Components/Modal/modal.js';
import * as Admin from '../../Containers/Admin/index.js';

import * as Render from '../../Javascript/render.js';



export default class QuizCard {
  constructor(props) {
    this.createCard(props);
    if(props.option) {
      this.constructCreateQuizCardTemplate();
    } else {
      this.constructTemplate(props);
    }
    this.addHandlers(props);
    Render.render(this.el, Render.$('root'));
    return this.el;
  }
  
    createCard(props) {
      this.el = document.createElement("div");
        this.el.id = props.id;
        this.el.classList.add("card-quiz-list");
    }

    constructTemplate(props) {

      //Title Container Generation

      let titleContainer = document.createElement('div');
        titleContainer.classList.add('card-quiz-title-container');
        this.el.appendChild(titleContainer);
        Render.renderText(titleContainer, props.quizTitle, "h2");
      let openIcon = document.createElement("div");
        openIcon.classList.add("icon-next");
        titleContainer.appendChild(openIcon);
        
      //Divider Generation

      let divider = document.createElement("div");
        divider.classList.add("separator");
        Render.renderText(divider, "Details");
        this.el.appendChild(divider);

      //Container Generation

      let overviewContainer = document.createElement('div');
        overviewContainer.classList.add('card-quiz-overview-container');
        this.el.appendChild(overviewContainer);
        let detailsContainer = document.createElement('div');
        detailsContainer.classList.add('card-quiz-details-container') 
        overviewContainer.appendChild(detailsContainer)
      this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('card-quiz-buttons-container');
        overviewContainer.appendChild(this.buttonsContainer);



      //Icon Generation

      this.binIcon = document.createElement("div");
        this.binIcon.classList.add('icon', 'bin');
        this.buttonsContainer.appendChild(this.binIcon);
      this.settingsIcon = document.createElement('div');
        this.settingsIcon.classList.add('icon', 'settings');
        this.buttonsContainer.appendChild(this.settingsIcon);
      this.editIcon = document.createElement('div');
        this.editIcon.classList.add('icon', 'edit');
        this.buttonsContainer.appendChild(this.editIcon);


      //Quiz Details Generation
      
      Render.renderText(detailsContainer, "5 Questions");
      Render.renderText(detailsContainer, "5 Responses");
        


    

    }








    constructCreateQuizCardTemplate() {
      let icon = document.createElement("div");
        icon.classList.add("card-quiz-add-icon");
      this.el.appendChild(icon);
    }

   
    addHandlers(props) {  
      if(props.type === 'quiz') {
        this.el.addEventListener("click", function() {
          let modal = new Modal({type: 'info', title: props.quizTitle, text: 'http://localhost:8080/quiz/' + props.uid + '/flow/'})
        });
        this.buttonsContainer.addEventListener("click", function (event) {
          event.stopPropagation();
        });
        this.settingsIcon.addEventListener("click", function() {
          console.log("SETTINGS", props.id);
        });
        this.binIcon.addEventListener("click", function() {
          let popup = window.confirm("Are you sure you want to delete " + props.quizTitle);
          if (popup === true) Admin.deleteQuiz(props.id, props.quizTitle);
        });
        this.editIcon.addEventListener("click", function() {
          console.log("EDIT", props.id)
        });
      } 
      if(props.type === 'create') {
        this.el.addEventListener("click", function() {
        let modal = new Modal({type: 'upload', title: "Upload a Quiz"})
        });
      }
    }
    
}


