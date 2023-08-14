const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const courseRoutes = require('./routes/courseRoute');

app.use(express.json());
app.use(userRoutes)
app.use(courseRoutes)


