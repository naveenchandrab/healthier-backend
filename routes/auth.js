const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/User');

const router = express.Router();

const validateUser = (user) => {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }
  return Joi.validate(user, schema);
}

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Incorrect username or password');

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send('Incorrect username or password');

    const token = user.getAuthToken();
    res.send(token);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

module.exports = router;