const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
// var user = 'i am a user'; var hash = SHA256(user).toString()
// console.log(hash)
var data = {
		id: 10
};
var token = jwt.sign(data, '123abc');

console.log(token);