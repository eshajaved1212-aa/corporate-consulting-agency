const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    results: {
      type: [String],
      default: [],
    },
    challenge: {
      type: String,
      default: '',
      trim: true,
    },
    solution: {
      type: String,
      default: '',
      trim: true,
    },
    timeline: {
      type: String,
      default: '',
      trim: true,
    },
    testimonial: {
      type: String,
      default: '',
      trim: true,
    },
    testimonialAuthor: {
      type: String,
      default: '',
      trim: true,
    },
    results_img: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
