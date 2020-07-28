const express = require('express');
const Joi = require('joi');

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

router.get('/', (req, res) => { });

router.post('/', async (req, res) => {
  const { error } = validateExercise(req.body);
});

module.exports = router;