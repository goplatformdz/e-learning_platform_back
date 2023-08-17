const Student = require('../models/studentModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer')
const { generateToken } = require('../config/jwtToken');



const loginStudent = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    try {
        const student = await Student.findOne({ email })
        if (student && (await student.isPasswordMatched(password))) {
            const accessToken = generateToken(student)
            res.cookie(
                'access-token', accessToken,
                { maxAge: 24 * 60 * 60 * 1000 }
            )
            res.status(200).json({ message: 'Student logged in successfully', data: student })
        }
        else {
            return next(new CustomError('Invalid Credentials', 401))
        }
    } catch (err) {
        return next(new CustomError('Error while logging in', 500))
    }
})

const registerStudent = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body;
        const findStudent = await Student.findOne({ email: email })
        if (!findStudent) {
            try {
                const newStudent = await Student.create(req.body)
                res.status(200).json({ message: 'Student successfully registered', data: newStudent })
            } catch (error) {
                return next(new CustomError('Registration Failed: Database Error', 500))
            }
        } else {
            return next(new CustomError('Student with the same email is already registered', 400))
        }
    } catch (error) {
        return next(new CustomError('Error during registration process', 500))
    }
})


const updateStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    try {
        const student = await Student.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            password: req?.body?.password,
        },
            {
                new: true
            }
        )
        if (!student) {
            return next(new CustomError(`Student with ID ${id} not found`, 404))
        }
        res.status(200).json({ message: 'Updated Successfully', data: student })
    } catch (error) {
        return next(new CustomError('Error during student update process', 500))
    }
})


const getAllStudents = asyncHandler(async (req, res, next) => {
    try {
        const students = await Student.find({})
        res.status(200).json(students)
    } catch (error) {
        return next(new CustomError('Error while fetching students', 500))
    }
})

const getStudent = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        const student = await Student.findById(id)
        if (!student) {
            return next(new CustomError(`Student with ID ${id} not found`, 404));
        }
        res.status(200).json(student);
    } catch (error) {
        return next(new CustomError('Error while fetching student', 500));
    }
})

const deleteStudent = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return next(new CustomError(`Student with ID ${id} not found`, 404));
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        return next(new CustomError('Error while deleting student', 500));
    }
})

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
            to: email,                      // Recipient address (student's email)
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
        await sendNewsletterConfirmationEmail(email);
        // Respond to the client
        res.status(200).json({ message: 'Newsletter subscription confirmation sent !' });
    } catch (error) {
        return next(new CustomError('Error subscribing to newsletter', 500));

    }
});

module.exports = {
    registerStudent,
    getAllStudents,
    updateStudent,
    getStudent,
    deleteStudent,
    loginStudent,
    subscribeToNewsLetter

}
