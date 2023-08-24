const express = require('express');
const router = express.Router();

const {
    shareToFacebook,
    shareToTwitter,
    shareToLinkedIn,
} = require('../controllers/shareCtrl')
const { validateToken, isStudent } = require('../middlewares/validateToken');

router.get('/facebook', shareToFacebook);
router.get('/twitter', validateToken, shareToTwitter);
router.get('/linkedin', validateToken, shareToLinkedIn);

module.exports = router;