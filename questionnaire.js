'use strict';
const config = require('./config');

const Postgres = require('pg').Client;


const sql = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'quiz',
  password: 'root',
  port: 5432,
});

sql.connect();

sql.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});





function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
  










async function listAllQuizzes() {
  const q = 'SELECT * FROM quizzes;';
  const result = await sql.query(q);
  return result.rows;
}



async function getQuizDetails(id) {
  const q = 'SELECT * FROM quizzes WHERE quizid = $1;';
  const result = await sql.query(q, [id]);
  return result.rows;
}


async function listQuestions(quizid) {
  const q = 'SELECT * FROM questions WHERE quizid = $1;';
  const result = await sql.query(q, [quizid]);
  return result.rows;
}



async function quizSubmission(data, quizid) {
  let quizdata = JSON.stringify(data);
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [quizdata, quizid]);
  return result.rows;
}


async function quizUpload(data) {
  let title = data.name;
  let questionsArr = data.questions; //valid end datas, .id, .text, .type, .options(ARRAY)
  //Step 1, run the ID Generator
  let uid = makeid(5);
  //Step 2, create the quiz entry in the quizzes table
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title, uid]);
  //Step 3, insert the questions into the database
  questionsArr.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    const questionResult = await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function addAQuestion(quizid) {
  let uid = JSON.parse(quizid).id;
  const q = 'INSERT INTO Questions (quizid) VALUES($1) ';
  const result = await sql.query(q, [uid]);
  return result.rows;
}


async function deleteAQuiz(uid) {
  console.log(uid, "PRINT");
  const quiz = 'DELETE from Quizzes where quizid = $1;';
  const result = await sql.query(quiz, [uid]);
  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  const questionresult =  await sql.query(question, [uid]);
  return true;
}


async function deleteAQuestion(uid) {
  console.log(uid, "DELETED");
  const quiz = 'DELETE from Questions where id = $1;';
  const result = await sql.query(quiz, [uid]);
  return true;
}



async function generateNewQuiz(data) {
  let uid = makeid(5);
  let title = JSON.parse(data);
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title.value, uid]);
  return uid;
}



async function getAnswerData(quizid) {
  console.log(quizid);
  const q = 'SELECT * FROM answers WHERE quizid =  $1;';
  const result = await sql.query(q, [quizid]);
  console.log(result.rows, "RESULTS")
  const responses = new Array;
  result.rows.forEach(question => {
    responses.push(JSON.parse(question.answers))
    console.log("QUESTIONS", JSON.parse(question.answers));
  })
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
  addAQuestion
};