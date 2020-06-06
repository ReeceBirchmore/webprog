'use strict';

// Created on 07/02/2020
//
// This module is responsible for the cold-start operation of the
// system. This operation should be run anually to create all of
// the new boards

// ////////////////////////////////////////////////////////////// Create The Database


const Postgres = require('pg').Client;

// This can also be a connection string
// (in which case the database part is ignored and replaced with postgres)

const sql2 = new Postgres({
  user: 'up850149',
  host: 'localhost',
  database: 'template1',
  password: 'MadMan123',
  port: 5432,
});

sql2.connect();

const sql = new Postgres({
  user: 'ayy',
  host: 'localhost',
  database: 'quiz2',
  password: 'root',
  port: 5432,
});


sql2.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});

sql2.query('DROP DATABASE IF EXISTS quiz2;')
  .then(data => {
    console.log('successfully dropped');
    buildDB();
  })
  .catch(error => {
    console.log(error);
  });

function buildDB() {
  sql2.query('CREATE DATABASE quiz2;')
    .then(data => {
      console.log('successfully created');
      sql2.end();
      newConnection();
    })
    .catch(error => {
      console.log(error);
    });
}

function newConnection() {
  sql.connect();
  quizzesTable();
}


function quizzesTable() {
  console.log('HELLO');
  sql.query('CREATE TABLE IF NOT EXISTS Quizzes (id SERIAL PRIMARY KEY, title  text, allowback BOOLEAN, quizid TEXT); CREATE TABLE IF NOT EXISTS Questions (id SERIAL PRIMARY KEY, question  TEXT, quesnumber INT, quizid TEXT, input TEXT, options TEXT, req BOOLEAN); CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, answers  TEXT, quizid TEXT);')
    .then(data => {
      populateDummyQuizData();
    })
    .catch(error => {
      console.log(error);
    });
}

function populateDummyQuizData() {
  sql.query("INSERT INTO Quizzes (title, quizid, allowback) VALUES('No Back Button Example', '26JBU', false); INSERT INTO Quizzes (title, quizid, allowback) VALUES('Allowed Back Button Example', '27JBU', true);")
    .then(data => {
      populateDummyQuestionData();
    })
    .catch(error => {
      console.log(error);
    });
}

function populateDummyQuestionData() {
  sql.query("INSERT INTO Questions (question, quizid, input) VALUES('Is lybin fit?', '26JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '26JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '26JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '26JBU', 'text');INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '26JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?','26JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is lybin fit?', '27JBU', 'text'); INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '27JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '27JBU', 'text');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '27JBU', 'text');INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '27JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?','27JBU', 'text');")
    .then(data => {
      console.log("COMPLETED");
    })
    .catch(error => {
      console.log(error);
    });
}














function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function listAllQuizzes() {
  try {
    const q = 'SELECT * FROM quizzes;';
    const result = await sql.query(q);
    return result.rows;
  } catch (error) {
    throw error;
  }
}


async function getQuizDetails(id) {
  try {
    const q = 'SELECT * FROM quizzes WHERE quizid = $1;';
    const result = await sql.query(q, [id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function listQuestions(quizid) {
  console.log(quizid);
  const q = 'SELECT * FROM questions WHERE quizid = $1 ORDER BY id ASC;';
  const result = await sql.query(q, [quizid]);
  console.log(result.rows, "TEST");
  return result.rows;
}


async function quizSubmission(data, quizid) {
  console.log(data);
  const quizdata = JSON.stringify(data);
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [quizdata, quizid]);
  return result.rows;
}


async function quizUpload(data) {
  const title = data.name;
  const questionsArr = data.questions; // valid end datas, .id, .text, .type, .options(ARRAY)
  // Step 1, run the ID Generator
  const uid = makeid(5);
  // Step 2, create the quiz entry in the quizzes table
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title, uid]);
  // Step 3, insert the questions into the database
  questionsArr.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    const questionResult = await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function addAQuestion(quizid) {
  const uid = JSON.parse(quizid).id;
  console.log(uid);
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
    // const title = question.title;
    console.log(id);
    // Step 1. Update the questions type
    const typeq = 'UPDATE Questions SET input = $1 WHERE id = $2';
    const typeResult = await sql.query(typeq, [type, id]);
    // Update the Array of options
    const optionq = 'UPDATE Questions SET options = $1 WHERE id = $2';
    const optionResult = await sql.query(optionq, [option, id]);
  });
  return true;
}


async function deleteAQuiz(uid) {
  console.log(uid, 'PRINT');
  const quiz = 'DELETE from Quizzes where quizid = $1;';
  const result = await sql.query(quiz, [uid]);
  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  const questionresult = await sql.query(question, [uid]);
  return true;
}


async function deleteAQuestion(uid) {
  console.log(uid, 'DELETED');
  const quiz = 'DELETE from Questions where id = $1;';
  const result = await sql.query(quiz, [uid]);
  return true;
}


async function generateNewQuiz(data) {
  const uid = makeid(5);
  const title = JSON.parse(data);
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title.value, uid]);
  return uid;
}


async function getAnswerData(quizid) {
  console.log(quizid, 'PASSED QUIZ ID');
  const q = 'SELECT * FROM answers WHERE quizid =  $1;';
  const result = await sql.query(q, [quizid]);
  console.log(result.rows, 'RESULTS');
  const responses = [];
  result.rows.forEach(question => {
    responses.push(JSON.parse(question.answers));
    console.log('QUESTIONS', JSON.parse(question.answers));
  });
  console.log(responses, 'RESPONSES BIT');
  return responses;
}


module.exports = {
  getQuizDetails,
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
