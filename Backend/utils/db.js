import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
