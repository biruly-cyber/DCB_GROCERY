import express from "express"
import { deleteStock, getAllStock, getStockById, getStockHistory, newStock, updateStock } from "../controller/StockController.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()


//routes for new task controller
router.post("/newstock",isAuthenticated, newStock)

//route for get task
router.get("/mystock", isAuthenticated, getAllStock)

//route for get all stock history
router.get("/history", isAuthenticated, getStockHistory)

//routes for get specific id
router.get("/:id", isAuthenticated, getStockById)
// routes for update task
//routes for delete task
router.route("/:id").put(isAuthenticated, updateStock).delete(isAuthenticated, deleteStock)




export default router