const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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
});

app.get('/todos', (req, res) => {
		Todo
				.find({})
				.then((todos) => {
						res.send({todos})
				}, (err) => {
						res
								.status(400)
								.send(err)
				})
})

app.get('/todos/:id', (req, res) => {
		let {id} = req.params;
		if (!ObjectID.isValid(id)) {
				return res
						.status(404)
						.send('id is invalid')
		}
		Todo
				.findById(id)
				.then((todo) => {
						if (!todo) {
								return res
										.status(404)
										.send()
						}
						res.send({todo})
				})
				.catch((err) => {
						res
								.status(400)
								.send(err)
				})
})
app.listen(3000, () => {
		console.log('Started on port 3000')
});

module.exports = {
		app
}
