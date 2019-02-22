'use strict';
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var node = require("deasync");
var row = "";
var app = express();
// var xml = require('xml');

node.loop = node.runLoopOnce;

// Connect to databasefil
var db = new sqlite3.Database('./bokbase', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.\n');
});

app.listen(7777, function() {
    console.log('Server started on port 7777');
});

app.get('/authors/all', function(req, res) {

    res.set('Content-type', 'text/xml');
    var xmlFile = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlFile += '<authorlist>';
    var done = 0;
    var SQL = `SELECT authorID as id,
        firstname as fName,
        lastname as lName,
        nationality as nat FROM author`;

    db.serialize(function() {
        db.each(SQL, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            xmlFile += '<author>';
            xmlFile += '<authorid>' + row.id + '</authorid>';
            xmlFile += '<firstname>' + row.fName + '</firstname>';
            xmlFile += '<lastname>' + row.lName + '</lastname>';
            xmlFile += '<nationality>' + row.nat + '</nationality>'
            xmlFile += '</author>';
            done = 1;
        });

        while(!done) {
            node.loop();
        }

        xmlFile += '</authorlist>';
        res.send(xmlFile);
    });
});

app.get('/books/all', function(req, res) {

    res.set('Content-type', 'text/xml');
    var xmlFile = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlFile += '<booklist>';
    var done = 0;
    var SQL = `SELECT bookID as id,
        title as title,
        authorID as aId FROM book`;

    db.serialize(function() {
        db.each(SQL, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            xmlFile += '<book>';
            xmlFile += '<bookid>' + row.id + '</bookid>';
            xmlFile += '<title>' + row.title + '</title>';
            xmlFile += '<authorId>' + row.aId + '</authorId>';
            xmlFile += '</book>';
            done = 1;
        });

        while(!done) {
            node.loop();
        }

        xmlFile += '</booklist>';
        res.send(xmlFile);
    });
});


app.get('/books/:bookId', function(req, res) {

    res.set('Content-type', 'text/xml');
    var bookIdFromRequest = req.param('bookId');
    console.log("bookId from request: " + bookIdFromRequest);
    var SQL = `SELECT bookID as id,
        title as title,
        authorID as aId FROM book
        WHERE bookID = ?`;
    var xmlFile = '<?xml version="1.0" encoding="UTF-8"?>';

    db.serialize(function() {
        db.get(SQL, [bookIdFromRequest], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            xmlFile += '<book>';
            xmlFile += '<bookid>' + row.id + '</bookid>';
            xmlFile += '<title>' + row.title + '</title>';
            xmlFile += '<authorId>' + row.aId + '</authorId>';
            xmlFile += '</book>';

            res.send(xmlFile);
        });
    });
});








