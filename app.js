const port = 3000;

const express = require('express');
const sqlite3 = require('sqlite3');
const js2xmlparser = require('js2xmlparser');
const bodyParser = require('body-parser');

const db = new sqlite3.Database('books.db');
const app = express();

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Default route');
});

app.get('/authors/:authorid', (req, res) => {
    const authorLookup = req.params.authorid;

    db.all(
        'SELECT * FROM author WHERE authorID=$authorID',
        {
            $authorID: authorLookup
        },
        (err, rows) => {
            //console.log(rows);
            if(rows.length > 0){
                res.send(js2xmlparser.parse("author", rows));
            } 
            else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

app.get('/authors', (req, res) => {
    //const authorsLookup = req.params.authors;

    db.all(
        'SELECT * FROM author',
        (err, rows) => {
            console.log(rows);
            if(rows.length > 0){
                //res.send(rows);
                res.send(js2xmlparser.parse("authors", rows));
            } 
            else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

app.get('/books/:bookid', (req, res) => {
    const bookLookup = req.params.bookid;

    db.all(
        'SELECT * FROM book WHERE bookID=$bookID',
        {
            $bookID: bookLookup
        },
        (err, rows) => {
            //console.log(rows);
            if(rows.length > 0){
                var xmlResponse = js2xmlparser.parse("book", rows);
                res.send(xmlResponse);
            } 
            else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

app.get('/books', (req, res) => {
    db.all(
        'SELECT * FROM book',
        (err, rows) => {
            console.log(rows);
            if(rows.length > 0){
                //res.send(rows);
                res.send(js2xmlparser.parse("books", rows));
            } 
            else {
                res.send("Couldn't find anything...");
            }
        }
    );
});

app.post('/post', (req, res) => {
    res.send("Post request");
})

app.post('/authors', (req, res) => {
    var SQL = `INSERT INTO author(authorID, firstname, lastname, nationality) VALUES(?,?,?,?);`;
    var data = {
        authorID: req.body.authorID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nationality: req.body.nationality 
    }
    var params = [data.authorID, data.firstname, data.lastname, data.nationality];

    console.log(data);

    //db.run(sql, params, function(err))i-bin/index2.cgi
    db.run(SQL, params, (err) => {
        if(err){
            console.log("Something went wrong!");
        }
        else{
            console.log("Data added!");
        }
    });
    res.send("ok");
});

app.post('/books', (req, res) => {
    var SQL = `INSERT INTO books(bookID, booktitle, authorID) VALUES(?,?,?);`;
    var data = {
        bookID: req.body.bookID,
        booktitle: req.body.booktitle,
        authorID: req.body.authorID,
    }
    var params = [data.bookID, data.booktitle, data.authorID];

    console.log(data);

    //db.run(sql, params, function(err))
    db.run(SQL, params, (err) => {
        if(err){
            console.log("Something went wrong!");
            res.send("Something went wrong!")
        }
        else{
            console.log("Data added!");
            res.send("Ok!")
        }
    });
});

app.listen(port, () => console.log('Listening on port ' + port));