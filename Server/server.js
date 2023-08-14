const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const courseRoutes = require('./routes/courseRoute');

app.use(express.json());
app.use(userRoutes)
app.use(courseRoutes)


app.listen(3005, () => {
    console.log(`node API is running on port 3005`)
})


