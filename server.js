const express = require('express');
const app = express();
const cors = require('cors');
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
const shareRoutes = require('./routes/shareRoute');
const notificationRoutes = require('./routes/notificationRoute');
const messageRoutes = require('./routes/messageRoute');
const chatroomRoutes = require('./routes/chatroomRoute');
const blogRoutes = require('./routes/blogRoute');
const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

dbConnect()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('public'));
app.get("/test", (req, res) => {
    res.json("hello")
})
const corsOptions = {
    origin: ['https://e-learning-platform-front.vercel.app'/*, 'http://localhost:8081'*/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
app.use('/api/users', usersRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/share', shareRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/chatrooms', chatroomRoutes)
app.use('/api/blogs', blogRoutes)


app.all('*', (req, res, next) => {
    next(new CustomError(`Url Not found : ${req.originalUrl}`, 404))
})

app.use(errorHandler)





app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

