const express = require('express');
const router = express.Router();

router.get('/contactformsuccess', (req, res) => {
    res.render('pages/contactformsuccess', { title: 'JournalsLibrary | contact form success' });
});

module.exports = router;
