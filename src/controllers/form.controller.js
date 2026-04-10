import fs from "fs";
import {
  hasInvalidSpecialChar,
  isEmpty,
  isValidAadhar,
  isValidPAN,
  maxLength,
  minLength,
  validateFiles,
} from "../middlewares/middlewares.js";
import { factoryLicencing, factoryPlan, registerFactory } from "../utils/utils.js";

const validFactoryType = [
  "manufacturing",
  "chemical",
  "textile",
  "food_processing",
  "pharmaceutical",
  "other",
];

function isValidFactoryType(value) {
  if (!validFactoryType.includes(value?.toLowerCase())) {
    return "Please select a valid industry type";
  }
  return null;
}

const factoryResgistrationForm = async (req, res) => {
  try {
    const {
      factory_name,
      factory_address,
      factory_pincode,
      industry_type,
      owner_name,
      owner_aadhar,
      owner_pan,
      worker_count,
      factory_area_sqft,
      established_year,
    } = req.body;

    // ✅ req.files is an object when using upload.fields()
    const {
      aadhar_doc,
      pan_doc,
    } = req.files;

    // ✅ Flatten all file arrays into one array
    const allFiles = Object.values(req.files).flat();

    const fields = {
      factory_name,
      factory_address,
      factory_pincode,
      industry_type,
      owner_name,
      owner_aadhar,
      owner_pan,
      worker_count,
      factory_area_sqft,
      established_year,
    };

    // Check empty fields
    const isAnyFieldEmpty = Object.values(fields).some(
      (field) => !field || isEmpty(field),
    );
    if (isAnyFieldEmpty) {
      // ✅ Cleanup uploaded files if validation fails
      allFiles.forEach((file) => fs.unlinkSync(file.path));
      return res.status(400).json({ message: "All fields are required" });
    }

    let error;

    error =
      minLength(3, factory_name) ||
      maxLength(200, factory_name) ||
      hasInvalidSpecialChar(factory_name);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error = minLength(10, factory_address) || maxLength(200, factory_address);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    if (!/^\d{6}$/.test(factory_pincode)) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    error = isValidFactoryType(industry_type);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error = minLength(3, owner_name) || maxLength(100, owner_name);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error = isValidAadhar(owner_aadhar);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error = isValidPAN(owner_pan);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error =
      worker_count >= 1 && worker_count <= 1000
        ? null
        : "No. of workers must be between 1 and 1000";
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error =
      Number(factory_area_sqft) > 100
        ? null
        : "Factory area must be minimum 100 sq. ft.";
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    error =
      established_year >= 1900 && established_year <= new Date().getFullYear()
        ? null
        : "Established year must be between 1900 and current year";
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    // ✅ Pass flattened array to validateFiles
    error = validateFiles(allFiles,5);
    if (error) {
      allFiles.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({ message: error });
    }

    // ✅ Extract paths from flattened array
    // const documentsPaths = allFiles.map(file => file.path);
    const documentsPaths = {
      aadhar_doc: aadhar_doc?.[0]?.path ?? null,
      pan_doc: pan_doc?.[0]?.path ?? null,
    };

    const user_id = "11111111-1111-1111-1111-111111111111";

    const factoryData = {
      user_id,
      factory_name,
      factory_address,
      factory_pincode,
      industry_type,
      owner_name,
      owner_aadhar,
      owner_pan,
      worker_count,
      factory_area_sqft,
      established_year,
    };

    const factory_registraction_application_id = await registerFactory(
      factoryData,
      documentsPaths,
    );

    res.status(201).json({
      message: "Factory registered successfully.",
      factory_application_id: factory_registraction_application_id,
    });
  } catch (error) {
    console.error("Error while registering factory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const factoryPlanForm = async (req, res) => {
    try {
        const {
            register_application_id,   // ✅ added
            plan_title,
            plan_description,
            machinery_list,
            power_requirement_kw,
            water_requirement_liters,
            waste_management_plan
        } = req.body;

        const user_id = "11111111-1111-1111-1111-111111111111"; // ✅ hardcoded for now

        let error;

        error = minLength(5, plan_title) || maxLength(200, plan_title);
        if (error) return res.status(400).json({ message: error });

        error = minLength(50, plan_description) || maxLength(2000, plan_description);
        if (error) return res.status(400).json({ message: error });

        let parsedMachineryList = machinery_list;
        if (machinery_list && !Array.isArray(machinery_list)) {
            parsedMachineryList = Object.values(machinery_list);
        }

        if (!Array.isArray(parsedMachineryList) || parsedMachineryList.length === 0) {
            return res.status(400).json({ message: "Machinery list must be a non empty array." });
        }

        for (let i = 0; i < parsedMachineryList.length; i++) {
            const item = parsedMachineryList[i];

            if (!item.name || typeof item.name !== "string") {
                return res.status(400).json({ message: `Machinery ${i + 1}: Name is required.` });
            }
            if (!item.quantity || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
                return res.status(400).json({ message: `Machinery ${i + 1}: Quantity must be positive.` });
            }
            if (!item.power_kw || isNaN(Number(item.power_kw)) || Number(item.power_kw) <= 0) {
                return res.status(400).json({ message: `Machinery ${i + 1}: Power must be positive.` });
            }
        }

        if (!power_requirement_kw || isNaN(power_requirement_kw) || Number(power_requirement_kw) >= 50000) {
            return res.status(400).json({ message: "Power requirement must not exceed 50000 limit." });
        }

        if (!water_requirement_liters || isNaN(water_requirement_liters) || Number(water_requirement_liters) <= 0) {
            return res.status(400).json({ message: "Water requirement must be positive." });
        }

        if (!waste_management_plan || typeof waste_management_plan !== "string" || waste_management_plan.trim().length < 50) {
            return res.status(400).json({ message: "Waste management plan must be at least 50 characters." });
        }

        const { blueprint_document, noc_documents } = req.files;
        const allFiles = Object.values(req.files).flat();

        error = validateFiles(allFiles, 2);
        if (error) {
            allFiles.forEach(f => fs.unlinkSync(f.path));  // ✅ fs.unlinkSync not f.unlinkSync
            return res.status(400).json({ message: error });
        }

        // ✅ flat object not array of objects
        const documentsPath = {
            blueprint_document: blueprint_document?.[0]?.path ?? null,
            noc_document: noc_documents?.[0]?.path ?? null
        };

        const factoryPlanData = {
            user_id,
            register_application_id,
            plan_title,
            plan_description,
            machinery_list: parsedMachineryList,
            power_requirement_kw: Number(power_requirement_kw),
            water_requirement_liters: Number(water_requirement_liters),
            waste_management_plan
        };

        const planId = await factoryPlan(factoryPlanData, documentsPath);

        res.status(201).json({
            message: "Factory plan submitted successfully.",
            factory_plan_id: planId,
        });

    } catch (error) {
        console.error("Error in factoryPlanForm:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const licence_type = [
  "factory",
  "boiler",
  "combined"
]
const isValidLicenceType = (license_type)=> {
  if(!licence_type.includes(license_type?.toLowerCase())){
    return `Please select a valid licence type.`
  }
  return null
}

const VALID_DURATIONS = ['1_year', '3_year', '5_year'];

const isValidDuration = (requested_license_duration)=> {
  if(!VALID_DURATIONS.includes(requested_license_duration)) {
    return  "requested_license_duration must be one of: 1_year, 3_year, 5_year"
  }
  return null
}
const factoryLicence = async(req,res)=> {
  try {
    const user_id = "11111111-1111-1111-1111-111111111111";
    const {license_type,requested_license_duration, applicant_designation, declaration_accepted, fee_payment_reference}   = req.body;
    const fields = {license_type,requested_license_duration, applicant_designation, declaration_accepted, fee_payment_reference};
    let error;
    for(const[key,value ] of Object.entries(fields)) {
      error = isEmpty(value)
      if(error) {
        return res.status(400).json({message:`${key} is required`});
      }
    }
      error = isValidLicenceType(license_type);
      if(error) return res.status(400).json({message: error});

      error = isValidDuration(requested_license_duration);
      if(error) return res.status(400).json({message: error});
      
      error = minLength(3,applicant_designation) || maxLength(200,applicant_designation);
      if(error) return res.status(400).json({message: error});

      error = declaration_accepted === true ? null : declaration_accepted === "true" ? null :'You must accept the declaration'
      if(error) return res.status(400).json({message: error});

      if(!/^[a-zA-Z0-9]{1,50}$/.test(fee_payment_reference)) {
        error = `fee_payment_reference must be alphanumeric and max 50 chars`;
        return res.status(400).json({message : error})
      }

      // validation fro files
      const{affidavit_document, photo_identity_document} = req.files;
      if(!affidavit_document || affidavit_document.length ===0) {
        error= 'affidavit_document is required '
        return res.status(400).json({message:error})
      }
      if(affidavit_document[0]?.mimetype !== "application/pdf") {
        fs.unlinkSync(affidavit_document[0]?.path);
        error = "affidavit_document must be a pdf";
        return res.status(400).json({message:error})
      }
      if(affidavit_document[0]?.size > 5*1024*1024){
        error = "affidavit_document must not exceed 5MB";
        return res.status(400).json({message:error})
      }

      // validation for photo_identity_document 

      if(!photo_identity_document || photo_identity_document.length ===0) {
        error= 'photo_identity_document is required '
        return res.status(400).json({message:error})
      }
      if(photo_identity_document[0]?.mimetype !== "image/jpg" && photo_identity_document[0]?.mimetype !== "image/jpeg") {
        fs.unlinkSync(photo_identity_document[0]?.path);
        error= "photo_identity_document must be a image";
        return res.status(400).json({message:error})
      }
      if(photo_identity_document[0]?.size > 2*1024*1024){
        error = "photo_identity_document must not exceed 2MB";
        return res.status(400).json({message:error})
      }

      const factoryLicenceDocsPath = {
        affidavit_document : affidavit_document[0]?.path,
        photo_identity_document : photo_identity_document[0]?.path
      }
      const factoryLicenceData = {user_id, license_type,requested_license_duration, applicant_designation, declaration_accepted, fee_payment_reference}

      const factoryLicenceId =   await factoryLicencing(factoryLicenceData, factoryLicenceDocsPath)

      res.status(201).json({
          message: "Licence application submitted successfully.",
          factory_licence_id: factoryLicenceId
      });
  } catch (error) {
    console.log("Error while factory licence form submitting.", error);
    throw new Error("Internal Server Error : Error while factory licence form submitting.")
  }
}

export { factoryResgistrationForm, factoryPlanForm ,factoryLicence};
