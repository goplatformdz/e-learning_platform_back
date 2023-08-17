const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const errorHandler = require('./middleWares/errorHandler')
const studentRoutes = require('./routes/studentRoute');
const courseRoutes = require('./routes/courseRoute');
const lessonRoutes = require('./routes/lessonRoute');
const commentRoutes = require('./routes/commentRoute');
const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser')

dbConnect()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/students', studentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/comments', commentRoutes)

app.all('*', (req, res, next) => {
    next(new CustomError(`Url Not found : ${req.originalUrl}`, 404))
})

app.use(errorHandler)





app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

