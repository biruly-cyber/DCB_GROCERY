import mongoose from "mongoose";
// / Define a schema for the objects inside the array
const itemDetailsSchema = new mongoose.Schema({
    itemName: String,
    itemPrice: Number,
    itemQnty: Number,
    itemTotalAmt: Number,
    itemWholeSaleRate:Number,
    itemRetailRate:Number,
    itemPurchasedRate:Number,
    stockId: String,
  });

const khataSchema =  mongoose.Schema({
    invoiceId:{
        type:String,
        required:true
    },
    itemList:[itemDetailsSchema],
    totalAmount:{
        type:Number,
        required:true
    },
    paidAmount:{
        type:Number,
        required:true 
    },
    dueAmount:{
        type:Number,
        required:true 
    },
    paymentMode:{
        type:String,
        required:true 
    },
    isPaymentDone:{
        type:Boolean,
        default: false
    },
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"buyerdetails",
        required:true
    },
},{
    timestamps: true 
}
)

export const KhataInvoices = mongoose.model("khata_items_details", khataSchema);