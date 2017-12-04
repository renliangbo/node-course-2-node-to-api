const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var userOneToken = jwt.sign({
		_id: userOneId,
		access: 'auth'
}, 'abc123').toString();

const users = [
		{
				_id: userOneId,
				email: 'Andrew@example.com',
				password: 'onepassword',
				tokens: [
						{
								access: 'auth',
								token: userOneToken
						}
				]
		}, {
				_id: userTwoId,
				email: 'joe@example.com',
				password: 'twopassword'
		}
]
const todos = [
		{
				_id: new ObjectID(),
				text: 'Walk dog',
				_creator: userOneId
		}, {
				_id: new ObjectID(),
				completed: true,
				completedAt: 222,
				text: 'Charge my phone',
				_creator: userTwoId
		}
];
const populateTodos = (done) => {
		Todo
				.remove({})
				.then(() => Todo.insertMany(todos))
				.then(() => done())
};
const populateUsers = (done) => {
		User
				.remove({})
				.then(() => {
						var userOne = new User(users[0]).save();
						var userTwo = new User(users[1]).save();
						return Promise.all([userOne, userTwo]);
				})
				.then(() => {

						done();
				})
				.catch((e) => {
						console.log(e)
				})
}

module.exports = {
		populateTodos,
		populateUsers,
		todos,
		users
}