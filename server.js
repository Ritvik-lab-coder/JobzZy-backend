import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'colors'
import dotenv from 'dotenv'
import connectDB from './database/dbConfig.js'
import userRoute from './routes/userRoutes.js'
import companyRoute from './routes/companyRoutes.js'
import jobRoute from './routes/jobRoutes.js'
import applicationRoute from './routes/applicationRoutes.js'

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"]
}));

connectDB();

const PORT = process.env.PORT || 5000;

app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgMagenta);
});