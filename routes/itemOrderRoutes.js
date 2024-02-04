import express  from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {  allItems, deleteItem, itemUpdate, newItems } from "../controller/ProductOrderController.js";

const router = express.Router()




//routes for add the item
router.post("/:id", isAuthenticated, newItems)

//routes for update the item
router.put("/:id", isAuthenticated, itemUpdate)

//delete the item 
router.delete("/:id", isAuthenticated, deleteItem)

//get all the item
router.get("/all/:id", isAuthenticated, allItems)


export default router