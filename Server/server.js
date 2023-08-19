const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const errorHandler = require('./middlewares/errorHandler')
const usersRoutes = require('./routes/userRoute');
const courseRoutes = require('./routes/courseRoute');
const lessonRoutes = require('./routes/lessonRoute');
const commentRoutes = require('./routes/commentRoute');
const enrollmentRoutes = require('./routes/enrollmentRoute');
const categoryRoutes = require('./routes/categoryRoute');
const categoryCourseRoutes = require('./routes/categoryCourseRoute');
const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser')

dbConnect()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/users', usersRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/categoryCourse', categoryCourseRoutes)

app.all('*', (req, res, next) => {
    next(new CustomError(`Url Not found : ${req.originalUrl}`, 404))
})

app.use(errorHandler)





app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

