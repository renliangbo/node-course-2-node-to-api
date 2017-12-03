const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const {Schema} = mongoose;

const UserSchema = new Schema({
		email: {
				type: String,
				required: true,
				trim: true,
				minlength: 1,
				unique: true,
				validate: {
						validator: value => validator.isEmail(value),
						message: '{VALUE} is not a valid email'
				}
		},
		password: {
				type: String,
				required: true,
				minlength: 6
		},
		tokens: [
				{
						access: {
								type: String,
								required: true
						},
						token: {
								type: String,
								required: true
						}
				}
		]

});

const User = mongoose.model('User', UserSchema);

module.exports = {
		User
}