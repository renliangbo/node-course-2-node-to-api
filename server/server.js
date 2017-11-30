const mongoose = require('mongoose');

const {Schema} = mongoose;
const TodoSchema = new Schema({
		text: {
				type: String,
				required: true,
				minlength: 1,
				trim: true
		},
		completed: {
				type: Boolean,
				default: false
		},
		completedAt: {
				type: Number,
				default: null
		}
})
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', TodoSchema);
var newTodo = new Todo({text: ' Edit this video  upfeuf    '});
newTodo
		.save()
		.then((todo) => {
				console.log(todo)
		}, (err) => {
				console.log(err)
		})