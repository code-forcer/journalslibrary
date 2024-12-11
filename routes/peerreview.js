const express = require('express');
const router = express.Router();

router.get('/peerreview', (req, res) => {
    res.render('pages/peerreview', { title: 'JournalsLibrary | Peer Review' });
});

module.exports = router;
