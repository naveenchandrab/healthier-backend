const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExerciseCategory',
    required: true,
  },
  video: {
    type: String
  },
  likes: {
    type: Number
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;