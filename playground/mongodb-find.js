const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
				return console.log('Unable to connect to MongoDB server')
		};
		console.log('Connect to MongoDB server');
		// db 		.collection('Todos') 		.find({completed: false}) 		.toArray()
		// 		.then((docs) => { 				console.log(docs) 		}, (err) => {
		// 				console.log('err', err) 		})

		db
				.collection('Todos')
				.find({completed: false})
				.count()
				.then((count) => {
						console.log(count)
				}, (err) => {
						console.log('err', err)
				})
		db.close();
})