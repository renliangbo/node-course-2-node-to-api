const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateTodos, todos, populateUsers, users} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
		it('should creat a new todo', (done) => {
				var text = 'Test todo text';
				request(app)
						.post('/todos')
						.send({text})
						.expect(200)
						.expect((res) => {
								expect(res.body.text).toBe(text)
						})
						.end((err, res) => {
								if (err) {
										return done(err)
								};
								Todo
										.find({text})
										.then((todos) => {
												expect(todos.length).toBe(1);
												expect(todos[0].text).toBe(text);
												done()
										})
										.catch((err) => done(err))
						})
		});

		it('should not creat a todo with invalid body data', (done) => {
				request(app)
						.post('/todos')
						.send({})
						.expect(400)
						.end((err, res) => {
								if (err) {
										return done(err)
								};
								Todo
										.find()
										.then((todos) => {
												expect(todos.length).toBe(2);
												done();
										})
										.catch((err) => done(err))
						})
		})

});

describe('GET /todos', () => {
		it('should get all todos', (done) => {
				request(app)
						.get('/todos')
						.expect(200)
						.expect((res) => {
								expect(res.body.todos.length).toBe(2)
						})
						.end(done)

		})
});

describe('GET /todo/:id', () => {
		it('should return todo doc', (done) => {
				request(app).get(`/todos/${todos[0]._id.toHexString()}`)
						.expect(200)
						.expect((res) => {
								expect(res.body.todo.text).toBe(todos[0].text)
						})
						.end(done)
		});

		it('should return 404 if todo not be found', (done) => {
				let id = new ObjectID().toHexString();
				request(app)
						.get(`/todos/${id}`)
						.expect(404)
						.end(done)
		})

		it('should return 404 if invalid id', (done) => {
				request(app)
						.get(`/todos/234`)
						.expect(404)
						.end(done)
		})
});

describe('DELETE /todo/:id', () => {
		it('should remove a todo', (done) => {
				let id = todos[0]
						._id
						.toHexString()
				request(app)
						.delete(`/todos/${id}`)
						.expect(200)
						.expect((res) => {
								expect(res.body.todo.text).toBe(todos[0].text)
						})
						.end((err, res) => {
								if (err) {
										return done(err);
								};
								Todo
										.findById(id)
										.then((todo) => {
												expect(todo).toNotExist();
												done();
										})
										.catch((err) => done(err))

						})
		});
		it('should return 404 if todo id not found', (done) => {
				let id = new ObjectID().toHexString();
				request(app)
						.delete(`/todos/${id}`)
						.expect(404)
						.end(done)
		});

		it('should return 404 if invalid id', (done) => {
				request(app)
						.delete(`/todos/234`)
						.expect(404)
						.end(done)
		})
})

describe('PATCH /todo/:id', (done) => {
		it('should update todo', (done) => {
				let id = todos[0]
						._id
						.toHexString();
				let text = 'this text has changed';

				request(app)
						.patch(`/todos/${id}`)
						.send({completed: true, text})
						.expect(200)
						.expect((res) => {
								expect(res.body.todo.text).toBe(text);
								expect(res.body.todo.completed).toBe(true);
								expect(res.body.todo.completedAt).toBeA('number')
						})
						.end(done)
		});

		it('should completedAt was cleared when completed is false', (done) => {
				let id = todos[0]
						._id
						.toHexString();

				request(app)
						.patch(`/todos/${id}`)
						.send({completed: false})
						.expect(200)
						.expect((res) => {
								expect(res.body.todo.completed).toBe(false);
								expect(res.body.todo.completedAt).toBe(null)
						})
						.end(done)
		});
		it('should return 404 if todo id not found', (done) => {
				let id = new ObjectID().toHexString();
				request(app)
						.patch(`/todos/${id}`)
						.expect(404)
						.end(done)
		});

		it('should return 404 if invalid id', (done) => {
				request(app)
						.patch(`/todos/234`)
						.expect(404)
						.end(done)
		})
})

describe('GET /users/me', () => {
		it('should return user if autenticated', (done) => {
				request(app)
						.get('/users/me')
						.set('x-auth', users[0].tokens[0].token)
						.expect(200)
						.expect((res) => {
								expect(res.body._id).toBe(users[0]._id.toHexString());
								expect(res.body.email).toBe(users[0].email)
						})
						.end(done)
		})

		it('should return 401 if not autenticated', (done) => {
				request(app)
						.get('/users/me')
						.expect(401)
						.expect((res) => {
								expect(res.body).toEqual({});
						})
						.end(done)
		})
});

describe('POST /users', () => {
		it('should create a user', (done) => {
				let email = 'example@example.com';
				let password = 'abc123';
				request(app)
						.post('/users')
						.send({email, password})
						.expect(200)
						.expect((res) => {
								expect(res.headers['x-auth']).toExist();
								expect(res.body._id).toExist();
								expect(res.body.email).toBe(email)
						})
						.end((err) => {
								if (err) {
										return done();
								};
								User
										.findOne({email})
										.then((user) => {
												expect(user).toExist();
												expect(user.password).toNotBe(password);
												done();
										})
										.catch((err) => done(err))
						})
		});
		it('should return validation errors if request invalid', (done) => {
				let email = 'exampleexample.co';
				let password = 'abc123';
				request(app)
						.post('/users')
						.send({email, password})
						.expect(400)
						.end(done);
		});
		it('should not create user if email in use', (done) => {
				let email = users[0].email
				let password = 'abc123';
				request(app)
						.post('/users')
						.send({email, password})
						.expect(400)
						.end(done);
		});
});

describe('POST /users/login', () => {
		it('should login user and return auth token', (done) => {
				request(app)
						.post('/users/login')
						.send({email: users[1].email, password: users[1].password})
						.expect(200)
						.expect(res => {
								expect(res.headers['x-auth']).toExist();
						})
						.end((err, res) => {
								if (err) {
										return done(err)
								};
								User
										.findById(users[1]._id)
										.then((user) => {
												expect(user.tokens[0]).toInclude({access: 'auth', token: res.headers['x-auth']});
												done();
										})
										.catch((err) => done(err))
						})
		});

		it('should reject invaild login', (done) => {
				request(app)
						.post('/users/login')
						.send({
								email: users[1].email,
								password: users[1].password + 1
						})
						.expect(400)
						.expect(res => {
								expect(res.headers['x-auth']).toNotExist();
						})
						.end((err, res) => {
								if (err) {
										return done(err)
								};
								User
										.findById(users[1]._id)
										.then((user) => {
												expect(user.tokens.length).toBe(0)
												done();
										})
										.catch((err) => done(err))
						})
		});

});

describe('DELETE /users/me/token', () => {
		it('should remove auth token on logout', (done) => {
				request(app)
						.delete('/users/me/token')
						.set('x-auth', users[0].tokens[0].token)
						.expect(200)
						.end((err) => {
								if (err) {
										return done(err)
								};
								User
										.findById(users[0]._id)
										.then((user) => {
												expect(user.tokens.length).toBe(0);
												done();
										})
										.catch((err) => {
												done(err)
										})
						})

		})
})
