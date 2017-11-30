const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
				return console.log('Unable to connect to MongoDB server')
		};
		console.log('Connect to MongoDB server');
		// db 		.collection('Todos') 		.findOneAndUpdate({ 				_id: new
		// ObjectID('5a1fb6668f67c704d32f2b51') 		}, { 				$set: { 						completed: true
		// 				} 		}, {returnOriginal: false}) 		.then((result) => {
		// 				console.log(result) 		}, (err) => { 				console.log(err) 		}) db
		// 		.collection('users') 		.findOneAndUpdate({ 				_id: new
		// ObjectID('5a1f71dfbff8ba334be393ea') 		}, { 				$set: { 						name: 'Jaklee'
		// 				}, 				$inc: { 						age: 2 				} 		}, {returnOriginal: false})
		// 		.then((result) => { 				console.log(result) 		}, (err) => {
		// 				console.log(err) 		})
})