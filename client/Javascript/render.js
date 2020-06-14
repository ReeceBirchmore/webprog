'use strict';

import Toast from '/Components/Toast/toast.js';


// #endregion
// ////////////////////////////////////////////////////////////// RENDER ELEMENTS
// #region Element Rendering

/******************************
 *
 * @param {String} id - The ID of the element you wish to find, does not need to include the #
 *
 ******************************/

function $(id) {
  return document.querySelector('#' + id);
}

// #endregion
// ////////////////////////////////////////////////////////////// RENDER ELEMENTS
// #region Element Rendering

/******************************
 *
 * @param {HTMLElement} el - Reference to the new node created (Can be a direct reference or via the $ shorthand function)
 * @param {HTMLElement} domNode - The element to attach the new node to
 *
 ******************************/

function render(el, domNode) {
  ((domNode === undefined) ? $('root') : domNode).appendChild(el);
}


// #endregion
// ////////////////////////////////////////////////////////////// TEXT ELEMENTS
// #region Text Rendering

/**************************
 *
 * @param {HTMLElement} el - Reference to the HTML Element in which the text will be placed upon
 * @param {String} propText - The text to generate
 * @param {String} tag - The type of tag (H1, H2, P etc) - If left as '' it will default to p
 * @param {String} id - The ID of the text, can be left blank but is not recommended
 * @param {String} CSS - Any specific CSS stylings of the text (one css style only)
 *
 **************************/

function renderText(el, propText, tag, id, css) {
  const textTag = tag || 'p';
  const text = document.createElement(textTag);
  text.id = id;
  const textContent = document.createTextNode(propText);
  text.appendChild(textContent);
  text.classList.add(css);
  el.appendChild(text);
  return text;
}


// #endregion
// ////////////////////////////////////////////////////////////// REMOVE RENDERED ELEMENT
// #region Remove Rendered Element

/*************************
 *
 * @param {HTMLElement} el - The element to remove from the root of the webpage.
 *
 *************************/

function remove(el) {
  $('root').removeChild(el);
}


// #endregion
// ////////////////////////////////////////////////////////////// CREATE TOAST POPUP ELEMENT
// #region Create Toast Function

/*********************************************************************
 *
 *  @property {String}   message - Text for the snackbar
 *  @property {Boolean}  error - True/False, determine snackbars colour, left blank = false.
 *
 */

function createToast(message, error) {
  const toast = new Toast({ id: 'toast', text: message, error: error });
}


// #endregion
// ////////////////////////////////////////////////////////////// ELEMENT CREATION
// #region Create Element

/*********************************************************************
 *
 *  @property {String}   tag - The tag type to use ('div')
 *  @property {String}   id - ID of the created item
 *  @property {HTMLElement} renderPoint - Reference to a HTML element to render the new item on
 *  @property {String}  css - CSS class to attach to the new item
 *
 */

function html(tag, id, renderPoint, css) {
  const el = document.createElement(tag);
  if (id !== '') el.id = id;
  if (css !== '') el.classList.add(css);
  if (renderPoint !== '' && renderPoint !== undefined) renderPoint.appendChild(el);
  return el;
}

// #endregion
// ////////////////////////////////////////////////////////////// Click or Touch Detail
// #region Detect Device Type


let pointer;

if ('ontouchstart' in document.documentElement) {
  pointer = 'Tap';
} else {
  pointer = 'Click';
}


// #endregion
// ////////////////////////////////////////////////////////////// Response Type Detail
// #region Detect Response Type

export function responseType(card, question) {
// Create the option type text to appear above the question
  let info;
  switch (question.input) {
    case 'number':
    case 'text':
      info = 'Enter your response';
      break;
    case 'single-select':
      info = 'Select one';
      break;
    case 'multi-select':
      info = 'Select one or more';
      break;
  }
  return renderText(card, info, 'p', 'type-info', 'subtext');
}


// #endregion
// ////////////////////////////////////////////////////////////// EXPORTS
// #region Exports


export { render, $, renderText, remove, createToast, html, pointer };
