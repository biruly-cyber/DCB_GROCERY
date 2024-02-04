import cors from "cors"
import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';

import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import buyer from "./routes/buyerDetailsRoutes.js"
import khataInvoice from "./routes/customerKhataRoutes.js"
import itemsRoutes from "./routes/itemOrderRoutes.js"
import invoice from "./routes/generateInvoiceRoutes.js"
import stock from "./routes/stockRoutes.js"
import khataCustomerPaymentHistory from "./routes/KhataCustomerPaymentHistoryRoutes.js"
import { errorMiddleware } from "./middleware/error.js";


export const app = express();

// // Configure the dotenv file
dotenv.config({
    path: './database/.env'
});

// // Using middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","PUT","POST","DELETE"],
    credentials: true
}))

// // Routes for user
app.use('/api/v1/users', userRoutes);

// //routes for task
app.use("/api/v1/task", taskRoutes)

// //routes for buyer
app.use("/api/v1/sell", buyer)

// //routes for buyer
app.use("/api/v1/khata", khataInvoice)

// // routes for item handler 
app.use("/api/v1/item", itemsRoutes)

// //routes for create new invoice
app.use("/api/v1/invoice", invoice)

// //routes for create new invoice
app.use("/api/v1/stock", stock)


//routes for khata payment history 
app.use("/api/v1/khatapayment", khataCustomerPaymentHistory)




//default route
app.get("/", (req, res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    res.send("nice working")
})

// using error middle ware
app.use(errorMiddleware)
