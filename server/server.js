const express = require('express');
const bodyParser = require('body-parser');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.listen(3000, () => {
		console.log('Started on port 3000')
});

// var newTodo = new Todo({text: ' Edit this video  upfeuf    '}); newTodo
// 		.save() 		.then((todo) => { 				console.log(todo) 		}, (err) => {
// 				console.log(err) 		})