const express = require('express');
const router = express.Router();

router.get('/topics', (req, res) => {
    res.render('pages/topics', { title: 'JournalsLibrary | Topics' });
});

module.exports = router;
