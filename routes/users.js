const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const User = require('../models/User');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { use } = require('./exercises');

const router = express.Router();

const validateUser = (user) => {
	const schema = {
		name: Joi.string().min(1).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required(),
		isAdmin: Joi.bool(),
		profilePic: Joi.string(),
		age: Joi.number().required(),
		fitnessType: Joi.string().required(),
		weight: Joi.string().required(),
		height: Joi.string().required(),
		lifeStyle: Joi.string().required(),
		foodStyle: Joi.string().required(),
		goal: Joi.string().required(),
		onboarded: Joi.bool(),
	};
	return Joi.validate(user, schema);
};

router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user._id }).select('-password');
		res.send(user);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const result = await User.findById({ _id: req.params.id });
		res.send(
			_.pick(result, ['name', 'email', 'profilePic', 'isAdmin', 'onboarded'])
		);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

router.get('/', [auth, admin], async (req, res) => {
	try {
		const result = await User.find();
		const users = result.map((user) =>
			_.pick(user, ['name', 'email', 'profilePic', 'onboarded'])
		);
		res.send(users);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

router.put('/:id', async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const result = await User.findOne({ _id: req.params.id });
		if (!result) return res.send('User doesn\t exist..');

		const user = await User.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$set: _.pick(req.body, ['name', 'email', 'profilePic', 'onboarded']),
			},
			{ new: true }
		);

		res.send(_.pick(user, ['name', 'email', 'profilePic', 'onboarded']));
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

router.post('/', async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send('User already exist...');

	user = new User(req.body);

	try {
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(req.body.password, salt);
		user.password = hashed;
		const result = await user.save();
		const token = user.getAuthToken();
		res.header('x-auth-token', token).send(_.pick(result, ['name', 'email']));
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
