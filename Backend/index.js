 import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// routes
app.use('/api/v1/user', userRoute);

// start server properly
const startServer = async () => {
  try {
    console.log("Starting server...");
    await connectDB();
    console.log("Database connected, now starting server...");
    
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });

  } catch (error) {
    console.log("Error while starting server:", error);
  }
};

startServer();
