require('dotenv').config();
const path = require('path');
const express = require('express');

//connect to database
const connectDb = require('./db/connectDB');

//routers
const getPagesRouter = require('./routes/getPage');
const authRouter = require('./routes/auth');

//error handlers
const notFound = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/errorhandler');

const app = express();

//static files
app.use(express.static(path.join(__dirname, '..', 'Viewing')));

//routes/middlewares
app.use(express.json());
app.use('/',getPagesRouter);
app.use('/api/v1/auth',authRouter);


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
