const port = 3000;

const express = require('express');
const sqlite3 = require('sqlite3');
const js2xmlparser = require('js2xmlparser');
const bodyParser = require('body-parser');
const db = new sqlite3.Database('books.db');
const app = express();

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

/*
*
*LOGIN
*
*/
app.post('/login', (req, res) => {
    var SQL = `SELECT passwordhash, userID FROM user WHERE userID = ?`;
    var data = {
        userID: req.body.userID,
 		passwordhash: req.body.passwordhash
    }

    var params = [data.userID];

    db.get(SQL, params, (err, row) => {
        if(row != null) {
        	let username = row.userID;
        	let password = row.passwordhash;

        	if (data.userID == username){
        		console.log("Username valid");
        		if (data.passwordhash == password){
        			console.log("Password valid");
        			res.redirect('/cgi-bin2/index2.cgi');
        		} else {
        			console.log("Wrong username or password");
        			res.send("Wrong username or password");
        		}
        	} else {
        		console.log("Wrong username or password");
        		res.send("Wrong username or password");
        	}
        } else if(err){
            console.log("Something went wrong!");
        } else {
        	console.log("FUCKER!");
        	res.send("Contact admin u fucking hacker noob!");
        }
    });
});

/*
*
*LOGOUT
*
*/


/*
*
* AUTHORS
*
*/

/*
* GET
*/
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

/*
* GET
*/
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

/*
* POST
*/
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

/*
* PUT
*/
app.put('/authors', (req, res) => {
    var SQL = `UPDATE author SET firstname = ?, lastname = ?, nationality = ? WHERE authorID = ?`;
    var data = {
        authorID: req.body.authorID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nationality: req.body.nationality 
    }
    var params = [data.firstname, data.lastname, data.nationality, data.authorID];

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

/*
* DELETE
*/
app.delete('/authors', (req, res) => {
    var data = {
        authorID: req.body.authorID
    }
    console.log(data);
    console.log("req body value: " + req.body.authorID);
    if (req.body.authorID) {
    	var SQL = `DELETE FROM author WHERE authorID = ?`;
    	var params = [data.authorID];

    	db.run(SQL, params, (err) => {
        	if(err){
            	console.log("Something went wrong!");
            	res.send("Something went wrong!")
        	}else{
            	console.log("Data deleted!");
            	res.send("Data deleted!")
        	}
    	});
    } else {
    	var SQL = `DELETE FROM author`;

    	db.run(SQL, (err) => {
        	if(err){
            	console.log("Something went wrong!");
            	res.send("Something went wrong!")
        	}else{
            	console.log("Data deleted!");
            	res.send("Data deleted!")
        	}
    	});
    }
    console.log(data);    
});


/*
*
* BOOKS
*
*/

/*
* GET
*/
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

/*
* GET
*/
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


/*
* POST
*/
app.post('/books', (req, res) => {
    var SQL = `INSERT INTO book(bookID, booktitle, authorID) VALUES(?,?,?);`;
    var data = {
        bookID: req.body.bookID,
        booktitle: req.body.booktitle,
        authorID: req.body.authorID
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

/*
* PUT
*/
app.put('/books', (req, res) => {
    var data = {
        booktitle: req.body.booktitle, 
        authorID: req.body.authorID,
        bookID: req.body.bookID
    }
    console.log(req.body.booktitle);
    if (req.body.booktitle) {
        var SQL = `UPDATE book SET booktitle = ? WHERE bookID = ?`;
        var params = [data.booktitle, data.bookID];
        console.log(data);

        //db.run(sql, params, function(err))
        db.run(SQL, params, (err) => {
        if(err){
            console.log("Something went wrong!");
            res.send("Something went wrong!")
        }
        else{
            console.log("Data added!");
            res.send("Ok, booktitle updated!")
        }
        });

    }
    if (req.body.authorID) {
        var SQL = `UPDATE book SET authorID = ? WHERE bookID = ?`;
        var params = [data.authorID, data.bookID];
        console.log(data);

        //db.run(sql, params, function(err))
        db.run(SQL, params, (err) => {
        if(err){
            console.log("Something went wrong!");
            res.send("Something went wrong!")
        }
        else{
            console.log("Data added!");
            res.send("Ok, authorID updated!")
        }
        });
    }
});

/*
* DELETE
*/
app.delete('/books', (req, res) => {
    var data = {
        bookID: req.body.bookID
    }
    if (req.body.bookID) {
    	var SQL = `DELETE FROM book WHERE bookID = ?`;
    	var params = [data.bookID];

    	db.run(SQL, params, (err) => {
        	if(err){
            	console.log("Something went wrong!");
            	res.send("Something went wrong!")
        	}else{
            	console.log("Data deleted!");
            	res.send("Data deleted!")
        	}
    	});
    } else {
    	var SQL = `DELETE FROM book`;

    	db.run(SQL, (err) => {
        	if(err){
            	console.log("Something went wrong!");
            	res.send("Something went wrong!")
        	}else{
            	console.log("Data deleted!");
            	res.send("Data deleted!")
        	}
    	});
    }
});


app.listen(port, () => console.log('Listening on port ' + port));