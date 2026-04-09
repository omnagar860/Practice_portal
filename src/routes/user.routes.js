import express from "express";
import {  userRegister, userlogin } from "../controllers/user.controller.js";


const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userlogin);



export default router