WebProg - UP850149



Contents:

1. How To Use
2. Known Issues
3. Shorthand Functions
4. Features
5. Accessibility Considerations
6. Design Choices and Data Handling Decisions
7. API Lanes
8. JSON Example



# How to use

This application was designed with mobile first in mind, but the layout is reminiscent of a scaled up mobile layout. 

I have not had the chance to test on a higher res display than a typical 1080p monitor, so a macbook may scale the website in an odd manner, preferably testing would be done in Chrome (Or FireFox) device emulator mode for the best result (Phones such as the iPhone 5 and Nexus 5 are too small, so a larger displayed phone is preferable)

THIS APPLICATION DOES NOT WORK ON SAFARI OR ANY SAFARI WRAPPED BROWSER


## Stage 1

Run "npm i" in the directory to install and update any packages included within the package.json file

## Stage 2

Open the project in the editor of choice, open the config.json file and modify the following:

- <b>User:</b> Enter a VALID username for your postgres installation, it must have administrative rights in order to create and modify the database.
- <b>Password:</b> The VALID password for the above account listed


Once you have entered this data, open terminal and CD to the file location, then type:

```
npm run setup
```

This should construct and populate a database named 'quiz', if the setup fails initially, it could be because the database already exists. Drop the database from the psql server and try again.

## Stage 3

Run "npm run start" to run the server. 

While using the application, it is best viewed in the chrome device emulator for mobile. The application scales to desktop, but looks best on mobile.

Once the server has built, navigate to the IP address given for the VM, the webpage will auto-redirect to the administrator console.

On the admin console you will see the list of pre-generated questionnaires. You can delete, share, edit/view responses, upload from a JSON or create a new quiz from scratch.



# Known Issues

The biggest issue I had was getting the application to run in Safari, I have no real way to test on the Safari browser, I thought it could have been some public declarations I had made within my classes, but having removed the ones I can see it still does not want to load. I would need access to a Mac with the latest edition of Safari to thoroughly test, as the library is shut I have no real method of testing. It works in all other major browsers.

Sometimes when first loading a quiz the buttons can lock up and be a bit unresponsive, this is an issue I cant easily replicate using the dev tools, in order to fix you just have to refresh the page.

Sometimes when loading a page by changing the URL hash, buttons may not appear at all - this is to do with the method of my router and a disagreement between my routers desires and the powers that be in the Chromium Dev Team, if the buttons do not appear, refresh the page.

When uploading a quiz, unless you follow a JSON that has the same structure as the one specified at the end of this README, it will throw an error at you. I'm calling this a design choice.


# Shorthand Functions

In this coursework you will find an awful lot of shortend functions that somewhat resemble jQuery or look outright confusing, writing the same long line to create an element or render an element can be tiring, so having a function to throw in two elements to render (with special properties for extra control) is more useful and saves on several lines of code.

Writing short isn't always better, so hopefully the explanations of the functions in this section help you understand the flow of my code.

<br/>

##  $('text');

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

## html('tag', 'id', 'renderElement', 'class');

This is a shorthand method of creating an element to render onto the page. It will create the tag entered, apply any classes, give the newly made element the entered ID and, if entered, render the element onto the renderElement portion.

The full function:

```
function html(tag, id, renderPoint, css) {
  const el = document.createElement(tag);
  if (id !== '') el.id = id;
  if (css !== '') el.classList.add(css);
  if (renderPoint !== '' && renderPoint !== undefined) renderPoint.appendChild(el);
  return el;
}
```

Example of use:

```
 let card = html('div', 'card-1', $('root'), 'card');
```
In the above demo, we created a div element, gave it an ID, gave it no render point and gave it the css style 'card'. 
The returned element will not be rendered directly onto the page or any other element, as such we can choose to render it at any point later on by calling the id with $('id') or with the variable name card (provided it is in the same scope).


<br/>


## renderText('element', 'text', 'tag');

This is a shorthand method of creating a text node to apply to an element. It will create an element based upon the tag entered in 'tag' (if no tag, it will default to p) then generate text based upon the text entererd within the 'text' portion and attach as appropriate. Once the text is created it will render the text onto the element specified in 'element'.

The full function:

```
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
```

>This function must be passed an element to attach itself to else it will not attach on the page. Page generation will not suffer from this, however the component will not appear if a valid, rendered component is not used.

Example of use:

```
let card = new Card({id: 'card-id'});
renderText($('card-id'), "This is a demo", "h2", 'demo-id', 'small-text-css');
```
In the demo above, $('card-id') is used to located the card, however, as the components are generated within the same scope, 'card' can be used to refer to the card HTML element.

<br/>


## render('element', 'renderPoint');

This is a shorthand method of appending elements

The full function:

```
function render(el, domNode) {
  ((domNode === undefined) ? $('root') : domNode).appendChild(el);
}
```

Example of use:

```
render(card)
```
In the demo above, the input will be rendered onto the root.


<br/>
<br/>
<br/>

# Containers

- Administrator Page
- Quiz Display Page
- Responses Page
- Quiz Editor Page

# Features

