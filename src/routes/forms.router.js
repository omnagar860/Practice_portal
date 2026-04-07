import express from "express";
import {  factoryResgistrationForm } from "../controllers/form.controller.js";

const router = express.Router();



router.post("/register", factoryResgistrationForm);


export default router