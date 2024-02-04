import mongoose from "mongoose";

const khataCustomerPaymentHistorySchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    lastPaymentAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Corrected export using mongoose.model
export const KhataCustomerPaymentHistory = mongoose.model("khata_customers_payment_history", khataCustomerPaymentHistorySchema);
