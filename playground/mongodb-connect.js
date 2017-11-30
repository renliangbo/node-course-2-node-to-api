const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
				return console.log('Unable to connect to MongoDB server')
		};
		console.log('Connect to MongoDB server');
		// db 		.collection('Todos') 		.insertOne({ 				text: 'to do someting',
		// 				completed: false 		}, (err, result) => { 				if (err) { 						return
		// console.log('Unable to insert todo', err) 				} 				//console.log(result)
		// 				console.log(JSON.stringify(result.ops, undefined, 2)) 		}) db
		// 		.collection('users') 		.insert({ 				name: 'Andrew', 				age: 27,
		// 				location: 'xian' 		}, (err, result) => { 				if (err) { 						return
		// console.log('unable to insert a user', err); 				};
		// 				console.log(JSON.stringify(result.ops, undefined, 2)) 		})
		db.close();
})