const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;
