import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] Successfully connected to databse: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[Database] Error connecting to databse: ${error.message}`);
    process.exit(1);
  }
};
