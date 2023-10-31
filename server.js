const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const errorHandler = require('./middlewares/errorHandler')

// Import routes
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
const fileRoute = require('./routes/fileRoute');
const couponRoute = require('./routes/couponRoute');


const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

dbConnect()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.json("hello")
})
const corsOptions = {
    origin: ['http://www.rifk.online', 'http://localhost:8080',],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
/**
 * @type Route
 * @Note : This routes for uploading PDFs files
 * @author Nacer Kraa
*/
app.use('/api/file', fileRoute);
app.use('/api/coupon', couponRoute);
app.use(fileUpload()); // @Note : You should move this middleware up when you use html multipart otherwise it won't work.
app.use('/api/users', usersRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatrooms', chatroomRoutes);
app.use('/api/blogs', blogRoutes);



app.all('*', (req, res, next) => {
    next(new CustomError(`Url Not found : ${req.originalUrl}`, 404))
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})

