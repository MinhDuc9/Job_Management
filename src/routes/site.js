const express = require('express');
const router = express.Router();

const SiteController = require('../app/controllers/SiteController');

router.get('/about', SiteController.about);
router.get('/', SiteController.index);

module.exports = router;
