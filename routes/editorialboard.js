const express = require('express');
const router = express.Router();

router.get('/editorialboard', (req, res) => {
    res.render('pages/editorialboard', { title: 'JournalsLibrary | Editorila Board' });
});

module.exports = router;
