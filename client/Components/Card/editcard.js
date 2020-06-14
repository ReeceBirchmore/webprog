'use strict';

import Input from '/Components/Input/input.js';
import Icon from '/Components/Icon/icon.js';
import Toggle from '/Components/Toggle/toggle.js';
import { $, renderText, html, render, pointer } from '/Javascript/render.js';
import { deleteQuestion, addOption, removeOptionEventListeners, changeQuestionTitle, changeRequired, changeMinValue, changeMaxValue } from '/Containers/Edit/index.js';

/*********************************************************************
 *
 *  @typedef  {Object}  Props
 *  @property {String}  props.id ID to assign the element, recommended for further referencing
 *  @property {Boolean} props.deleted Whether the question is to be prepped for deletion, false by default
 *  @property {String}  props.input Input type to push onto the card, for the range of selectors, check the README.md file
 *  @property {Int}     props.max The max value (for number types) Null by default
 *  @property {Int}     props.min The min value (for number types) Null by default
 *  @property {Array}   props.options The options available for a multiple-option question
 *  @property {Int}     props.qid The question ID (from the database)
 *  @property {Int}     props.questionNum The question Number (for the title)
 *  @property {Boolean} props.required Whether the question is required
 *  @property {String}  props.title The questions title
 *
 *  The card is called upon in the Edit index.js file
 *
 *  Example of use:
 *
 *  const card = new EditCard({
 *    id: 'card-' + question.id,
 *    title: question.question,
 *    questionNum: questionNumber++,
 *    input: question.input,
 *    qid: question.id,
 *    options: question.options,
 *    required: question.required,
 *    min: question.min,
 *    max: question.max,
 *    deleted: false,
 *   });
 *
 */

export default class EditCard {
  constructor(props) {
    this.createEditCard(props);
    this.createEditCardTemplate(props);
    this.optionConstraints(props);
    if (props.options !== null) this.optionsGenerate(props);
    return this.el;
  }

  createEditCard(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('card-linear', 'elevated');
    render(this.el);
  }

  createEditCardTemplate(props) {
    // Question Number and Required Toggle
    const titleContainer = html('div', '', this.el, 'card-title-container');
    this.icon = new Icon({
      id: 'bin-' + props.qid,
      class: 'bin',
      renderPoint: titleContainer,
    });
    this.deleteQuestionHandler(props);

    renderText(titleContainer, 'Question ' + props.questionNum, 'h2', 'number-' + props.qid, 'title');

    renderText(titleContainer, 'Required', 'p', 'text-' + props.qid, 'small');
    this.toggle = new Toggle({
      id: 'toggle-' + props.qid,
      renderPoint: titleContainer,
      checked: props.required,
    });
    $('text-' + props.qid).style.color = (props.required === true) ? 'black' : '#AAA5AF';
    this.toggleHandler(props);

    // Title Input
    this.input = new Input({
      id: 'title-' + props.qid,
      placeholder: props.title,
      value: props.title,
      type: 'text',
      renderPoint: this.el,
      eventListeners: false,
    });
    this.changeTitleHandler(props);

    // Select Type Input
    this.select = new Input({
      id: 'selector-' + props.qid,
      type: 'select',
      types: ['text', 'number', 'single-select', 'multi-select'], // Modify these
      value: props.input,
      qid: props.qid,
      eventListeners: false,
      renderPoint: this.el,
    });


    // Append a pre-prepared group to the card
    this.group = html('div', 'group-' + props.qid, $('card-' + props.qid));
    this.group.setAttribute('data-type', props.input);
  }


  /******************************************************************************
   *
   * This function will handle the question being deleted
   *
   ******************************************************************************/

  deleteQuestionHandler(props) {
    this.icon.addEventListener('click', function () {
      const undo = html('div', 'undo-' + props.qid, $('card-' + props.qid), 'undo_delete');
      renderText(undo, 'Undo', 'h2', 'undotext-' + props.qid);
      undo.addEventListener('click', function (e) {
        $('card-' + props.qid).removeChild($('undo-' + props.qid));
      });
      deleteQuestion(props.qid);
    });
  }


  /******************************************************************************
   *
   * This function will handle the question title being updated
   *
   ******************************************************************************/

