const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');


router.post('/', async (req, res) => {
  const { imageUrl, name, date, location } = req.body;
  try {
    const event = new Event({ imageUrl, name, date, location });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});


router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});


router.get('/:id', async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).send({ error: 'Event not found' });
      }
      res.json(event);
  } catch (error) {
      res.status(500).send({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { imageUrl, name, date, location } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(id, { imageUrl, name, date, location }, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
});

module.exports = router;
