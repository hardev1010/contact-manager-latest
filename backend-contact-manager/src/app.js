import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN
// }))

app.use(cors({
    origin: 'https://contact-manager-2268.onrender.com',  // Replace with your frontend origin
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
    credentials: true
}));



app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(express.static("public"))

app.use(cookieParser())

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});



// user routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/users", userRouter)

// contact routes import
import contactRouter from "./routes/contact.routes.js"

//routes declaration
app.use("/contacts", contactRouter)

export default app