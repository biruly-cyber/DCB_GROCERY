import mongoose from "mongoose";

const buyerDetailsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true
    },
    isPaymentDone:{
        type:Boolean,
        default: false
    },
    totalAmount:{
        type:Number,
        default: 0
    },
    totalDueAmount:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const BuyerDetails = mongoose.model("buyerdetails", buyerDetailsSchema)