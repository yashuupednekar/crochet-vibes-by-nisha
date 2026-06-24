const express = require('express');
const router = express.Router();
const { getSetting, updateHeroImage } = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:key', getSetting);
router.post('/hero-image', protect, adminOnly, upload.single('image'), updateHeroImage);

module.exports = router;