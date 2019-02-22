CREATE TABLE user (
  userID	SMALLINT(5),
  passwd	VARCHAR(20),
  firstname	VARCHAR(100),
  lastname	VARCHAR(100),

  PRIMARY KEY (userID)
);

CREATE TABLE auther (

  autherID	SMALLINT(5),
  firstname	VARCHAR(100),
  lastname	VARCHAR(100),
  nationality	VARCHAR(100),

  PRIMARY KEY (autherID)
);

CREATE TABLE book (

  bookID	SMALLINT(5),
  title		VARCHAR(250),
  autherID 	SMALLINT(5),

  PRIMARY KEY (bookID),
  FOREIGN KEY (autherID) REFERENCES auther (autherID)
);

CREATE TABLE session (
  sessionID	SMALLINT(5),
  userID	SMALLINT(5),

  PRIMARY KEY (sessionID),
  FOREIGN KEY (userID) REFERENCES user (userID)
);

DROP TABLE author;
DROP TABLE user;
DROP TABLE book;
DROP TABLE session;
