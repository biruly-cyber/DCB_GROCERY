
import jwt from "jsonwebtoken"
import { User } from "../model/user.js";

export const isAuthenticated =async(req, res, next)=>{
     //extract token
  const {token} = req.cookies;

  //check token is exist or not 
  if(!token){
    return res.status(204).json({
      success:false,
      message:"login first"
    })
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET)

    //check user exist or not
  req.user = await User.findById(decode._id);
  // console.log(req.user)

  next()
}