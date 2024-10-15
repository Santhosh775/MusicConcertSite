const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

router.post('/buy-tickets', async (req, res) => {
  try {
    const purchase = new Purchase({
      eventId: req.body.eventId,
      eventName: req.body.eventName,
      eventLocation: req.body.eventLocation,
      eventDate: req.body.eventDate,
      amount: req.body.amount,
      numTickets: req.body.numTickets,  
      userDetails: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      purchaseDate: new Date()
    });

    await purchase.save();
    res.status(200).json({ message: 'Ticket purchased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error purchasing ticket' });
  }
});

router.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
});


module.exports = router;
