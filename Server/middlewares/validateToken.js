const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const jwt = require('jsonwebtoken');


const validateToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if (!accessToken) return next(new CustomError("User not authenticated or token expired", 400))

    try {
        const validToken = await jwt.verify(accessToken, process.env.SECRET_KEY)
        console.log(validToken)
        req.currentStudent = {
            id: validToken.id.toString(),
            firstname: validToken.firstname,
            lastname: validToken.lastname
        }
        return next()
    } catch {
        next(new CustomError("User is not authorized", 401))
    }

})

module.exports = { validateToken } 