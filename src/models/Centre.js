const mongoose = require('mongoose');

const centreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  workingHours: {
    type: String,
    required: true,
  },
  slotsAvailable: {
    type: Number,
    required: true,
    default: 10,
  }
});

module.exports = mongoose.model('Centre', centreSchema);
