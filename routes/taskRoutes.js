import express from "express"
import { deleteTask, getTaskDetails, newTask, updateTask } from "../controller/taskController.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()

//routes for new task controller
router.post("/new",isAuthenticated, newTask)

//route for get task
router.get("/my", isAuthenticated, getTaskDetails)

// routes for update task
//routes for delete task
router.route("/:id").put(isAuthenticated, updateTask).delete(isAuthenticated, deleteTask)


export default router 