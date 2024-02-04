import { BuyerDetails } from "../model/buyerDetails.js";
import { ProductDetails } from "../model/itemsDetails.js";
import { Stock } from "../model/stock.js";



//add new item
export const newItems = async (req, res) => {
  try {
    //extract id from params and body
    const { id } = req.params;
    const {invoiceId, itemList, totalAmount, paidAmount, dueAmount, paymentMode } =
      req.body;
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
        const productQntyNumber = parseInt(productQnty, 10);

        // Update the productQnty in the foundStock
        foundStock.productQnty -= productQntyNumber;

        // Save the updated stock
        await foundStock.save();
      } else {
        return res.status(400).json({
          success: false,
          message: `Stock with stockId ${stockId} not found.`
        })
      }
    }

    //check user exist or not in db
    const user = await BuyerDetails.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    //check the item data
    if (!invoiceId || !totalAmount || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "all field are required!",
      });
    }

   
    //create entry on db
    const items = await ProductDetails.create({
      invoiceId,
      itemList,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMode,
      buyerId: user._id,
    });

    return res.status(200).json({
      success: true,
      items,
      message: "item added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
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


//get all the items
export const allItems =async(req, res)=>{
    try {
        const {id} = req.params
    
        //find all the task in db
        const items = await ProductDetails.find({buyerId:id})

       
      
       return res.status(200).json({
          success: true,
          message: "all item fetched successfully!",
          items,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}
