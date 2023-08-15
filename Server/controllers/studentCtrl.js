const express = require('express');
const Student = require('../models/studentModel');
const router = new express.Router();
const mongoose = require('mongoose');


const loginStudent = async (req, res) => {
    const { email, password } = req.body
    try {
        const findStudent = await Student.findOne({ email })
        if (findStudent && (await findStudent.isPasswordMatched(password))) {
            res.status(200).json({ message: 'Student logged in successfully', data: findStudent })
        }
        else { throw new Error('Invalid Credentials') }
    } catch (err) {
        throw new Error(err)
    }
}

const createStudent = async (req, res) => {
    try {
        const { email } = req.body;
        const findStudent = await Student.findOne({ email: email })
        if (!findStudent) {
            try {
                const newStudent = await Student.create(req.body)
                res.status(200).json({ message: 'Student successfully registered', data: newStudent })
            } catch (error) {
                throw new Error(error)
            }
        } else {
            throw new Error('User already exists')
        }
    } catch (error) {
        throw new Error(error)
    }
}


const updateStudent = async (req, res) => {
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
            })
        if (!student) {
            const error = new Error(`Couldn't find student with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'Updated Successfully', data: student })
    } catch (error) {
        throw new Error(error)
    }
}


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({})
        res.status(200).json(students)
    } catch (error) {
        throw new Error(error)
    }
}

const getStudent = async (req, res) => {
    try {
        const { id } = req.params
        const student = await Student.findById(id)
        if (!student) {
            const error = new Error(`Couldn't find student with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json(student);
    } catch (error) {
        throw new Error(error)
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params
        const student = await Student.findByIdAndDelete(id)
        if (!student) {
            const error = new Error(`Couldn't find student with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'Student deleted successfully' })
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    updateStudent,
    getStudent,
    deleteStudent,
}