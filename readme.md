WebProg - UP850149



Contents:

1. Commonly used shorthand functions explained
1. Components explained
2. Containers explained
3. Features
4. Accessibility Considerations
6. Design Choices and Data Handling Decisions












# Shorthand Functions

In this coursework you will find an awful lot of shortend functions that somewhat resemble jQuery or look outright confusing, writing the same long line to create an element or render an element can be tiring, so having a function to throw in two elements to render (with special properties for extra control) is more useful and saves on several lines of code.

Writing short isn't always better, so hopefully the explanations of the functions in this section help you understand the flow of my code.

<br/>

###  $('text');

This is a shorthand *document.querySelector()* function, it will return the element found by typing the ID of an element you wish to find. This can be integrated into single code lines where space may be tight in order to keep to standard.

The full function:

```
function $(id) {
    return document.querySelector("#" + id);
}
```

Example of use:
```
console.log($('card'))
```
In the above demo, the first element with the ID of card will be returned and displayed within the console.

<br/>
<br/>

### html('tag', 'id', 'renderElement', 'class');

This is a shorthand method of creating an element to render onto the page. It will create the tag entered, apply any classes, give the newly made element the entered ID and, if entered, render the element onto the renderElement portion.

The full function:

```
function html(tag, id, renderPoint, css) {
    let el = document.createElement(tag);
        if(id) el.id = id;
        if(css) el.classList.add(css);
        if(renderPoint) renderPoint.append(el);
        return el;
}

```

Example of use:

```
 let card = html('div', 'card-1', '', 'card');
```
In the above demo, we created a div element, gave it an ID, gave it no render point and gave it the css style 'card'. 
The returned element will not be rendered directly onto the page or any other element, as such we can choose to render it at any point later on by calling the id with $('id') or with the variable name card (provided it is in the same scope).



<br/>
<br/>

### renderText('element', 'text', 'tag');

This is a shorthand method of creating a text node to apply to an element. It will create an element based upon the tag entered in 'tag' (if no tag, it will default to p) then generate text based upon the text entererd within the 'text' portion and attach as appropriate. Once the text is created it will render the text onto the element specified in 'element'.

The full function:

```
function renderText(el, propText, tag) {
    let textTag = tag ? tag : "p"; 
    const text = document.createElement(textTag);
    const textContent = document.createTextNode(propText);
        text.appendChild(textContent);
        el.appendChild(text);
    return text;
}
```

>This function must be passed an element to attach itself to else it will not attach on the page. Page generation will not suffer from this, however the component will not appear if a valid, rendered component is not used.

Example of use:

```
let card = new Card({id: 'card-id'});
renderText($('card-id'), "This is a demo", "h2");
```
In the demo above, $('card-id') is used to located the card, however, as the components are generated within the same scope, 'card' can be used to refer to the card HTML element.

<br/>
<br/>
<br/>



<li>render('element', 'renderPoint');

This is a shorthand method of appending elements

The full function:

```
function render(el, domNode) {
    domNode.appendChild(el);
    return;
}
```

>This function must be passed an element to attach itself to else it will not attach on the page. Page generation will not suffer from this, however the component will not appear if a valid, rendered component is not used.

Example of use:

```
render(input, card)
```
In the demo above, the input will be rendered onto the card element.


<br/>
<br/>
<br/>

# Components

All components are generated with the idea of flexibility, longevity and maintainability.
Each element will take a predefined prop set, which will be explained under each component. When the main JS files call upon these new objects, it can choose to either send across specific requests to have the component generate differently, possess different types, methods or content.

Any new features that the future developers would wish to add on can be done via these prop sets, including any extra information to pass through and generate on the component file.

## Button

<br/>
<br/>

## Card  
The card is a generic component used throughout the site, with special options to determine the type, structure and styling of the card.
By default, the card will have the 'card' and 'elevated' css styles applied when generated.

The card is called upon by writing:
```
new Card();
```
And can be modified further by including the following:
- <b>id: 'id'</b> -  this will attach an ID to the card
- <b>type:  'create, edit, quiz' </b> - selecting one of these three options will determine the overall structure of the card.
- <b> attachElement: 'element' </b> - by default, the card renders to the root of the page. Specifiyng a a position to render to here will override that.
- <b> class: 'className' </b> - by default, the class of the card will be 'card', if the app needs to display a modified card it can pass through a new css class to override the card style.


<br/>
<br/>

## Divider

The divider is the element that allows for division of content on an element. 

It is called upon by writing:
```
new Divider('renderElement, 'text');
```
The renderElement is the point in which the element will attach itself, the text element is the text you wish to have displayed in the middle. 

>This element must have an element to attach itself to else it will not attach on the page. Page generation will not suffer from this, however the component will not appear if a valid, rendered component is not used.


<br/>
<br/>

## Graph

The graph is a component used heavily in the responses view page for multiple optioned questions.

It is called upon by writing:

```
new Graph({renderElement, width, text})
```

<b> renderElement </b> - Refers to the element of which the graph will be situated on, typically this will be the base given somewhere in the code. Due to issues pairing the two, the base and graph have been seperated.

