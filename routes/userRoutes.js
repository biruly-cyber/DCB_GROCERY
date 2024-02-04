import express from "express"

import { getMyProfile, login, logout, register } from "../controller/userController.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()

//routes for register controller
router.post("/register", register)

//routes for login controller
router.post("/login", login)

//routes for getuserdetails
router.get("/me",isAuthenticated, getMyProfile)

//route for logout controller
router.get("/logout", logout)


export default router 
