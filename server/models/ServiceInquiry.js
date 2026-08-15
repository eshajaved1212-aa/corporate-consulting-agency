const mongoose = require('mongoose');

const serviceInquirySchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      trim: true,
    },
    serviceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in-review', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceInquiry', serviceInquirySchema);
