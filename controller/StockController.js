import { StockHistory } from "../model/StockHistory.js";
import { Stock } from "../model/stock.js";

//create new stock
export const newStock = async (req, res) => {
  try {
    //extract data from body
    const {
      productName,
      productExpireDate,
      productUnitType,
      kharidAmount,
      productQnty,
      productCategory,
      wholesaleAmount,
      retailAmount,
      distributerName,
    } = req.body;

    //check the element
    if (
      !productName ||
      !productExpireDate ||
      !productUnitType ||
      !kharidAmount ||
      !productQnty ||
      !wholesaleAmount ||
      !retailAmount ||
      !productCategory||
      !distributerName
    ) {
      return res.status(400).json({
        success: false,
        message: "all field are required!",
      });
    }

   
    //assign productId
    const min = 1000000; // Minimum 7-digit number
    const max = 9999999; // Maximum 7-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const nextInvoiceId = `DSSTOCK${randomNumber}`;
    const stockId = nextInvoiceId;

    //calculate wholesale amount
    const totalAmount = productQnty * kharidAmount;


    //create entry on db
    const stock = await Stock.create({
      stockId,
      productName,
      productExpiryDate: productExpireDate,
      productUnitType,
      kharidAmount,
      productQnty,
      productCategory,
      totalAmount,
      wholesaleAmount,
      retailAmount,
      distributerName,
      submittedBy: req.user
    });

    
    //create entry on db
    await StockHistory.create({
      stockId,
      productName,
      productExpiryDate: productExpireDate,
      productUnitType,
      kharidAmount,
      productQnty,
      productCategory,
      totalAmount,
      wholesaleAmount,
      retailAmount,
      distributerName,
      submittedBy: req.user
    });

    return res.status(200).json({
      success: true,
      stock,
      message: "stock created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update existing stock
export const updateStock = async (req, res) => {
  //extract id
  const { id } = req.params;

  const {
    productName,
    productExpireDate,
    productUnitType,
    kharidAmount,
    productQnty,
    productCategory,
    wholesaleAmount,
    retailAmount,
    distributerName,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    

    // Find the stock and update
    const foundStock = await Stock.findById(id);
    const data = await StockHistory.find({stockId: foundStock.stockId});

    const foundStockHistory = data[0]


    if (!foundStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

   

    // Update only if the fields exist in the request body
    if (productName) foundStock.productName = productName;
    if (productExpireDate) foundStock.productExpiryDate = productExpireDate;
    if (productUnitType) foundStock.productUnitType = productUnitType;
    if (productQnty) foundStock.productQnty = productQnty;
    if (wholesaleAmount) foundStock.wholesaleAmount = wholesaleAmount;
    if (kharidAmount) foundStock.kharidAmount = kharidAmount;
    if (retailAmount) foundStock.retailAmount = retailAmount;
    if (productCategory) foundStock.productCategory = productCategory;
    if (distributerName) foundStock.distributerName = distributerName;

    const tAmount = kharidAmount * productQnty
    foundStock.totalAmount = tAmount;
    foundStock.submittedBy = req.user

    //update history stock
    //  Update only if the fields exist in the request body
     if (productName) foundStockHistory.productName = productName;
     if (productExpireDate) foundStockHistory.productExpiryDate = productExpireDate;
     if (productUnitType) foundStockHistory.productUnitType = productUnitType;
     if (productQnty) foundStockHistory.productQnty = productQnty;
     if (wholesaleAmount) foundStockHistory.wholesaleAmount = wholesaleAmount;
     if (kharidAmount) foundStockHistory.kharidAmount = kharidAmount;
     if (retailAmount) foundStockHistory.retailAmount = retailAmount;
     if (productCategory) foundStockHistory.productCategory = productCategory;
     if (distributerName) foundStockHistory.distributerName = distributerName;
 
     const tAmountHistory = kharidAmount * productQnty
     foundStockHistory.totalAmount = tAmountHistory;
     foundStockHistory.submittedBy = req.user
 
   // foundStock.totalAmount = totalAmount

    // Save changes to the database
    const updateStockDetails = await foundStock.save();
    const updateStockDetailsHistory = await foundStockHistory.save();

    // Return success response
    return res.status(200).json({
      success: true,
      updateStockDetails,
      // updateStockDetailsHistory,
      message: "Updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete the stock
export const deleteStock = async (req, res) => {
  // extract id from params
  const { id } = req.params;

  try {
    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    //find all the task in db
    const stock = await Stock.findById(id);

    //delete the stock
    await stock.deleteOne();

    return res.status(200).json({
      success: true,
      message: " task deleted successfully!",
      stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//handle for all stock
export const getAllStock = async (req, res) => {
  try {
    //find all the task in db
    const stocks = await Stock.find({  });

    res.status(200).json({
      success: true,
      message: "all stocks fetched successfully!",
      stocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get details from id
export const getStockById = async(req, res)=>{
  const {id} = req.params
  try {
    // check is valid or not 
    if(!id){
      return res.status(400).json({
        success:false,
        message:"Invalid Id"
      })
    }
    //find all the task in db
    const specificStock = await Stock.findById(id);

    res.status(200).json({
      success: true,
      message: "Stocks found successfully!",
      specificStock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// get all stock historyupdate 
export const getStockHistory = async(req, res)=>{
  try {
    //find all the task in db
    const stocks = await StockHistory.find({  });

    res.status(200).json({
      success: true,
      message: "all stocks History fetched successfully!",
      stocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


