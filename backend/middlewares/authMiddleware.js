import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // Check if token exits and is formated correctly
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(400).json({
        error: true,
        succes: false,
        message: "Invalid token format or no token found",
      });
    }
    console.log("Request header", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: "Unauthorized, Invalid token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error", error);
  }
};
