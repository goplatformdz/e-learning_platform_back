const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,

  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: String,
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.confirmPassword = undefined
  next()
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema);

module.exports = User;
