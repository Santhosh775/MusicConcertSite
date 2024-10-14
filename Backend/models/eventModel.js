const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
