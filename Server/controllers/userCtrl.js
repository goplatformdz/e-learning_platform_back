const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { generateToken } = require('../config/jwtToken');

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.isPasswordMatched(password))) {
            const accessToken = generateToken(user);
            res.cookie(
                'access-token', accessToken,
                { maxAge: 24 * 60 * 60 * 1000, }
            );
            res.status(200).json({ message: 'User logged in successfully', data: user });
        } else {
            return next(new CustomError('Invalid Credentials', 401));
        }
    } catch (err) {
        return next(new CustomError('Error while logging in', 500));
    }
});

const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            try {
                const newUser = await User.create(req.body);
                res.status(200).json({ message: 'User successfully registered', data: newUser });
            } catch (error) {
                return next(new CustomError('Registration Failed: Database Error', 500));
            }
        } else {
            return next(new CustomError('User with the same email is already registered', 400));
        }
    } catch (error) {
        return next(new CustomError('Error during registration process', 500));
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
        return next(new CustomError('Error while fetching user', 500));
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
        const transporter = nodemailer.createTransport({
            // Configure your email service here
            service: 'Gmail', // Change to your email service provider
            auth: {
                user: 'managerplatfrome@gmail.com', // Your email address
                pass: process.env.PASSWORD_ADMIN,   // Your email password or app-specific password
            },
        });

        const mailOptions = {
            from: 'managerplatfrome@gmail.com', // Sender address
            to: email,                      // Recipient address (user's email)
            subject: 'Newsletter Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter!',
            html: '<p>Thank you for subscribing to our newsletter!</p>',
        };

        await transporter.sendMail(mailOptions);
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

module.exports = {
    registerUser,
    getAllUsers,
    updateUser,
    getUser,
    deleteUser,
    loginUser,
    subscribeToNewsLetter,
};
