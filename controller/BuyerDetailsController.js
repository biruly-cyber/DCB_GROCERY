import mongoose from "mongoose";
import { BuyerDetails } from "../model/buyerDetails.js";

//new buyer details
export const newBuyerDetails = async (req, res) => {
  try {
   
    const {
      name,
      address,
      phoneNumber,
      isPaymentDone,
      totalAmount,
      totalDueAmount,
    } = req.body;

   

    //check the details or validation
    if (!name || !address || !phoneNumber) {
      return res.status(204).json({
        success: false,
        message: "all field are required",
      });
    }


    //create entry on db
    const data = await BuyerDetails.create({
      name,
      address,
      phoneNumber,
      isPaymentDone,
      totalAmount,
      totalDueAmount,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "buyer details added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message: error
    })
  }
};

export const getAllBuyer = async (req, res) => {
  try {
    const data = await BuyerDetails.find({});

    return res.status(200).json({
      success: true,
      data,
      message: "data fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error
    })
  }
};

//delete  this buyer
export const deleteBuyerDetails = async (req, res) => {
  try {
    // Fetch the id from the request parameters
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    // Delete data from the database based on the '_id' field
    const deletion = await BuyerDetails.deleteOne({ _id: id });

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
      message: error.message,
    });
  }
};

//update the buyer details
export const updateBuyersDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // fetch data from req body
    const { name, address, phoneNumber } = req.body;

    // find the user
    const user = await BuyerDetails.findById(id);

   

    if (!user) {
      return res.status(204).json({
        success: false,
        message: "User not found!",
      });
    }

    const buyerName = !name ? user.name : name;
    const buyerAddress = !address ? user.address : address;
    const phone = !phoneNumber ? user.phoneNumber : phoneNumber;


    // Update the fields
    if (buyerName) user.name = buyerName;
    if (buyerAddress) user.address = buyerAddress;
    if (phone) user.phoneNumber = phone;

    // Save the updated user
    await user.save();
    return res.status(200).json({
      success: true,
      message: "update successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get spefic buyer
export const customerDetails = async(req, res) => {
  //get id from params
  const { id } = req.params;

  try {
    //validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user not exist",
      });
    }

    //if exist
    const customer = await BuyerDetails.findById(id);

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "user not exist in db",
      });
    }

    return res.status(200).json({
      success: true,
      message: "fetched user details",
      customer,
    });
  } catch (error) {
     return res.status(500).json({
      success:false,
      message: error
     })
  }
};
