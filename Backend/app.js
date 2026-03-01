require('dotenv').config();
const path = require('path');
const express = require('express');

//connect to database
const connectDb = require('./db/connectDB');

//extra security packages
const helmet = require('helmet');
const { filterXSS } = require('xss');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const xssMiddleware = (req, res, next) => {
  if (req.body) req.body = JSON.parse(filterXSS(JSON.stringify(req.body)));
  if (req.query) req.query = JSON.parse(filterXSS(JSON.stringify(req.query)));
  next();
};

//routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const userDashboardRouter = require('./routes/userDashboard');
const jobApplicationsRouter = require('./routes/job-application');
const savedJobsRouter = require('./routes/saved-job');
const jobSuggestionsRouter = require('./routes/predict-job');
const uploadRouter = require('./routes/upload');
const SkillGapsRouter = require('./routes/skillGap');

//error handlers / middlewares
const notFound = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/errorhandler');
const authenticateUser = require('./middlewares/authenticate');
const uploadMiddleware = require('./middlewares/uploadMiddleware');

const app = express();
app.set("trust proxy", 1)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again after 15 minutes"
});

//routes
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500",
    credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(xssMiddleware);
app.use(limiter);

app.use('/api/v1/user', authenticateUser, userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/dashboard/', authenticateUser, userDashboardRouter);
app.use('/api/v1/user/jobApplications', authenticateUser, jobApplicationsRouter);
app.use('/api/v1/user/savedJobs', authenticateUser, savedJobsRouter);
app.use('/api/v1/model/v1', authenticateUser, jobSuggestionsRouter);
app.use('/api/v1/resumePdf', uploadMiddleware.single('resume'), uploadRouter);
app.use('/api/v1/gemini/skillGaps', authenticateUser, SkillGapsRouter);


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
