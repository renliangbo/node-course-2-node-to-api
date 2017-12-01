const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
		{
				_id: new ObjectID(),
				text: 'Walk dog'
		}, {
				_id: new ObjectID(),
				text: 'Charge my phone'
		}
];
beforeEach((done) => {
		Todo
				.remove({})
				.then(() => Todo.insertMany(todos))
				.then(() => done())
});

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
})
