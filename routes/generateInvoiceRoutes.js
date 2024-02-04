import express  from "express";
import { allInvoice, getAllInvoiceHistory, newInvoice } from "../controller/GenerateInvoice.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()




//routes for add the item
router.post("/new", isAuthenticated, newInvoice)

//routes for update the item
// router.put("/:id", isAuthenticated, itemUpdate)

//delete the item 
// router.delete("/:id", isAuthenticated, deleteItem)

//get all the invoice of today only
router.get("/all", isAuthenticated, allInvoice)

//get all the invoice history
router.get("/history", isAuthenticated, getAllInvoiceHistory)



export default router