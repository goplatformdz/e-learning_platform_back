const jwt = require('jsonwebtoken');

const generateToken = (student) => {
    return jwt.sign(
        {
            id: student._id,
            firstname: student.firstname,
            lastname: student.lastname

        },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    )
}

module.exports = { generateToken }