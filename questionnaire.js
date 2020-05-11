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




async function listAllQuizzes() {
  const q = 'SELECT * FROM quizzes;';
  const result = await sql.query(q);
  return result.rows;
}



async function getQuizDetails(id) {
  const q = 'SELECT * FROM quizzes WHERE id = $1;';
  const result = await sql.query(q, [id]);
  return result.rows;
}






async function listQuestions(quizid) {
  console.log("questions");
  const q = 'SELECT * FROM questions WHERE quizid = $1;';
  const result = await sql.query(q, [quizid]);
  return result.rows;
}



async function quizSubmission(data, quizid) {
  console.log(data, quizid, "DATA");
  let test = JSON.stringify(data);
  console.log(test, "STRINGIFIED");
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [test, quizid]);
  console.log(result.rows, "Rows")
  return result.rows;
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
  console.log(responses);

  return responses;
}


module.exports = {
  getQuizDetails,
  listQuestions,
  quizSubmission,
  getAnswerData,
  listAllQuizzes
};