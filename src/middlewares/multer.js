// import multer from "multer";

// //store data at local

// const storage = multer.diskStorage({
//     destination : (req,file,cb)=> {
//         cb(null, "../public")
//     },
//     filename : (req,file,cb)=> {
//         const fileName = Date.now()+ "-" + file.originalname;
//         cb(null, fileName)
//     }
// })

// const fileFilter = (req,file,cb) => {
//     if(file.mimetype === "application/pdf") {
//         cb(null, true)
//     }else {
//         cb(new Error("Only PDF file are allowed"), false)
//     }
// }

//  const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 5*1024*1024
//     }
// })

// export const uploadDocs = upload.fields([
//      { name: "aadhar_doc", maxCount: 1 },
//     { name: "pan_doc", maxCount: 1 },
//     { name: "building_plan_doc", maxCount: 1 },
//     { name: "gst_certificate_doc", maxCount: 1 }, 
//     { name: "msme_certificate_doc", maxCount: 1 }, 
// ])

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ✅ Needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Absolute path to public folder
const uploadDir = path.join(__dirname, "../../public");

// ✅ Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ✅ Use absolute path
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export const uploadDocs = upload.fields([
    { name: "aadhar_doc", maxCount: 1 },
    { name: "pan_doc", maxCount: 1 }
]);

export const uploadPlanDocs = upload.fields([
    {name : "blueprint_document", maxCount: 1},
    {name : "noc_documents", maxCount: 1},
])