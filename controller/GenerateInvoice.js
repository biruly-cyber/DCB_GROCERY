import { GenerateInvoice } from "../model/invoice.js";
import { Stock } from "../model/stock.js";

// create new invoice 
export const newInvoice = async (req, res) => {
  // console.log(req.body);

  try {
    const {
      invoiceId,
      customerName,
      address,
      phoneNumber,
      paidAmount,
      paymentMode,
      itemList,
      totalAmount,
    } = req.body;

    // Check all the fields and if items, quantities, prices are arrays
    if (!invoiceId || !customerName || !totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "All fields required and items, quantities, prices must be arrays!",
      });
    }

    //check payment is less than eqaul to total amount
    let dueAmt = 0;
    if (paidAmount <= totalAmount) {
      dueAmt = totalAmount - paidAmount;
    }
    

    //update stock
    for (const item of itemList) {
      const stockId = item.stockId;
      const productQnty = item.itemQnty;

      // Check if stock with the given stockId exists
      const foundStock = await Stock.findOne({ stockId });

      if (foundStock) {
        // Parse the productQnty to ensure it's a number
        const productQntyNumber = parseFloat(productQnty, 10);

        // Update the productQnty in the foundStock
        foundStock.productQnty -= productQntyNumber;

        // Save the updated stock
        await foundStock.save();
      } else {
        return res.status(400).staus({
          success:false,
          message:`Stock with stockId ${stockId} not found.`
        })
      }
    }

    // // Create entry in the database
    const invoice = await GenerateInvoice.create({
      invoiceId,
      customerName,
      address,
      phoneNumber,
      paidAmount,
      dueAmount: dueAmt,
      paymentMode,
      itemList,
      totalAmount,
    });

    //find invoice
    const foundInvoice = await GenerateInvoice.findOne({
      invoiceId: invoiceId,
    });

    if (foundInvoice) {
      // Check if paidAmount is equal to totalAmount
      if (foundInvoice.paidAmount == foundInvoice.totalAmount) {
        // Update the isPaymentDone
        foundInvoice.isPaymentDone = true;
        // Save the changes
        await foundInvoice.save();

        return res.status(200).json({
          success: true,
          foundInvoice,
          message: "Invoice updated successfully. No due amount.",
        });
      } else {
        return res.status(200).json({
          success: true,
          invoice,
          message: "Invoice added successfully!",
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        invoice,
        message: "Invoice added successfully! but Invoice not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all vincoice of today 
export const allInvoice = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the beginning of the next day
  try {
    //find all the task in db
    const invoices = await GenerateInvoice.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
  

    return res.status(200).json({
      success: true,
      message: "All Todays Invoice fetched successfully!",
      invoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all invoice history
export const getAllInvoiceHistory = async(req, res)=>{
  try {
    //find all the task in db
    const invoicesHistory = await GenerateInvoice.find({});
  

    return res.status(200).json({
      success: true,
      message: "All Invoice fetched successfully!",
      invoicesHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}