const express = require('express');
const router = express.Router();

// About Page Route
router.get('/admin/login', (req, res) => {
    res.render('pages/admin/login', { title: 'JournalsLibrary | Create profile 📖' });
});

module.exports = router;
