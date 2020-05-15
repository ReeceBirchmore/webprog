'use strict'

import Toast from '/Components/Toast/toast.js';


//Shorthand display function, to be moved!
function $(id) {
    return document.querySelector("#" + id);
}

const body = $("root");


// #endregion
// ////////////////////////////////////////////////////////////// SET RENDER STATE
// #region State Handling

// function setState(type, props) {
//     console.log(type, props);


// } 




// #endregion
// ////////////////////////////////////////////////////////////// RENDER ELEMENTS
// #region Element Rendering

 /******************************
 * 
 * @param {HTMLElement} el 
 * @param {HTMLElement} domNode 
 * 
 ******************************/

function render(el, domNode) {

    domNode.appendChild(el);
    return;
}



// #endregion
// ////////////////////////////////////////////////////////////// STYLE ELEMENTS
// #region Use Styling

 /************************
 * 
 * @param {Object} object 
 * 
 ************************/

function useStyles(object) {
    const styleString = (
        Object.entries(object).reduce((styleString, [propName, propValue]) => {
            //console.log(`${styleString}${propName}:${propValue};`);
            return `${styleString}${propName}:${propValue};`;
        }, '')
  );
  return styleString;
}




// #endregion
// ////////////////////////////////////////////////////////////// TEXT ELEMENTS
// #region Text Rendering

 /**************************
 * 
 * @param {HTMLElement} el 
 * @param {String} propText 
 * 
 **************************/

function renderText(el, propText, tag) {
    let textTag = tag ? tag : "p"; 
    const text = document.createElement(textTag);
    const textContent = document.createTextNode(propText);
        text.appendChild(textContent);
        el.appendChild(text);
    return text;
}



// #endregion
// ////////////////////////////////////////////////////////////// REMOVE RENDERED ELEMENT
// #region Remove Rendered Element

 /*************************
 * 
 * @param {HTMLElement} el
 *  
 *************************/

function removeRender(el) {
    $('root').removeChild(el);
    return;
}



// #endregion
// ////////////////////////////////////////////////////////////// CREATE TOAST POPUP ELEMENT
// #region Create Toast Function


function createToast(message, action, actionText, params) {
    let toast = new Toast({id:'toast', text: message, action: action, actionText: actionText, param: params})
    render(toast, $('root'));
}



// #endregion
// ////////////////////////////////////////////////////////////// STATE TOGGLING
// #region Toggle States


//Toggle Visibility
function toggleState(element) {
    
}

//Toggle Expansion

function toggleExpand(element) {

}




// #endregion
// ////////////////////////////////////////////////////////////// EXPORTS
// #region Exports




export { render, $, useStyles, renderText, removeRender, createToast,  }
