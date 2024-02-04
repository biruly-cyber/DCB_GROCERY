import { KhataCustomerPaymentHistory } from "../model/khataCustomerPaymentHistory.js"
import { BuyerDetails } from "../model/buyerDetails.js"

// newPayment 
export const khataCustomerPaymentHistory = async(req, res)=>{
    const {id} = req.params 

    
    const {paymentType, lastPaymentAmount} = req.body 


    try {
        // validation
        if(!id){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        } 

        if(!paymentType || !lastPaymentAmount){
            return res.status(400).json({
                success:false,
                message:"all field required"
            })
        }


        //fetch the data from id and update their dueAmount first
        const foundUser = await BuyerDetails.findById(id)

        // console.log(foundUser)
        let dueAmount = 0

     


        if(lastPaymentAmount <= foundUser.totalDueAmount){
            //update due amount 
            dueAmount = foundUser.totalDueAmount - lastPaymentAmount
            // update the is payment done or not 
            dueAmount === 0 ? foundUser.isPaymentDone = true : foundUser.isPaymentDone = false

        }else{
            return res.status(400).json({
                success:false,
                message: "please enter valid amount"
            })
        }
        
        // check last amount 
        foundUser.totalDueAmount = dueAmount

        // save change on the db 
        foundUser.save()



        // now create the record on db 

        const payment = await KhataCustomerPaymentHistory.create({
            buyerId : foundUser._id,
            lastPaymentAmount,
            paymentType
        })

        return res.status(200).json({
            success:true,
            payment,
            message:"Payment Added successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "invalid Request"
        })
    }
}

//update payment
export const updatePaymentHistory = async(req, res)=>{
    const {id} =  req.params 
    const {paymentType, lastPaymentAmount} =  req.body 

    try {
        // validation 
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Document not found"
            })
        }

        if(!paymentType || !lastPaymentAmount){
            return res.status(400).json({
                success:false,
                message:"all field required"
            })
        }

        //fetch the payment history 
        const paymentHistory = await KhataCustomerPaymentHistory.findById(id)

        if(!paymentHistory){
            return res.status(400).json({
                success: false,
                message: "Document not found"
            })
        }

        paymentHistory.paymentType = paymentType
        paymentHistory.lastPaymentAmount = lastPaymentAmount

        // save change in db 
        paymentHistory.save()

        return res.status(200).json({
            success: true,
            message: "Payment History Updated Successfully!"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Payment History not found"
        })
    }
}


//get all payment history
export const getAllPaymentHistoryOfSpecificCustomer = async(req, res)=>{
    const {id} = req.params 
    try {
        //VALIDATION 
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Request is not valid"
            })
        }

        //get all data from data base
        const paymentHistory = await KhataCustomerPaymentHistory.find({buyerId: id})

        if(!paymentHistory){
            return res.status(400).json({
                success:false,
                message: "Buyer Id not found"
            })
        }


        return res.status(200).json({
            success:true,
            paymentHistory,
            message:"All Payment History fetched Successfully!"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"History Not Found!"
        })
    }
}