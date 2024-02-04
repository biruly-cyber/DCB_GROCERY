import { BuyerDetails } from "../model/buyerDetails.js";
import { KhataInvoices } from "../model/customerKhata.js";
import { ProductDetails } from "../model/itemsDetails.js";
import { Stock } from "../model/stock.js";

//add new item
export const newKhataInvoice = async (req, res) => {
  //extract id from params and body
  const { id } = req.params;

  try {
    const {
      invoiceId,
      itemList,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMode,
    } = req.body;

    // console.log(req.body)
    //validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is empty",
      });
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
        return res.staus(404).status({
          success:false,
          message: `Stock with stockId ${stockId} not found.`
        })
      }
    }

    // Check all the fields and if items, quantities, prices are arrays
    if (!invoiceId || !totalAmount || !paymentMode) {
      return res.status(400).json({
        success: false,
        message:
          "All fields required and items, quantities, prices must be arrays!",
      });
    }

    let isPaymentDone = false;

    dueAmount === 0 ? (isPaymentDone = true) : (isPaymentDone = false);

    // find the user
    const user = await BuyerDetails.findById(id);
    // console.log(user)

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "user not found",
      });
    }

    // search previous dueAmount and and latest one

    // console.log(user.totalDueAmount)

    const dueAmountOfBuyer = dueAmount + user.totalDueAmount;

    const totalAmountOfBuyer = totalAmount + user.totalAmount;

    user.totalDueAmount = dueAmountOfBuyer;
    user.totalAmount = totalAmountOfBuyer;
    user.save();


    // // Create entry in the database
    const khataInvoice = await KhataInvoices.create({
      invoiceId,
      itemList,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMode,
      isPaymentDone,
      buyerId: user._id,
    });

  

    return res.status(200).json({
      success: true,
      khataInvoice,
      message: "Invoice added successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update item details
export const itemUpdate = async (req, res) => {
  try {
    // extract details from params and body
    const { id } = req.params;
    const { itemName, itemPrice, itemQty, itemUnit } = req.body;

    //validation
    if (!id) {
      return res.status(204).json({
        success: false,
        message: "Id is empty",
      });
    }

    //check item exist or not
    const item = await ProductDetails.findById(id);

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "item does not exist",
      });
    }

    //check item details epty or not
    if (!itemName || !itemPrice || !itemQty) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    const itemNewName = !itemName ? item.itemName : itemName;
    const itemNewPrice = !itemPrice ? item.itemPrice : itemPrice;
    const itemNewQnty = !itemQty ? item.itemQty : itemQty;
    const itemNewUnit = !itemUnit ? item.itemUnit : itemUnit;

    if (itemNewName) item.itemName = itemNewName;
    if (itemNewPrice) item.itemPrice = itemNewPrice;
    if (itemNewQnty) item.itemQty = itemNewQnty;
    if (itemNewUnit) item.itemUnit = itemNewUnit;

    item.itemTotolAmount = itemNewPrice * itemNewQnty;

    const itemDetails = await item.save();

    return res.status(200).json({
      success: true,
      itemDetails,
      message: "item updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

//delete item from the itemDetails
export const deleteItem = async (req, res) => {
  try {
    //extract id from params
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    // Delete data from the database based on the '_id' field
    const deletion = await ProductDetails.deleteOne({ _id: id });

    if (deletion.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Deleted successfully!",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No document found with the provided ID.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

//get all invoice from khata today only
export const allInvoiceFromKhata = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the beginning of the next day
  try {
    //find all the task in db
    const khataInvoices = await KhataInvoices.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All Invoice fetched successfully!",
      khataInvoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all the items from specific id
export const allIKhataInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    //find all the task in db
    const khataInvoice = await KhataInvoices.find({ buyerId: id });

    // console.log(items)

    return res.status(200).json({
      success: true,
      message: "all item fetched successfully!",
      khataInvoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all khata invoice history

export const invoiceHistory = async(req, res)=>{
  try {
    //find all the task in db
    const khataInvoices = await KhataInvoices.find({});

    return res.status(200).json({
      success: true,
      message: "All khata Invoice history fetched successfully!",
      khataInvoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
