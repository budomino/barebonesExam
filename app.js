var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
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


//app.get('/', function(req, res) {
//	res.render(__dirname + '/routes/index.js');
//});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);



// CHECK IF TABLE AND DATABASE EXIST and then CREATE THEM
//const existsTable = 'IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'horshe') SELECT 'found' AS search_result ELSE SELECT 'not found' AS search_result;';


// create database
app.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE IF NOT EXISTS inventory';
	db.query(sql, (err, result) => {
		if(err) res.send('Database already created');
		console.log(result);
		res.send('Database created...');
	});
});

// create table
app.get('/createitemstable', (req, res) => {
//	if (!existsTable) {
		let sql = "CREATE TABLE IF NOT EXISTS items (id int AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), quantity int UNSIGNED, amount DECIMAL(13,2))";
		db.query(sql,(err, result) => {
			if(err) throw err;
			console.log('newly created database');
			console.log(result);
			res.send('items table created...');
		});
//	}
//	console.log('previouslycreated');
//	res.send('table already created');
});

// RETRIEVING

//get all items
var obj = {};
app.get('/',(req, res) => {
	let sql = 'SELECT * FROM items';
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		//obj === {print: result};
		console.log(result);
		res.render('index', {data: result,});

	})
})

//get any post
app.get('/getitem/:id', (req, res) => {
	let sql = `SELECT * FROM items WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send(req.params.name);
	});
});


// CREATING

// insert post 1
app.get('/additem',(req, res) => {
	let post = {name:'testitem', quantity:'1', amount:'12.00'};
	let sql = 'INSERT INTO items SET ?'
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Post added...');

	});
});



// update post
app.get('/updateitem/:id', (req, res) => {
	let newTitle = 'Updated Title';
	let sql = `UPDATE items SET title = '${newTitle}' WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Post updated');
	});
});

// delete post
app.get('/deleteitem/:id', (req, res) => {
	let newTitle = 'Updated Title';
	let sql = `DELETE FROM items WHERE id = ${req.params.id}`;
	let query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Post deleted');
	});
});



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

// port environment check
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}`));
