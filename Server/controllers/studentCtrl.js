const Student = require('../models/studentModel');
const CustomError = require('../utils/customError');


const loginStudent = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const findStudent = await Student.findOne({ email })
        if (findStudent && (await findStudent.isPasswordMatched(password))) {
            res.status(200).json({ message: 'Student logged in successfully', data: findStudent })
        }
        else {
            return next(new CustomError('Invalid Credentials', 401))
        }
    } catch (err) {
        return next(new CustomError('Error while logging in', 500))
    }
}

const registerStudent = async (req, res, next) => {
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
}


const updateStudent = async (req, res, next) => {
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
}


const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find({})
        res.status(200).json(students)
    } catch (error) {
        return next(new CustomError('Error while fetching students', 500))
    }
}

const getStudent = async (req, res, next) => {
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
}

const deleteStudent = async (req, res, next) => {
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
}

module.exports = {
    registerStudent,
    getAllStudents,
    updateStudent,
    getStudent,
    deleteStudent,
    loginStudent,
}