import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // 1. Input validation
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing fields. Please enter all required fields.",
    });
  }

  try {
    // Normalize email
    const emailLower = email.toLowerCase();

    // 2. Check if user exists by username or email (one DB call)
    const existingUser = await User.findOne({
      $or: [{ username }, { email: emailLower }],
    });

    if (existingUser) {
      const message =
        existingUser.username === username
          ? "Username is already taken"
          : "Email is already taken";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    // 3. Hash password with configurable salt rounds
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email: emailLower,
      password: hashedPassword,
    });

    // 5. Generate token and send response
    generateTokenAndSetCookie(newUser._id, res);

    const { _id, followers, following, profileImg, coverImg } = newUser;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: _id,
        firstName,
        lastName,
        username,
        email: emailLower,
        followers,
        following,
        profileImg,
        coverImg,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    const isValidPassword =
      existingUser && (await bcrypt.compare(password, existingUser.password));
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email or password.",
      });
    }

    // Generate cookie
    generateTokenAndSetCookie(existingUser._id, res);

    const {
      _id,
      firstName,
      lastName,
      username,
      profileImg,
      coverImg,
      followers,
      following,
    } = existingUser;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: _id,
        firstName,
        lastName,
        username,
        email: existingUser.email,
        profileImg,
        coverImg,
        followers,
        following,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong. Please try again later.",
      debug: error.message, // Optional: remove in production
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      error: false,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      return res.status(200).json({
        success: true,
        error: false,
        message: "User successfully found",
        data: user,
      });
    }
  } catch (error) {
    console.log("Error",error)
    return res.status(500).json({message:"Error retrieving user information"})
  }
};
