const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const studentRoutes = require('./routes/studentRoute');
const courseRoutes = require('./routes/courseRoute');
const lessonRoutes = require('./routes/lessonRoute');
const commentRoutes = require('./routes/commentRoute');

dbConnect()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/students', studentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/comments', commentRoutes)
app.use(notFound)
app.use(errorHandler)




app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

