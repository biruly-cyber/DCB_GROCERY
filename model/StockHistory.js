import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    stockId:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required: true
    },
    productExpiryDate:{
        type:String,
        required:true
    },
    productUnitType:{
        type:String,
        required:true
    },
    kharidAmount:{
        type:Number,
        required:true
    },
    productQnty:{
        type:Number,
        required:true
    },
    productCategory:{
        type:String,
        required: true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    wholesaleAmount:{
        type:Number,
        required:true
    },
    retailAmount:{
        type:Number,
        required:true
    },
    distributerName:{
        type:String,
        required:true
    },
    submittedBy:{
        type:String,
        required:true
    },
    isStockAvailable:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
}
)

export const StockHistory = mongoose.model("stocks_history", stockSchema);
