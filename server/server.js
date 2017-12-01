const express = require('express');
const bodyParser = require('body-parser');

var mongoose = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
		let todo = new Todo({text: req.body.text});

		todo
				.save()
				.then((todo) => {
						res.send(todo)
				}, (err) => {
						res
								.status(400)
								.send(err)
				})
})
app.listen(3000, () => {
		console.log('Started on port 3000')
});

// var newTodo = new Todo({text: ' Edit this video  upfeuf    '}); newTodo
// 		.save() 		.then((todo) => { 				console.log(todo) 		}, (err) => {
// 				console.log(err) 		})