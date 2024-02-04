import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config({
  path: './data/.env'
});
 
export const sendCookie =(user, res, message, statusCode = 200)=>{
     // Generate a JSON Web Token (JWT)
     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

     // Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			
			res.cookie("token", token, options).status(statusCode).json({
				success: true,
				token,
				user,
				message: `${message}`,
			});
}