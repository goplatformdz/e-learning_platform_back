const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    fileId: { type: String, required: true, unique: false },
    isValid: {
        type: Boolean, default: true
    }
}, { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);