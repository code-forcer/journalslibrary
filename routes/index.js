const express = require('express');
const router = express.Router();

// Home Page Route
router.get('/', (req, res) => {
    res.render('pages/', { title: 'JournalsLibrary | Welcome 📚' });
});

module.exports = router;
