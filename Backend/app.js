require('dotenv').config();
const path = require('path');
const express = require('express');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

//connect to database
const connectDb = require('./db/connectDB');

//routers
const getPagesRouter = require('./routes/getPage');
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

//static files
app.use(express.static(path.join(__dirname, '..', 'Viewing')));


app.set('trust proxy', 1);
//routes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window`(here 15 mins)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use('/', getPagesRouter);
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
