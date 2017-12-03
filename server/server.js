require('../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash')

var mongoose = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT

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
});

app.delete('/todos/:id', (req, res) => {
		let {id} = req.params;
		if (!ObjectID.isValid(id)) {
				return res
						.status(404)
						.send('id is invalid')
		};
		Todo
				.findByIdAndRemove(id)
				.then((todo) => {
						if (!todo) {
								return res
										.status(404)
										.send(todo);
						};
						res
								.status(200)
								.send({todo})
				})
				.catch(err => res.status(400).send(err))

});

app.patch('/todos/:id', (req, res) => {
		var {id} = req.params;
		var body = _.pick(req.body, ['text', 'completed']);
		if (!ObjectID.isValid(id)) {
				return res
						.status(404)
						.send('id isinvalid ')
		};
		if (_.isBoolean(body.completed) && body.completed) {
				body.completedAt = new Date().getTime();
		} else {
				body.completed = false;
				body.completedAt = null;
		};

		Todo.findByIdAndUpdate(id, {
				$set: body
		}, {new: true}).then((todo) => {
				if (!todo) {
						res
								.status(404)
								.send({todo});
				};
				res
						.status(200)
						.send({todo})
		}).catch((err) => {
				res
						.status(400)
						.send(400)
		})

});

app.post('/users', (req, res) => {
		var body = _.pick(req.body, ['email', 'password']);
		var user = User(body);
		user
				.save()
				.then((user) => {
						res.send(user)
				})
				.catch((err) => {
						res
								.status(400)
								.send(err)
				})
})
app.listen(port, () => {
		console.log(`Started on port${port}`)
});

module.exports = {
		app
}
