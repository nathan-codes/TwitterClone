import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv"



dotenv.config()
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))



// routes
app.use("/api/v1/auth", authRoutes);





app.get("/", (req, res) => {
  res.send("Server is read");
});



app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`Server started listening on Port: ${PORT}`);
  } catch (error) {
    console.log("Error starting server and connecting to db", error.message)
  }
});
