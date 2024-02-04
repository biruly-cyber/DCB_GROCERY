import {app} from "../backend/app.js"
import {connectDB} from "./database/database.js"

const PORT = process.env.PORT || 5000
//connet db
connectDB();


app.listen(PORT, ()=>{
    console.log(`server is wprking on port ${PORT} in ${process.env.NODE_ENV} mode `);  
})