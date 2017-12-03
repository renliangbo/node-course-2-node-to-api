const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// var user = 'i am a user'; var hash = SHA256(user).toString()
// console.log(hash)
var data = {
		id: 10
};
var token = jwt.sign(data, '123abc');
var password = 'abc123!';
var hashword = '$2a$10$p0eHS/XU/EUtNP8rH.rYPuihzNB2pe.ik94cyOFTy9U2YzGpxjXYq';

// bcrypt.genSalt(10, (err, salt) => { 		bcrypt.hash(password, salt, (err, hash)
// => { 				console.log(hash) 		}) });
bcrypt.compare(password, hashword, (err, res) => {
		console.log(res)
})