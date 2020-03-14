'use strict'



//Shorthand display function, to be moved!
function $(id) {
    return document.querySelector("#" + id);
}
const body = $("root");



/****************************************************************
 * 
 *  The process for rendering content to the page will follow
 *  a react style methodlogy of producing stateless/stateful
 *  content that will update/mutate the children only instead
 *  of the entire node tree, increasing performance and
 *  efficiency
 * 
 *
 ***************************************************************/

function render(el, domNode) {
    //find domNode later
    domNode.appendChild(el);
}






/****************************************************************
 * 
 *  The process for applying CSS styles to elements will follow
 *  a basic react approach, allowing inline styles to be set via
 *  the class page for each component, with modification via JS
 *
 ***************************************************************/

function useStyles(object) {
    const styleString = (
        Object.entries(object).reduce((styleString, [propName, propValue]) => {
            //console.log(`${styleString}${propName}:${propValue};`);
            return `${styleString}${propName}:${propValue};`;
        }, '')
  );
  return styleString;
}





function renderText(el, propText) {
    const text = document.createTextNode(propText);
        el.appendChild(text);
    return text;
}





function removeRender(el) {
    $('root').removeChild(el);
    return;
}




export { render, $, useStyles, renderText, removeRender }
