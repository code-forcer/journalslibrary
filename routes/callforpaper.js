const express = require('express');
const router = express.Router();

router.get('/callforpaper', (req, res) => {
    res.render('pages/callforpaper', { title: 'JournalsLibrary | Call for paper' });
});

module.exports = router;
