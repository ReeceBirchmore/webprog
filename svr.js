'use strict'


const express = require('express');
const app = express();

const router = express.Router();

const port = 8080;

app.use(express.static('client'));
app.use('/api', router);
app.use('*', express.static("client"));



//var msg = require('./homepage.js');

/*

const router = express.Router();
app.use(express.static('client'));

/*app.use('/api', router);
app.use('*', express.static('client'));

router.get('yeet', (req, res) => console.log("ERERERE"));
*/
app.listen(port)

