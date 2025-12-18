require('dotenv').config();
const path = require('path');
const express = require('express');

//connect to database
const connectDb = require('./db/connectDB');

//routers
const getPagesRouter = require('./routes/getPage');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const jobApplicationsRouter = require('./routes/job-application');

//error handlers / middlewares
const notFound = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/errorhandler');
const authenticateUser = require('./middlewares/authenticate');

const app = express();

//static files
app.use(express.static(path.join(__dirname, '..', 'Viewing')));

//routes
app.use(express.json());
app.use('/', getPagesRouter);
app.use('/api/v1/user', authenticateUser, userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user/jobApplications', authenticateUser, jobApplicationsRouter);


app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async() => {
    try{
        await connectDb(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    }catch(err){
        console.log(err);
    }
}

start();
