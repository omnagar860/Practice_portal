// ROutes and middlewares
import express from "express";
import userRouter from "./routes/user.routes"


const app = express();


app.get("/api/users",userRouter )


