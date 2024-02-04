import mongoose from "mongoose";

// Define a schema for the objects inside the array
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

const invoiceSchema = new mongoose.Schema({
    invoiceId:{
        type:String,
        required: true 
    },
    customerName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        trim:true
    },
    phoneNumber:{
        type:String
    },
    paidAmount:{
        type:Number
    },
    dueAmount:{
        type:Number
    },
    isPaymentDone:{
        type:Boolean,
        default:false
    },
    paymentMode:{
        type:String
    },
    itemList: [itemDetailsSchema],
    totalAmount:{
        type:Number,
    }
},{
    timestamps:true 
}
)

export const GenerateInvoice = mongoose.model("invoices", invoiceSchema);

