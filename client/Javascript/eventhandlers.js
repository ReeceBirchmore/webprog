'use strict'

/********************************************************************************************
 *
 *  @property {HTMLElement} el The HTML Reference to the element, required
 *  @property {String}      event The type of event ('click'), optional, defaults to click if not included or left as ''
 *  @property {Function}    action The function to run when the event is fired, stopPropogation if left empty
 *  @property {Boolean}     bubbleHandle Bubble Handling, optional, false by default.
 *
 */

export default function eventHandler(el, event, action, bubbleHandle) {
  el.addEventListener((event === undefined || event === '') ? 'click' : event, function (event) {
    if (action === '' || action === null) {
      event.stopPropagation();
    } else {
      action();
    }
  }, (bubbleHandle === undefined || bubbleHandle === '') ? false : bubbleHandle);
}
