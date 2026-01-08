require('dotenv').config()

const express = require('express');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.get('/', (req, res)=>{
    res.send('Alright job API')
} )

const app = express();

const authRouter = require('./routes/auth.route');
const jobRouter = require('./routes/jobs.route');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const router = require('./routes/main.route');
const authenticationMiddleware = require('./middleware/auth');

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server is listening on port ${port}`))         
    } catch (error) {
        console.log(error);
    }
}

start();