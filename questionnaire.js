'use strict';


// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants


const Postgres = require('pg').Client;
const opn = require('opn');

// //#endregion
// ////////////////////////////////////////////////////////////// Create The Database
// ////#region This module is responsible for first time run

const sql2 = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'template1',
  password: 'root',
  // password: 'secret123',
  port: 5432,
});

sql2.connect();

sql2.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});

console.log('-----------------------------------------------------------------');
console.log('Author: Reece Birchmore');
console.log('Project: Questionnaire Application');
console.log('Module: Web Programming');
console.log('Lecturers: Rich, Matt, Jacek');
console.warn('THE DATABASE IS BEING REBUILT FOR FIRST TIME USEAGE');
console.warn('PLEASE WAIT UNTIL THE REBUILD HAS FINALISED BEFORE MOVING ON');
console.log('-----------------------------------------------------------------');

sql2.query('DROP DATABASE IF EXISTS quiz2;')
  .then(data => {
    console.log('Old Database Dropped');
    buildDB();
  })
  .catch(error => {
    console.log(error);
  });

function buildDB() {
  sql2.query('CREATE DATABASE quiz2;')
    .then(data => {
      console.log('New Database Created');
      sql2.end();
      newConnection();
    })
    .catch(error => {
      console.log(error);
    });
}


// //#endregion
// ////////////////////////////////////////////////////////////// Populate The Database
// ////#region This module will populate the newly created database

const sql = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'quiz2',
  password: 'root',
  // password: 'secret123',
  port: 5432,
});

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
      console.log("Default Quizzes Populated")
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
      console.log('Questionnaire Application Ready, opening admin console...');
      opn('http://localhost:8080/#/admin');
    })
    .catch(error => {
      console.log(error);
    });
}

// #endregion
// ////////////////////////////////////////////////////////////// QUESTIONNAIRE ID GENERATION
// #region Generate Quiz ID

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


// #endregion
// ////////////////////////////////////////////////////////////// LIST QUESTIONNAIRES
// #region Fetch Quiz Details

async function listAllQuizzes() {
  const q = 'SELECT * FROM quizzes;';
  const result = await sql.query(q);
  return result.rows;
}


async function getQuiz(id) {
  const q = 'SELECT * FROM quizzes WHERE quizid = $1;';
  const result = await sql.query(q, [id]);
  return result.rows;
}


// #endregion
// ////////////////////////////////////////////////////////////// LIST QUESTIONS
// #region Questions Gathering

async function listQuestions(quizid) {
  const q = 'SELECT * FROM questions WHERE quizid = $1 ORDER BY id ASC;';
  const result = await sql.query(q, [quizid]);
  return result.rows;
}

// #endregion
// ////////////////////////////////////////////////////////////// SUBMIT QUESTIONNAIRE
// #region Submit Questionnaire

async function quizSubmission(data, quizid) {
  console.table(data);
  const quizdata = JSON.stringify(data);
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [quizdata, quizid]);
  return result.rows;
}


// #endregion
// ////////////////////////////////////////////////////////////// QUESTIONNAIRE DELETE
// #region Delete A Questionnaire


async function deleteAQuiz(uid) {
  console.log(uid, 'PRINT');
  const quiz = 'DELETE from Quizzes where quizid = $1;';
  const result = await sql.query(quiz, [uid]);
  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  const questionresult = await sql.query(question, [uid]);
  return true;
}

// #endregion
// ////////////////////////////////////////////////////////////// QUESTIONNAIRE CREATE
// #region Upload/Generate A Questionnaire

async function quizUpload(data) {
  // Step 1, run the ID Generator
  const uid = makeid(5);
  // Step 2, create the quiz entry in the quizzes table
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  await sql.query(quizq, [data.name, uid]);
  // Step 3, insert the questions into the database
  data.questions.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function generateNewQuiz(data) {
  const uid = makeid(5);
  const title = JSON.parse(data);
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  await sql.query(quizq, [title.value, uid]);
  return uid;
}


// #endregion
// ////////////////////////////////////////////////////////////// QUESTIONNAIRE EDITING
// #region Edit Questionnaire

async function addAQuestion(quizid) {
  const uid = JSON.parse(quizid).id;
  const q = 'INSERT INTO Questions (quizid) VALUES($1) ';
  const result = await sql.query(q, [uid]);
  console.log(result.rows);
  return result.rows;
}


async function addAOption(optiondata) {
  const data = JSON.parse(optiondata).arr;
  data.forEach(async question => {
    const option = question.option;
    const id = question.id;
    const type = question.type;
    // Step 1. Update the questions type
    const typeq = 'UPDATE Questions SET input = $1 WHERE id = $2';
    await sql.query(typeq, [type, id]);
    // Update the Array of options
    const optionq = 'UPDATE Questions SET options = $1 WHERE id = $2';
    await sql.query(optionq, [option, id]);
  });
  return true;
}

async function deleteAQuestion(uid) {
  const quiz = 'DELETE from Questions where id = $1;';
  await sql.query(quiz, [uid]);
  return true;
}


// #endregion
// ////////////////////////////////////////////////////////////// QUESTIONNAIRE RESPONSES
// #region Questionnaire Responses

async function getAnswerData(quizid) {
  const q = 'SELECT * FROM Answers WHERE quizid =  $1;';
  const result = await sql.query(q, [quizid]);
  const responses = [];
  result.rows.forEach(question => {
    responses.push(JSON.parse(question.answers));
  });
  return responses;
}

// #endregion
// ////////////////////////////////////////////////////////////// EXPORTS
// #region Exports

module.exports = {
  getQuiz,
  listQuestions,
  quizSubmission,
  getAnswerData,
  listAllQuizzes,
  quizUpload,
  deleteAQuiz,
  generateNewQuiz,
  deleteAQuestion,
  addAQuestion,
  addAOption,
};
