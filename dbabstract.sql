DROP DATABASE IF EXISTS Quiz;


CREATE DATABASE Quiz;

CREATE TABLE IF NOT EXISTS Quizzes (
    id SERIAL PRIMARY KEY,
    title  text
);

CREATE TABLE IF NOT EXISTS Questions (
    id SERIAL PRIMARY KEY,
    question  text,
    quizid INTEGER REFERENCES Quizzes(id);
);

INSERT INTO Quizzes (title) VALUES ("Test Quiz Numbero one");

INSERT INTO Questions (question, quizid) VALUES ("Are you gay", 1)
