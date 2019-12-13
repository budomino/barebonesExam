var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//create connection to database
const db = mysql.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '1234567890',
	database: 'inventory'
});

//connect to mysql database
db.connect((err) => {
	if(err){
		throw err;
	}
	console.log('MySql Connected...');
})

var app = express();

app.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE inventory';
	db.query(sql, (err, result) => {
		if(err) throw err;
		res.send('Database created...');
	});
});

//create table
app.get('/createitemstable', (req, res) => {
	let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
	db.query(sql,(err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Posts table created...');
	})
})

//fetch all posts
app.get('/fetchallposts',(req, res) => {
	let sql = 'SELECT * FROM posts';
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Posts fetched...');

	})
})

// insert post 1
app.get('/addpost',(req, res) => {
	let post = {title:'Post One', body:'This is post number one'};
	let sql = 'INSERT INTO posts SET ?'
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Posts 1 added...');

	});
});

//get any post
app.get('/getpost/:id', (req, res) => {
	let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Post fetched');
	});
});

// update post
app.get('/updateitem/:id', (req, res) => {
	let newTitle = 'Updated Title';
	let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Post updated');
	});
});

// delete post
app.get('/deleteitem/:id', (req, res) => {
	let newTitle = 'Updated Title';
	let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err; 
		console.log(result);
		res.send('Post deleted');
	});
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