  changeTitleHandler(props) {
    this.input.addEventListener('input', function () {
      changeQuestionTitle($('title-' + props.qid).value, props.qid);
    });
  }

  /******************************************************************************
   *
   * This function will handle the required toggle being updated
   *
   ******************************************************************************/
  toggleHandler(props) {
    this.toggle.addEventListener('change', function () {
      changeRequired($('toggle-' + props.qid).checked, props.qid);
    });
  }

  /******************************************************************************
   *
   * This function will handle the Min/Max values being updated
   *
   ******************************************************************************/

  numberEventListeners(props) {
    this.min.addEventListener('input', function (e) {
      changeMinValue(parseInt($('min-' + props.qid).value), props.qid);
    });

    this.max.addEventListener('input', function (e) {
      changeMaxValue(parseInt($('max-' + props.qid).value), props.qid);
    });
  }

  /******************************************************************************
   *
   * This function will handle the type being changed (dropdown)
   *
   ******************************************************************************/

  optionConstraints(props) {
    // Number Input Constraints (Min/Max)
    if (props.input === 'number') {
      this.min = new Input({
        id: 'min-' + props.qid,
        placeholder: 'Enter Min',
        type: 'number',
        renderPoint: this.group,
        eventListeners: false,
        value: props.min,
      });
      this.max = new Input({
        id: 'max-' + props.qid,
        placeholder: 'Enter Max',
        type: 'number',
        renderPoint: this.group,
        eventListeners: false,
        value: props.max,
      });
      this.numberEventListeners(props);
    }
    // Multi Option Input
    if (props.input === 'single-select' || props.input === 'multi-select') {
      this.optionInput = new Input({
        id: 'optionInput-' + props.qid,
        placeholder: 'Enter options',
        type: 'text',
        renderPoint: this.group,
        eventListeners: false,
      });
      renderText($('group-' + props.qid), pointer + ' options to delete', 'p', '', 'subtext');
      this.addEventHandlers(props);
    }
  }


  /******************************************************************************
   *
   * The below function will is used to list any options that already exist for
   * the question, it will find their position in the options array and use this
   * as the options ID, this means that adding more later on can be simplified by
   * using this method, making detection, addition and removal much easier.
   *
   * 1) Create a group box for all the options (for easier removal when switching)
   * 2) Cycle through the props.options array of existing options
   * 3) Find the array index, set that as the options ID and append it to the group
   *
   ******************************************************************************/

  optionsGenerate(props) {
    this.optionsGroup = html('div', 'options-' + props.qid, this.el, 'option_group');

    props.options.forEach(options => {
      const inputIndex = props.options.findIndex(option => option === options);
      const option = html('div', 'options-' + props.qid + '-option-' + inputIndex, this.optionsGroup, 'selector-toolbar');
      renderText(option, options, 'p', '', 'option_text');
      removeOptionEventListeners(props.qid, inputIndex, $('optionInput-' + props.qid).value);
    });
  }


  /******************************************************************************
   *
   * The below function will attach event listeners to the inputs so we can modify
   * the data for saving the questionnaire state
   *
   * 1) Wait until the enter key has been pressed
   * 2) Run the addOption function in the Edit index.js (Add the option to props.options)
   * 2A) IF the addOption returns true (Value isn't a duplicate) proceed, else, stop
   * 3) Search through the updated props.options, find the index of the new value
   * 4) Create an element, give it the ID of the index found above
   * 5) Render the text value onto the element
   * 6) Clear the input ready for the next value
   *
   ******************************************************************************/

  addEventHandlers(props) {
    this.optionInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (addOption($('optionInput-' + props.qid).value, props.qid) === true) {
          const inputIndex = props.options.findIndex(option => option === $('optionInput-' + props.qid).value);
          const newOption = html('p', 'options-' + props.qid + '-option-' + inputIndex, $('options-' + props.qid), 'selector-toolbar');
          renderText(newOption, $('optionInput-' + props.qid).value, 'p', '', 'option_text');
          removeOptionEventListeners(props.qid, inputIndex, $('optionInput-' + props.qid).value);
          $('optionInput-' + props.qid).value = '';
        }
      }
    });
  }
}
