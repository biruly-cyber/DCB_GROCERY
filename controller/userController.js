import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utilities/feature.js";
import { User } from "../model/user.js";

// Configure the dotenv file
dotenv.config({
  path: "./data/.env",
});

//handle for register
export const register = async (req, res) => {
  try {
    // Fetch all data from the request body
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Check if email exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login!",
      });
    }

    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // send cookies
    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message, // Send the error message for debugging
    });
  }
};

//login handle
export const login = async (req, res) => {
  try {
    //fetch all data from body
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    //check email exist or not
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please register!",
      });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Please enterd correct password!",
      });
    }

    //return the result
    sendCookie(user, res, `welcome back ${user.name} `, 200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for get user details
export const getMyProfile = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "details is fetched",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for logout
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite:  process.env.NODE_ENV === "Development"? "lax": "none",
        secure: process.env.NODE_ENV === "Development"? false : true 
      })
      .json({
        success: true,
        message: "logout successfully!",
        user: null,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
