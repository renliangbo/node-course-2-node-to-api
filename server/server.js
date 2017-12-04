require('../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('./middleware/authenticate');

var mongoose = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
		let todo = new Todo({text: req.body.text, _creator: req.user._id});

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

app.get('/todos', authenticate, (req, res) => {
		Todo
				.find({_creator: req.user._id})
				.then((todos) => {
						res.send({todos})
				}, (err) => {
						res
								.status(400)
								.send(err)
				})
})

app.get('/todos/:id', authenticate, (req, res) => {
		let {id} = req.params;
		if (!ObjectID.isValid(id)) {
				return res
						.status(404)
						.send('id is invalid')
		}
		Todo
				.findOne({_id: id, _creator: req.user._id})
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

app.delete('/todos/:id', authenticate, (req, res) => {
		let {id} = req.params;
		if (!ObjectID.isValid(id)) {
				return res
						.status(404)
						.send('id is invalid')
		};
		Todo
				.findOneAndRemove({_id: id, _creator: req.user._id})
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

		Todo.findOneAndUpdate({
				_id: id,
				_creator: req.user._id
		}, {
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
		var user = new User(body);
		user
				.save()
				.then(() => {
						return user.generateAutoToken();
				})
				.then((token) => {
						res
								.header('x-auth', token)
								.send(user)
				})
				.catch((err) => {
						res
								.status(400)
								.send(err)
				})
});

app.get('/users/me', authenticate, (req, res) => {
		res.send(req.user);
})

app.post('/users/login', (req, res) => {
		var body = _.pick(req.body, ['email', 'password']);
		User
				.findByCredentials(body.email, body.password)
				.then((user) => {
						return user
								.generateAutoToken()
								.then((token) => {
										res
												.header('x-auth', token)
												.send(user)
								})

				})
				.catch((e) => {
						res
								.status(400)
								.send();
				});
});

app.delete('/users/me/token', authenticate, (req, res) => {
		req
				.user
				.removeToken(req.token)
				.then(() => {
						res
								.status(200)
								.send();
				}, () => {
						res
								.status(400)
								.send();
				})
});

app.listen(port, () => {
		console.log(`Started on port${port}`)
});

module.exports = {
		app
}
