const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});
router.get('/herp', (req, res) => {
    res.render('index.html');
    console.log(`herp`)
});

module.exports = router;