'use strict'
import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import * as Render from '/Javascript/render.js';
import Input from '/Components/Input/input.js';
import * as FX from '../../Javascript/fx.js';

import Screen from '../../Components/Screen/screen.js';


export function index() {


    



    






    Render.createToast("Welcome to the admin page", FX.toastClear, "Close")
    const newCard = new Card({id:"test2"});
    Render.render(newCard, Render.$('root'));
    const input = new Input({id:'1', type:'single-select'});
    Render.render(input, Render.$('root'));
    const newBtn = new Button({id: "test1", name: "Next"});
}