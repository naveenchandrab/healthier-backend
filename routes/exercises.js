const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const Exercise = require('../models/Exercise');

const router = express.Router();

const validateExercise = (exercise) => {
  const schema = {
    name: Joi.string().required(),
    category: Joi.string().required(),
    video: Joi.string(),
    likes: Joi.number()
  }
  return Joi.validate(exercise, schema);
};

router.get('/', async (req, res) => {
  try {
    const result = await Exercise.find().populate('category');
    const excercises = result.map(user => _.pick(user, ['name', 'category', 'video', 'likes', '_id']))
    res.send(excercises);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validateExercise(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const exercise = new Exercise(req.body);
    const result = await exercise.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message)
  }
});

module.exports = router;