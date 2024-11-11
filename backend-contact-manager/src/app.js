import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN
// }))

app.use(cors({
    origin: 'http://localhost:5173',  // Replace with your frontend origin
    methods: ['Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Access-Control-Allow-Headers', 'Content-Type', 'Authorization'],  // Allow specific headers
    credentials: true
}));

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(express.static("public"))

app.use(cookieParser())


// user routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)

// contact routes import
import contactRouter from "./routes/contact.routes.js"

//routes declaration
app.use("/api/v1/contacts", contactRouter)

export default app