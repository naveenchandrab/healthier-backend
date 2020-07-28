const express = require('express');
const Joi = require('joi');
const ExerciseCategory = require('../models/ExerciseCategory');

const router = express.Router();

const validateExercisecategory = (category) => {
  const schema = {
    name: Joi.string().required(),
    image: Joi.string().required()
  }
  return Joi.validate(category, schema);
}

router.get('/', async (req, res) => {
  try {
    const result = await ExerciseCategory.find();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validateExercisecategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let category = await ExerciseCategory.findOne({ name: req.body.name });
    if (category) return res.status(400).send('category already exist..');

    category = new ExerciseCategory(req.body);
    const result = await category.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }

});

module.exports = router;