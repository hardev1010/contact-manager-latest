import app from "./app.js"
import connectDB from "./db/index.js"

import 'dotenv/config'

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is starting at port: ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MONGODB connection failed!!!", err);
})