const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const errorHandler = require('./middlewares/errorHandler')
const studentRoutes = require('./routes/studentRoute');
const courseRoutes = require('./routes/courseRoute');
const lessonRoutes = require('./routes/lessonRoute');
const commentRoutes = require('./routes/commentRoute');
const CustomError = require('./utils/customError');

dbConnect()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/students', studentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/comments', commentRoutes)

app.all('*', (req, res, next) => {
    next(new CustomError(`Not found : ${req.originalUrl}`, 404))
})

app.use(errorHandler)





app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

