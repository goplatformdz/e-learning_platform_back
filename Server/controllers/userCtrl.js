const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { generateToken } = require('../config/jwtToken');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken');


const { log } = require('console');


const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.isPasswordMatched(password))) {
            const accessToken = generateToken(user);
            res.cookie(
                'access-token', accessToken,
                {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true
                }
            );
            res.status(200).json({ message: 'User logged in successfully', data: user, token: accessToken });
        } else {
            return next(new CustomError('Invalid Credentials', 402));
        }
    } catch (err) {
        return next(new CustomError('Error while logging in', 500));
    }
});

const logoutUser = asyncHandler(async (req, res, next) => {
    const objectId = new ObjectId(req.currentUser.id)

    try {
        const user = await User.findById(objectId);
        res.clearCookie('access-token'); // Clear the access token cookie
        res.status(200).json({ message: 'User logged out successfully', user });
    } catch (error) {
        return next(new CustomError('Error during logout process', 500));
    }
});

const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            try {
                const newUser = await User.create(req.body);
                const accessToken = generateToken(newUser);
                res.cookie(
                    'access-token', accessToken,
                    {
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true
                    }
                );
                res.status(200).json({ message: 'User successfully registered', data: newUser, token: accessToken });
            } catch (error) {
                return next(new CustomError(error.message, 500));
            }
        } else {
            return next(new CustomError('User with the same email is already registered', 400));
        }
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
});


const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {

            const resetToken = user.createPasswordResetToken()
            await user.save({ validateBeforeSave: false })

            const resetUrl = `${req.protocol}://localhost:8080/api/users/resetPassword/${resetToken}`;
            const text = `We have received a password reset request, please click in the link below to reset your password\n\n ${resetUrl}\n\nNote: this link will expire in 5 minutes`;


            try {
                await sendMail({
                    to: user.email,
                    subject: 'Password change request received',
                    text,

                })
                res.status(200).json({ message: 'password reset link sent to user email' })
            } catch (err) {
                user.passwordResetToken = undefined
                user.passwordResetTokenExpires = undefined
                await user.save({ validateBeforeSave: false })

                return next(new CustomError('Error sending reset password', 500));
            }


        } else {
            return next(new CustomError('Email Not found', 404));
        }
    } catch (err) {
        return next(new CustomError(err, 500));
    }
});

const resetPassword = asyncHandler(async (req, res, next) => {
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return next(new CustomError(`User not found`, 404));
        }

        // Update the password and confirmPassword fields
        user.password = req.body.password;

        // Clear the reset token and expiration date
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;

        // Save the updated user document
        await user.save();



        // Send a success response
        res.status(200).json({ message: 'Password reset successfully', data: user });
    } catch (error) {
        return next(new CustomError(error, 500));
    }
});


const updateStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Extract the new status from the request body

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { status: status }, // Update only the status field
            { new: true }
        );

        if (!user) {
            return next(new CustomError(`User with ID ${id} not found`, 404));
        }

        res.status(200).json({ message: 'Status updated successfully', data: user });
    } catch (error) {
        return next(new CustomError('Error during status update process', 500));
    }
});



const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                phoneNumber: req?.body?.phoneNumber,
                password: req?.body?.password,
            },
            {
                new: true
            }
        );
        if (!user) {
            return next(new CustomError(`User with ID ${id} not found`, 404));
        }
        res.status(200).json({ message: 'Updated Successfully', data: user });
    } catch (error) {
        return next(new CustomError('Error during user update process', 500));
    }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        return next(new CustomError('Error while fetching users', 500));
    }
});

const getUser = asyncHandler(async (req, res, next) => {

    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return next(new CustomError(`User with ID ${id} not found`, 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
});

const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(new CustomError(`User with ID ${id} not found`, 404));
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return next(new CustomError('Error while deleting user', 500));
    }
});

const sendNewsletterConfirmationEmail = asyncHandler(async (email, next) => {
    try {
        await sendMail({
            to: email,
            subject: 'Newsletter Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter!',
            html: '<p>Thank you for subscribing to our newsletter!</p>',
        })
    } catch (error) {
        next(new CustomError('An error occurred while sending the confirmation email', 500));
    }

});

const subscribeToNewsLetter = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body;
        await sendNewsletterConfirmationEmail(email, next);

        // Respond to the client
        res.status(200).json({ message: 'Newsletter subscription confirmation sent!' });
    } catch (error) {
        return next(new CustomError('Error subscribing to newsletter', 500));
    }
});


const checkLogin = asyncHandler(async (req, res, next) => {
    try {
        if (req.cookies["access-token"]) {
            // Token exists, attempt to decode it
            const accessToken = req.cookies["access-token"];
            const decoded = await jwt.verify(accessToken, process.env.SECRET_KEY);

            // If decoding succeeds, user is logged in
            if (decoded.id) {
                // const objectId = new ObjectId(decoded.id);
                const user = await User.findById(decoded.id);
                return res.status(200).json({ isLoggedIn: true, user: user });
            }
        }

        // No token or decoding failed, user is not logged in
        return res.status(200).json({ isLoggedIn: false });
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
});



module.exports = {
    registerUser,
    getAllUsers,
    updateUser,
    getUser,
    deleteUser,
    loginUser,
    logoutUser,
    subscribeToNewsLetter,
    forgotPassword,
    resetPassword,
    checkLogin,
    updateStatus

};
