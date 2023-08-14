const express = require('express');
const app = express();
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoute');
const courseRoutes = require('./routes/courseRoute');
const lessonRoutes = require('./routes/lessonRoute');
const commentRoutes = require('./routes/commentRoute');

app.use(express.json());
app.use(studentRoutes)
app.use(courseRoutes)
app.use(lessonRoutes)
app.use(commentRoutes)



mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://admin:UW9c966cPQmwthIx@elearningapi.lx9pngr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        app.listen(3005, () => {
            console.log(`node API is running on port 3005`)
        })
    })
    .catch(err => console.log(err))


