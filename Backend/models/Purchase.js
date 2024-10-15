const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventName: String,
  eventLocation: String,
  eventDate: String,
  amount: Number,
  numTickets: { type: Number, required: true }, 
  userDetails: {
    name: String,
    email: String,
    phone: String
  },
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
