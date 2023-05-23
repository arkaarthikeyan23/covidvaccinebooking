const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  centreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Centre',
  },
});

module.exports = mongoose.model('Vaccine', vaccineSchema);
