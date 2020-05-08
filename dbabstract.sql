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


INSERT INTO Quizzes (title) VALUES ("Pompey Reality Test");



INSERT INTO Questions (question, quizid) VALUES ("Are you gay", 1)



question = text
quizid = INTEGER
options = [];
input = text

will need:
min
max
optional extras



INSERT INTO Questions (question) VALUES('Is lybin fit?');

INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '5', 'text');
INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '5', 'text');
INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '5', 'text');
INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '5', '{That damned smile, his amazing body, his voice}', 'text');
INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '5', 'range');




INSERT INTO Questions (question, quizid, options, input) VALUES('Is Lybin honestly the fittest character in the world?, 5, [] , text');