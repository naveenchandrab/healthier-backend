const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { any } = require('joi');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
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
	profilePic: String,
	age: {
		type: Number,
		required: true,
	},
	fitnessType: {
		type: String,
		enum: ['lean', 'medium', 'fat', 'heavy fat'],
		required: true,
	},
	weight: {
		type: String,
		required: true,
	},
	height: {
		type: String,
		required: true,
	},
	lifeStyle: {
		type: String,
		enum: ['daily', 'once in a week', 'very often'],
		required: true,
	},
	foodStyle: {
		type: String,
		enum: ['south indian', 'north indian', 'western'],
		required: true,
	},
	goal: {
		type: String,
		enum: ['loose weight', 'gain weight', 'build muscle'],
		required: true,
	},
	onboarded: {
		type: Boolean,
		default: false,
	},
});

userSchema.methods.getAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		process.env.JWT_PRIVATE_KEY
	);
	return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
