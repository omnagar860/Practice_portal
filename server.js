import dotenv from "dotenv";
dotenv.config({path : "./.env"})
import express from "express"

import userRouter from "./src/routes/user.routes.js";
import formRouter from "./src/routes/forms.router.js"
import { connectDB } from "./src/utils/db.js";

const app = express();
await connectDB()
app.use(express.json())

const PORT = process.env.PORT || 8080;

app.use("/api/users",userRouter )
app.use("/api/form", formRouter)

app.listen(PORT, ()=> {
    console.log(`Server is listening at port ${PORT}`)
})