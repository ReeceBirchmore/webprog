


CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title  TEXT,
    quizid TEXT,
    allowback BOOLEAN,
    restrict BOOLEAN,
    enabled BOOLEAN
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question  TEXT,
    quizid TEXT,
    input TEXT,
    options TEXT [],
    min INT,
    max INT,
    required BOOLEAN
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    answers  TEXT,
    quizid TEXT
);


INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Hidden Back Button Demo', 'jf8OBN6779', false, false, true );
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Allowed Back Button Demo', '94jwbfsT6s', true, false, true );
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Disabled Questionnaire (enable in settings)', '43rtvb703g', true, false, false );
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Only One Attempt! (Restricted Demo)', 'fdsbfg4SDF', true, true, true );


INSERT INTO questions (question, quizid, input) VALUES('What is your name?', 'jf8OBN6779', 'text');
INSERT INTO questions (question, quizid, input, min, max) VALUES('How old are you?', 'jf8OBN6779', 'number', '30', '60');
INSERT INTO questions (question, quizid, input, required) VALUES('This is a required question, leave it blank and try to hit next!', 'jf8OBN6779', 'text', true);
INSERT INTO questions (question, quizid, options, input) VALUES('What is your experience using this app?', 'jf8OBN6779', '{Absolutely Amazing, Seen Better, God Awful}', 'single-select');
INSERT INTO questions (question, quizid, input, min, max) VALUES('What grade do you think this is worth?', 'jf8OBN6779', 'number', 70, 100);
INSERT INTO questions (question, quizid, input) VALUES('When do I get my results back?', 'jf8OBN6779', 'date');

INSERT INTO questions (question, quizid, input) VALUES('What is your name?', '94jwbfsT6s', 'text');
INSERT INTO questions (question, quizid, input, min, max) VALUES('How old are you?', '94jwbfsT6s', 'number', '30', '60');
INSERT INTO questions (question, quizid, input, required) VALUES('This is a required question, leave it blank and try to hit next!', '94jwbfsT6s', 'text', true);
INSERT INTO questions (question, quizid, options, input) VALUES('What is your experience using this app?', '94jwbfsT6s', '{Absolutely Amazing, Seen Better, God Awful}', 'single-select');
INSERT INTO questions (question, quizid, input, min, max) VALUES('What grade do you think this is worth?', '94jwbfsT6s', 'number', 70, 100);
INSERT INTO questions (question, quizid, input) VALUES('When do I get my results back?', '94jwbfsT6s', 'date');

INSERT INTO questions (question, quizid, input) VALUES('What is your name?', '43rtvb703g', 'text');
INSERT INTO questions (question, quizid, input, min, max) VALUES('How old are you?', '43rtvb703g', 'number', '30', '60');
INSERT INTO questions (question, quizid, input, required) VALUES('This is a required question, leave it blank and try to hit next!', '43rtvb703g', 'text', true);
INSERT INTO questions (question, quizid, options, input) VALUES('What is your experience using this app?', '43rtvb703g', '{Absolutely Amazing, Seen Better, God Awful}', 'single-select');
INSERT INTO questions (question, quizid, input, min, max) VALUES('What grade do you think this is worth?', '43rtvb703g', 'number', 70, 100);
INSERT INTO questions (question, quizid, input) VALUES('When do I get my results back?', '43rtvb703g', 'date');

INSERT INTO questions (question, quizid, input) VALUES('What is your name?', 'fdsbfg4SDF', 'text');
INSERT INTO questions (question, quizid, input, min, max) VALUES('How old are you?', 'fdsbfg4SDF', 'number', '30', '60');
INSERT INTO questions (question, quizid, input, required) VALUES('This is a required question, leave it blank and try to hit next!', 'fdsbfg4SDF', 'text', true);
INSERT INTO questions (question, quizid, options, input) VALUES('What is your experience using this app?', 'fdsbfg4SDF', '{Absolutely Amazing, Seen Better, God Awful}', 'single-select');
INSERT INTO questions (question, quizid, input, min, max) VALUES('What grade do you think this is worth?', 'fdsbfg4SDF', 'number', 70, 100);
INSERT INTO questions (question, quizid, input) VALUES('When do I get my results back?', 'fdsbfg4SDF', 'date');