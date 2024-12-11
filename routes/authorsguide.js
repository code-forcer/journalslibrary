const express = require('express');
const router = express.Router();

router.get('/authorsguide', (req, res) => {
    res.render('pages/authorsguide', { title: 'JournalsLibrary | Authors guide' });
});

module.exports = router;
