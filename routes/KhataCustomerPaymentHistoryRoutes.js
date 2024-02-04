import express  from "express";

import { isAuthenticated } from "../middleware/auth.js";
import { getAllPaymentHistoryOfSpecificCustomer, khataCustomerPaymentHistory, updatePaymentHistory } from "../controller/KhataCustomerPaymentHistoryController.js";


const router = express.Router()

// controller routes for payment added 
router.post("/:id",isAuthenticated, khataCustomerPaymentHistory)

//upadte payment history document 
router.put("/:id",isAuthenticated, updatePaymentHistory)

// get all last payment details 
router.get("/:id", isAuthenticated, getAllPaymentHistoryOfSpecificCustomer)


export default router