<b> width </b> - Refers to the width of the bar (The maths will be required - To find percentage of A in B, the value is ((Value A / Value B) * 100) 

<b> text </b> - Refers to any text being used by the graph, in the case of my responses page it was used to display the % number alongside the bar.

>This element must have an element to attach itself to else it will not attach on the page. Page generation will not suffer from this, however the component will not appear if a valid, rendered component is not used.


<br/>
<br/>

## Input

<br/>
<br/>


## Nav

The navigation bar is a component that builds itself onto the screen with each page generation. This is to keep the content on the nav updated and dynamic, I would have preffered keeping the nav as its own container to handle such big changes, but a lack of time has prevented this.

It is called upon by writing:

```
new Nav({id, title});
```

The navigation bar will by default render to $('root'), this cannot be changed as the navbar is a fixed point that must not move in order to keep consistency.
The ID and Title are two optional tags, but recomended for manipulation. Title will take a string and display it on the navbar. This can be used to display the question number, page title, quiz title etc.

The nav also offers an optional tag to display icons. These icons are predetermined by the Icon generation component:
```
new Nav({id: 'nav', 'Example Questionnaire', icons: ['clear', 'info'], event:['click', 'scroll']});
```
The nav bar calls upon the Icon component as well as the eventHandler function, therefore when generating the nav it is important to use the following tags:

icons: ['clear', 'return'] - The icons tag will tell the Icon component which icons to render in to view. The icon MUST exist in the Assets folder (and a class must exist to further position the icon within the CSS) in order for it to be visible, else it will not render onto the page.

event: ['click', 'scroll'] - The event is, by default, click. If the buttons are only going to be click interactive, this tag is entirely optional and can be excluded from the code.

action: [functionName(), functionName()] - This is a requirement in order for the icons to properly function, the function names can be placed here (They may need to be imported within the eventhandlers.js file in order to correctly fire.)
<br/>
<br/>

## Progress

Similar to the graph component, the progress component is used only once on the quiz view page. 

It is called upon by writing:

```
new Progress({id});    
```

The element itself requires no work beyond including an ID, due to changing data being required the management of the width is handled by an external function, for example:

```
function progress(val) {
    let prog = $('progressSpan');
    prog.style.width = (val / (quizLength - 1)) * 100 + "%";
}
```

Where *val* is the number being passed through (such as the current question number the user is on) and where quizLength - 1 would be the length of the quiz.



<br/>
<br/>

## Screen

Each screen is generated for each container. The screen is simple and does not have any required building tags

It is called upon by writing:

```
new Screen({id, class});
```

Both tags on the screen are optional, yet recommended. The screen will render to the root of the document.



<br/>
<br/>

## Snackbar

The snackbar is a handy, small and informative message popup that display information relevant to the user at any given prompt. (For example - uploading a quiz, saving a quiz, succesful login, error response from database, undo action)

It is called upon by writing:

```
createToast('text', 'action', 'action text');
```

The function simplifies the deployment of the snackbar, it takes 3 inputs (with the text being the only required value for any real world usage)

<b> text </b> - The body of the snackbar

<b> action </b> - The action you wish to occur if the user presses the action button, by default this will dismiss the snackbar.

<b> action text </b> - The text given to the action bar, by default this is "CLOSE"

<br/>
<br/>

## Toggle

<br/>
<br/>



# Containers

- Administrator Page
- Quiz Display Page
- Responses Page
- Quiz Editor Page

# Features

- Sign in with Google //Not complete
- Card Stacked layout
- Switch between Stacked Card and Linear layout on the fly //Not complete
- Dynamic Snackbars for errors and notifications 
- Dynamic Themeing of content //Not complete
- Single Page Layout with Local Routing


- Quiz Features:
    - Review Answers before submitting
    - Undo submission
    - Download CSV Format answers

- Edit Quiz Page:
    - Restrict inputs (Min/Max amount for Number, Max/Min length for Text)
    - Directional Quizzes (3D Quiz)
    - Allow Hiding the previous/restart button
    - Timed Quizzes
    - Force Required Questions
    - Undo edit/Revert back

- Response Page Features:
    - Average completion time of quizzes
    - Number of responses
    - Bar charts to show % of checkbox/radio responses
    - Download CSV formatted responses
    
- Admin Panel Features:
    - Quiz quick link generation
    - Upload a quiz JSON (Following the provided structure)
    - Generate a quiz from scratch
    - Edit previously uploaded/generated quizzes
    - Delete quizzes
    - Undo deletion
    - Undo upload

# Accessibility Considerations

The application currently supports the following:
- Reduced Motion (System Setting) - Disables any and all animations
- Dark Mode (System Setting) - Self explanatory


<br/>
<br/>

# Design Choices and Data Handling Decisions

The application attempts to mimic the ideals of components handling their own states and data, with the main external JS files giving them updates. Most components are able to render on their own without any external inputs or tags, however some do require specific tags in order to render properly and act appropriatly. This choice in deciding which elements are able to render themselves was made to simplify the process, allowing granular control over where an element should be placed on the page, as well as preventing rogue elements from rendering should an element it wants to default to no longer exist.

For example, the Inputs folder contains the input.js file, all inputs and input management is controlled within this file. Any time we wish to call upon an Input to be created, we can simply type:

```
new Input({})
```
This will generate an input, we have not specified any extra tags for the input yet, so it will create a textbox by default with no constraints, ID or values. It will not render anything to the page as we have not allowed it to do so yet.

In order to create an advanced Input, we can add tags to the object to pass into the class.

```
new Input({id: 'input-1', type: 'multi-select', options: 'option 1', name: 'input-1', renderPoint: $('card')});
```

This is a very long statement, but it breaks down quite nicely and shows the strengths of this application. It will create an input type of multiple choice, give it an option (text tag) to display the questions text, a name for the text tag to refer to, and finally, display the created input on the renderPoint, in our case, the card.


By seperating the components up from the main JS we are able to introduce granular controls to each input as it is generated and only call upon the components required at any specific point. It also means that modifications to the one component file will have an impact across the entire website, should a component structure change be required, it is only a few lines to fix compared to potentially hundreds.