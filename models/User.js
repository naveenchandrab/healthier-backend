const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 255,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
	},
	isAdmin: Boolean,
	onboarding: Boolean,
	profilePic: {
		type: String,
	},
});

userSchema.methods.getAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		config('jwtPrivateKey')
	);
	return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
