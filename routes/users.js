const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const User = require('../models/User');

const router = express.Router();

const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.bool(),
    profilePic: Joi.string()
  }
  return Joi.validate(user, schema);
};

router.get('/:id', async (req, res) => {
  try {
    const result = await User.findById({ _id: req.params.id });
    res.send(_.pick(result, ['name', 'email', 'profilePic']));
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await User.find();
    const users = result.map(user => _.pick(user, ['name', 'email', 'profilePic']))
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

    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
      $set: _.pick(req.body, ['name', 'email', 'profilePic'])
    }, { new: true });

    res.send(_.pick(user, ['name', 'email', 'profilePic']));
  } catch (ex) {
    res.status(400).send(ex.message)
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