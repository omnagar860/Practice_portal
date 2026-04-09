import express from "express";
import {  factoryPlanForm, factoryResgistrationForm } from "../controllers/form.controller.js";
import {  uploadDocs, uploadPlanDocs } from "../middlewares/multer.js";

const router = express.Router();



// router.post("/register",upload.array("documents", 5),  factoryResgistrationForm);
router.post("/register",uploadDocs,  factoryResgistrationForm);
router.post("/plan", uploadPlanDocs,factoryPlanForm );


export default router