const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const validateToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if (!accessToken) return next(new CustomError("User not authenticated or token expired", 400))

    try {
        const decoded = await jwt.verify(accessToken, process.env.SECRET_KEY)
        const { id, firstname, lastname } = await User.findById(decoded.id)
        req.currentUser = {
            id,
            firstname,
            lastname
        }
        return next()
    } catch {
        next(new CustomError("User is not authorized", 401))
    }

})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.currentUser
    try {
        const user = await User.findById(id)
        if (user && user.role === "admin") return next()
        else next(new CustomError("User is not authorized", 401))
    } catch {
        next(new CustomError(`User with the id of ${id} is not found`, 404))
    }
})

const isStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.currentUser
    try {
        const user = await User.findById(id)
        if (user && user.role === "student") return next()
        else return next(new CustomError("User is not authorized", 401))
    } catch {
        next(new CustomError(`User with the id of ${id} is not found`, 404))
    }
})

module.exports = { validateToken, isAdmin, isStudent } 