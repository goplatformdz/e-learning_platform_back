const express = require('express');
const router = express.Router();

const { getCoupon, addCoupon, getAllCoupons, deleteCoupon, validateCoupon } = require("../controllers/couponCtrl");

// Define a route for file upload
router.get('/find/:id', getCoupon);
router.post('/add', addCoupon);
router.get('/findAll', getAllCoupons);
router.delete('/delete/:id', deleteCoupon);
router.post('/validate', validateCoupon);


module.exports = router;