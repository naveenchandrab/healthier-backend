const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ExerciseCategory',
		required: true,
	},
	video: {
		type: String,
	},
	likes: {
		type: Number,
	},
	tags: {
		type: [String],
	},
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
