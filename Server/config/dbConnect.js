const mongoose = require('mongoose');

const dbConnect = () => {
    try {
        mongoose.set("strictQuery", false)
        mongoose.connect(process.env.MONGODB_URL)

        console.log('Successfully connected to the database')
    } catch (err) {
        console.log('Error connecting to database')
    }

}

module.exports = dbConnect;