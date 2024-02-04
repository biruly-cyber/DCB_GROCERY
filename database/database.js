
import mongoose from "mongoose";

// connect mongoDB
export const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        dbName: "DCB_GROCERY",
      })
      .then(() => console.log("Database Connected"))
      .catch((e) => console.log(e));
  };
  