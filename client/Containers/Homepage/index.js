'use strict'
import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import * as Render from '/Javascript/render.js';
import Input from '/Components/Input/input.js';


export function index() {
    const newCard = new Card({id:"test2"});
    Render.render(newCard, Render.$('root'));
    const input = new Input({id:'1', type:'single-select'});
    Render.render(input, Render.$('root'));
    const newBtn = new Button({id: "test1", name: "Next"});
}