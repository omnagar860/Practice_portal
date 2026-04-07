import { isEmpty } from "../middlewares/middlewares.js";

const factoryResgistrationForm = async (req, res) => {
  try {
    const {
      factory_name,
      factory_address,
      factory_pincode,
      industAry_type,
      owner_name,
      owner_aadhar,
      owner_pan,
      worker_count,
      factory_area_sqft,
      established_year,
    } = req.body;
    const isAnyFieldEmpty = Object.values(fields).some(field=> !field || isEmpty(field))
    if(isAnyFieldEmpty){
        return res.status(400).json({message : "All fields are required"})
    }
  } catch (error) {}
};

export { factoryResgistrationForm };
