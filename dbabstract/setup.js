'use strict';


// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants


const Postgres = require('pg').Client;
const setupConfig = require('./config1.json');
const dbConfig = require('./config2.json');


// //#endregion
// ////////////////////////////////////////////////////////////// Create The Database
// ////#region This module is responsible for first time run

const dbbuild = new Postgres(setupConfig);
const sql = new Postgres(dbConfig);


// //#endregion
// ////////////////////////////////////////////////////////////// Populate The Database
// ////#region This module is responsible for first time run


dbbuild.connect();

dbbuild.on('error', (err) => {
  console.error('SQL Fail', err);
  dbbuild.end();
});

console.log('-----------------------------------------------------------------');
console.log('Project: Questionnaire Application');
console.log('Module: Web Programming');
console.log('Lecturers: Rich, Matt, Jacek');
console.warn('THE DATABASE IS BEING REBUILT FOR FIRST TIME USEAGE');
console.warn('PLEASE WAIT UNTIL THE REBUILD HAS FINALISED BEFORE MOVING ON');
console.log('-----------------------------------------------------------------');

dbbuild.query('DROP DATABASE IF EXISTS quiz;')
  .then(data => {
    console.log('Old Database Dropped');
    buildDB();
  })
  .catch(error => {
    console.log(error);
  });

function buildDB() {
  dbbuild.query('CREATE DATABASE quiz;')
    .then(data => {
      console.log('New Database Created');
      dbbuild.end();
      newConnection();
    })
    .catch(error => {
      console.log(error);
    });
}


// //#endregion
// ////////////////////////////////////////////////////////////// Populate The Database
// ////#region This module will populate the newly created database

function newConnection() {
  sql.connect();
  quizzesTable();
}

function quizzesTable() {
  sql.query('CREATE TABLE IF NOT EXISTS Quizzes (id SERIAL PRIMARY KEY, title  text, allowback BOOLEAN, quizid TEXT); CREATE TABLE IF NOT EXISTS Questions (id SERIAL PRIMARY KEY, question  TEXT, quesnumber INT, quizid TEXT, input TEXT, options TEXT [], req BOOLEAN); CREATE TABLE IF NOT EXISTS Answers (id SERIAL PRIMARY KEY, answers  TEXT, quizid TEXT);')
    .then(data => {
      console.log('Default Table Structure Created');
      populateDummyQuizData();
    })
    .catch(error => {
      console.log(error);
    });
}

function populateDummyQuizData() {
  sql.query("INSERT INTO Quizzes (title, quizid, allowback) VALUES('No Back Button Example', '26JBU', false); INSERT INTO Quizzes (title, quizid, allowback) VALUES('Allowed Back Button Example', '27JBU', true);")
    .then(data => {
      console.log('Default Quizzes Populated');
      populateDummyQuestionData();
    })
    .catch(error => {
      console.log(error);
    });
}

function populateDummyQuestionData() {
  sql.query("INSERT INTO Questions (question, quizid, input) VALUES('Is lybin fit?', '26JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '26JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '26JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '26JBU', 'text');INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '26JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?','26JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is lybin fit?', '27JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '27JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '27JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '27JBU', 'text');INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '27JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?','27JBU', 'text');")
    .then(data => {
      console.log('Default Questions Populated');
      console.log('Questionnaire Application Ready, please run NPM RUN START');
      sql.end();
    })
    .catch(error => {
      console.log(error);
    });
}
