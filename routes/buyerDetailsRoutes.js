import express from 'express';
import { getAllBuyer, newBuyerDetails, deleteBuyerDetails, updateBuyersDetails, customerDetails } from '../controller/BuyerDetailsController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// For user buyer details routes
router.post('/newbuyer', isAuthenticated, newBuyerDetails);

//for get buyers details controller
router.get('/allbuyer', isAuthenticated, getAllBuyer);

router.get('/:id', isAuthenticated, customerDetails);

//for delete the buyer details,
router.delete("/:id", isAuthenticated, deleteBuyerDetails)

//for update the buyer details
router.put("/:id", isAuthenticated, updateBuyersDetails)



export default router;
