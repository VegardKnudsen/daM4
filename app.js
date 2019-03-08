const port = 3000;

const express = require('express');
const sqlite3 = require('sqlite3');
const js2xmlparser = require('js2xmlparser');
const db = new sqlite3.Database('books.db');
const cookieParser = require('cookie-parser');
var xmlparser = require('express-xml-bodyparser');
const md5 = require('md5');
const app = express();

app.use(xmlparser());
app.use(cookieParser());
/*
*
*LOGIN
*
*/
app.post('/login', (req, res) => {   
    var data = {
        userID: req.body.logininfo.userid[0],
 		passwordhash: req.body.logininfo.passwordhash[0]
    }
    console.log("UserID: " + data.userID + " Password: " + data.passwordhash);
    console.log("Cookie: " + req.body.cookies);

    var params = [data.userID];
    var SQL = `SELECT passwordhash, userID FROM user WHERE userID = ?`;
    db.get(SQL, params, (err, row) => {
        if(row != null) {
        	let username = row.userID;
        	let password = row.passwordhash;
        	let hashpassword = md5(data.passwordhash);

        	if (data.userID == username){
        		console.log("Username valid");
        		if (password == hashpassword){
        			console.log("Password valid");
        			res.send("SessionID=124356");
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
        	console.log("Noob!");
        	res.send("Contact admin!");
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
    var data = {
        authorID: req.body.authorID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nationality: req.body.nationality 
    }
    if (req.body.firstname){
        var SQL = `UPDATE author SET firstname = ? WHERE authorID = ?`;
        var params = [data.firstname, data.authorID];

        db.run(SQL, params, (err) => {
            if(err){
                console.log("Something went wrong!");
            }
            else{
                console.log("Data added!");
            }
        });
    }

    if (req.body.lastname){
        var SQL = `UPDATE author SET lastname = ? WHERE authorID = ?`;
        var params = [data.lastname, data.authorID];

        db.run(SQL, params, (err) => {
            if(err){
                console.log("Something went wrong!");
            }
            else{
                console.log("Data added!");
            }
        });
    }

    if (req.body.nationality){
        var SQL = `UPDATE author SET nationality = ? WHERE authorID = ?`;
        var params = [data.nationality, data.authorID];

        db.run(SQL, params, (err) => {
            if(err){
                console.log("Something went wrong!");
            }
            else{
                console.log("Data added!");
            }
        });
    }
    res.send("all good homie");
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

        db.run(SQL, params, (err) => {
        if(err){
            console.log("Something went wrong!");
        }
        else{
            console.log("Data added!");
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
        }
        else{
            console.log("Data added!");
        }
        });
    }
    res.send("All good homie");
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