- Card Stacked layout
- Dynamic Snackbars for errors and notifications 
- Single Page Layout with Local Routing


- Quiz Features:
    - Review Answers before submitting
    - Card Stacked Design
    - Built In Error Validation
    - Download CSV Format answers

- Edit Quiz Page:
    - Restrict inputs (Min/Max amount for Number)
    - Allow Hiding the previous/restart button
    - Force Required Questions
    - Add new questions
    - Delete Questions (Questions will not delete until saved, to prevent accidental deletions)
    - Change question input types
    - Add and remove options (for multiple option types)
    - Restrict to one questionnaire response
    - Error Validation

- Response Page Features:
    - Number of responses
    - Bar charts to show % of checkbox/radio responses
    - Range Slider Average and Responses
    - Download CSV formatted responses
    
- Admin Panel Features:
    - View all quizzes in a list
    - Quiz quick link generation
    - Upload a quiz JSON (Following the provided structure)
    - Generate a quiz from scratch
    - Delete quizzes

# Accessibility Considerations

The application currently supports:
- Reduced Motion (System Setting) - Disables any and all animations

It currently partially supports:
- Dark Mode - Flips colours to dark


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
new Input({
  id: 'input-1', 
  type: 'multi-select', 
  options: ['option 1', 'option 2', 'option 2'], 
  name: 'input-1', 
  renderPoint: $('card')
  });
```

This is a very long statement, but it breaks down quite nicely and shows the strengths of this application. It will create an input type of multiple choice, give it an option (text tag) to display the questions text, a name for the text tag to refer to, and finally, display the created input on the renderPoint, in our case, the card.


By seperating the components up from the main JS we are able to introduce granular controls to each input as it is generated and only call upon the components required at any specific point. It also means that modifications to the one component file will have an impact across the entire website, should a component structure change be required, it is only a few lines to fix compared to potentially hundreds.



# API Lanes


The list of available APIS is as such:


## /questions/:id 

Gets the questions with a specified quizID


## /quizzes/:id

Gets a specific questionnaire with a specified quizID


## /quizzes

Gets a list of all the quizzes

## /answers/:id

Gets all answers with a specified quizID

## /create/question/:id

Gets a new question ID to generate and add a question in the editor



## /delete/quiz/:id

Deletes a quiz with a specified quizID

## /delete/questions/:id

Deletes a question with a specified questionID



## /quizzes/update/:id

Updates the questionnaire once saved with a specified quizID



## /create/quiz/

Creates a new quiz and returns the ID

## /submit/:id

Creates a new entry to the answers database with the specified quizID

## /upload

Creates a new entry to the questions/quizzes tables with a file upload




# JSON Example

In order to upload content, you have two choices:
 - Generate a questionnaire from scratch with the 'Generate' Button
 - Upload your own JSON file with the 'Upload' button
Both of these buttons can be accessed on the admin panel (./#/admin/)


There are 4 input types to choose from:
  - text
  - number
  - single-choice
  - multi-choice

  When uploading a JSON, it must follow the below structure or risk being rejected by the application.

  Once uploaded, you are able to open it within the editor and completely modify the questions, types, questionnaire settings and restrictions etc

```
export const quiz = [{
  "name": "Example Questionnaire",
  "questions": [
    {
      "id": "name",
      "text": "What is your name?",
      "type": "text"
    },
    {
      "id": "quest",
      "text": "What is your quest?",
      "type": "text"
    },
    {
      "id": "col",
      "text": "What is your favourite colour?",
      "type": "text"
    },
    {
      "id": "velo",
      "text": "What is the air-speed velocity of an unladen swallow?",
      "type": "number"
    },
    {
      "id": "lord",
      "text": "Which is the best lord?",
      "type": "single-select",
      "options": [
        "Lord of the Rings",
        "Lord of the Flies",
        "Lord of the Dance",
        "Lorde"
      ]
    },
    {
      "id": "langs",
      "text": "Which computer languages have you used?",
      "type": "multi-select",
      "options": [
        "JavaScript",
        "Java",
        "C",
        "Python",
        "Ook",
        "LISP"
      ]
    }
  ]
},
{
  "name": "Example Questionnaire 2",
  "questions": [
    {
      "id": "name",
      "text": "Is you a bitch?",
      "type": "text"
    },
    {
      "id": "quest",
      "text": "What is your quest?",
      "type": "text"
    },
    {
      "id": "col",
      "text": "What is your favourite colour?",
      "type": "text"
    },
    {
      "id": "velo",
      "text": "What is the air-speed velocity of an unladen swallow?",
      "type": "number"
    },
    {
      "id": "lord",
      "text": "Which is the best lord?",
      "type": "single-select",
      "options": [
        "Lord of the Rings",
        "Lord of the Flies",
        "Lord of the Dance",
        "Lorde"
      ]
    },
    {
      "id": "langs",
      "text": "Which computer languages have you used?",
      "type": "multi-select",
      "options": [
        "JavaScript",
        "Java",
        "C",
        "Python",
        "Ook",
        "LISP"
      ]
    }
  ]
}
]
```
