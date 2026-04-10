import express from "express";
import {  factoryLicence, factoryPlanForm, factoryResgistrationForm } from "../controllers/form.controller.js";
import {  uploadDocs, uploadLicenceDocs, uploadPlanDocs } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register",uploadDocs,  factoryResgistrationForm);
router.post("/plan", uploadPlanDocs,factoryPlanForm );
router.post("/licence",uploadLicenceDocs  ,factoryLicence);


export default router