const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
				return console.log('Unable to connect to MongoDB server')
		};
		console.log('Connect to MongoDB server');
		// deleteMany db 		.collection('Todos') 		.deleteMany({text: 'Eat dinner'})
		// 		.then((result) => { 				console.log(result) 		}, (err) => {
		// 				console.log(err) 		}) deleteOne db 		.collection('Todos')
		// 		.deleteOne({text: 'Eat dinner'}) 		.then((result) => {
		// 				console.log(result) 		}, (err) => { 				console.log(err) 		})
		// findOneAndDelete db.close(); db 		.collection('Todos')
		// 		.findOneAndDelete({completed: false}) 		.then((result) => {
		// 				console.log(result) 		}, (err) => { 				console.log(err) 		})
})