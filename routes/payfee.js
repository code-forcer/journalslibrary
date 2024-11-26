const express = require('express');
const router = express.Router();

router.get('/payfee', (req, res) => {
    res.render('pages/payfee', { title: 'JournalsLibrary | Pay Fee' });
});

module.exports = router;
