const File = require("../models/fileModel");
const Coupon = require("../models/couponModel");

const getCoupon = async (req, res) => {
    const couponId = req.params.id;
    try {
        const coupon = await Coupon.find({ _id: couponId });
        res.status(200).json(coupon);
    } catch (error) {
        res.status(400).json(error)
    }
}

const addCoupon = async (req, res) => {
    const newCoupon = new Coupon(req.body);
    console.log(newCoupon);
    try {
        const savedCoupon = await newCoupon.save();
        res.status(201).json({ savedCoupon });
    } catch (error) {
        res.status(400).json(error)
    }
}

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(401).json(error)
    }
}


const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json("The Coupon is delted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
};

const validateCoupon = async (req, res) => {
    const { couponCode, fileId, userId } = req.body;

    try {
        // Find the coupon with the provided code and file ID
        const coupon = await Coupon.findOne({ fileId, _id: couponCode, isValid: true });

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon code not found or invalid' });
        }

        // Mark the coupon as used
        coupon.isValid = false;
        await coupon.save();

        // Grant access to the associated PDF file and add the userId to the allowedUsers array
        const file = await File.findById(fileId);
        console.log(file);
        if (!file) {
            return res.status(404).json({ error: 'PDF file not found' });
        }

        // Ensure that the allowedUsers array exists and is an array
        console.log(file.allowedUsers);
        if (!file.allowedUsers) {
            file.allowedUsers = [];
        }
        // Add the userId to the allowedUsers array
        file.allowedUsers.push(userId);
        await file.save();

        res.json({ message: 'Coupon code is valid, access granted, and user added to allowedUsers', fileId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { getCoupon, addCoupon, getAllCoupons, deleteCoupon, validateCoupon }