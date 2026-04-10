import bcrypt from "bcrypt";
import sql from "mssql/msnodesqlv8.js";
import nodemailer from "nodemailer"

const hashPassword = async (password) => {
  const saltRound = 12;
  return await bcrypt.hash(password, saltRound);
};

const createUser = async (user) => {
  try {
    const pool = await sql.connect();

    const result = await pool
      .request()
      .input("full_name", sql.VarChar(100), user.full_name)
      .input("email", sql.VarChar(255), user.email)
      .input("password", sql.VarChar(255), user.password)
      .input("mobile_number", sql.VarChar(10), user.mobile_number)
      .input("date_of_birth", sql.Date, user.date_of_birth)
      .input("state", sql.VarChar(255), user.state)
      .input("district", sql.VarChar(255), user.district)
      .input("address", sql.VarChar(255), user.address)
      .input("otp_hash", sql.VarChar(255), user.hashedOTP) 
      .input("pincode", sql.VarChar(6), user.pincode)
      .query(`
        INSERT INTO users 
        (full_name, email, password, mobile_number, date_of_birth, state, district, address, pincode)
        VALUES
        (@full_name, @email, @password, @mobile_number, @date_of_birth, @state, @district, @address, @pincode)
      `);

    return result;
  } catch (error) {
    console.error("Error while creating user " + error);
    throw error;
  }
};

const registerFactory = async (factoryData, documentPaths) => {
    try {
        const pool = await sql.connect();
        const result = await pool
            .request()
            .input("user_id", sql.UniqueIdentifier, factoryData.user_id)
            .input("factory_name", sql.VarChar(200), factoryData.factory_name)
            .input("factory_address", sql.VarChar(500), factoryData.factory_address)
            .input("factory_pincode", sql.VarChar(6), factoryData.factory_pincode)
            .input("industry_type", sql.VarChar(50), factoryData.industry_type)
            .input("owner_name", sql.VarChar(100), factoryData.owner_name)
            .input("owner_aadhar", sql.VarChar(12), factoryData.owner_aadhar)
            .input("owner_pan", sql.VarChar(10), factoryData.owner_pan)
            .input("worker_count", sql.Int, factoryData.worker_count)
            .input("factory_area_sqft", sql.Decimal(10, 2), factoryData.factory_area_sqft)
            .input("established_year", sql.Int, factoryData.established_year)
            // ✅ Document paths as individual columns
            .input("aadhar_doc", sql.VarChar(500), documentPaths.aadhar_doc)
            .input("pan_doc", sql.VarChar(500), documentPaths.pan_doc)
            .query(`
                INSERT INTO register_applications 
                (
                    user_id, factory_name, factory_address, factory_pincode,
                    industry_type, owner_name, owner_aadhar, owner_pan,
                    worker_count, factory_area_sqft, established_year,
                    aadhar_doc, pan_doc
                )
                OUTPUT INSERTED.application_id
                VALUES
                (
                    @user_id, @factory_name, @factory_address, @factory_pincode,
                    @industry_type, @owner_name, @owner_aadhar, @owner_pan,
                    @worker_count, @factory_area_sqft, @established_year,
                    @aadhar_doc, @pan_doc
                )
            `);

        return result.recordset[0].application_id;

    } catch (error) {
        console.log("Error while registering factory: " + error);
        throw error;
    }
};

const factoryPlan = async (factoryPlanData, documentPath) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input("user_id", sql.UniqueIdentifier, factoryPlanData.user_id)
            .input("plan_title", sql.VarChar(200), factoryPlanData.plan_title)
            .input("plan_description", sql.VarChar(sql.MAX), factoryPlanData.plan_description)
            .input("machinery_list", sql.NVarChar(sql.MAX), JSON.stringify(factoryPlanData.machinery_list))
            .input("power_requirement_kw", sql.Decimal(10, 2), factoryPlanData.power_requirement_kw)
            .input("water_requirement_liters", sql.Decimal(10, 2), factoryPlanData.water_requirement_liters)
            .input("waste_management_plan", sql.VarChar(sql.MAX), factoryPlanData.waste_management_plan)
            .input("blueprint_document", sql.VarChar(500), documentPath.blueprint_document)
            .input("noc_document", sql.VarChar(500), documentPath.noc_document ?? null)
            .query(`
                INSERT INTO factory_plans
                (
                    user_id,
                    plan_title, plan_description, machinery_list,
                    power_requirement_kw, water_requirement_liters, waste_management_plan,
                    blueprint_document, noc_document
                )
                OUTPUT INSERTED.factory_plan_id
                VALUES
                (
                    @user_id,
                    @plan_title, @plan_description, @machinery_list,
                    @power_requirement_kw, @water_requirement_liters, @waste_management_plan,
                    @blueprint_document, @noc_document
                )
            `);

        return result.recordset[0].factory_plan_id;

    } catch (error) {
        console.error("Error while saving factory plan:", error);
        throw error;
    }
};

const factoryLicencing = async(factoryLicenceData, documentsPath)=> {
    try {
        const pool = await sql.connect(); 
    
        const result = await pool.request()
                                 .input("user_id",sql.UniqueIdentifier,factoryLicenceData.user_id)
                                 .input("license_type",sql.VarChar(55),factoryLicenceData.license_type)
                                 .input("requested_license_duration",sql.VarChar(55),factoryLicenceData.requested_license_duration)
                                 .input("applicant_designation", sql.VarChar(100),factoryLicenceData.applicant_designation)
                                //  .input("declaration_accepted", sql.Bit,factoryLicenceData.declaration_accepted )
                                 .input("declaration_accepted", sql.Bit, factoryLicenceData.declaration_accepted === "true" ? 1 : factoryLicenceData.declaration_accepted ? 1 : 0)
                                 .input("fee_payment_reference",sql.VarChar(50), factoryLicenceData.fee_payment_reference)
                                 .input("affidavit_document", sql.VarChar(500),  documentsPath.affidavit_document)
                                 .input("photo_identity_document", sql.VarChar(100), documentsPath.photo_identity_document)
                                 .query(
                                    `INSERT INTO factory_licence
                                    (user_id,  license_type, requested_license_duration, applicant_designation, declaration_accepted, fee_payment_reference, affidavit_document, photo_identity_document)
                                    OUTPUT INSERTED.factory_licence_id 
                                    VALUES 
                                    (@user_id, @license_type, @requested_license_duration, @applicant_designation, @declaration_accepted, @fee_payment_reference, @affidavit_document, @photo_identity_document)
                                    `
                                 )
            return result.recordset[0].factory_licence_id;

    } catch (error) {
        console.log("Error while lincencing factory", error)
        throw new Error("Error while lincencing factory", error)
    }
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const hashOTP = async(otp)=> {
    const saltRound = 10;
  return  await bcrypt.hash(otp.toString(), saltRound)

}
const saveOTP = async (email, otpHash) => {
  const pool = await sql.connect();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.request()
    .input("email", sql.VarChar(255), email)
    .input("otp_hash", sql.VarChar(255), otpHash) // ✅ FIXED
    .input("expires_at", sql.DateTime, expiresAt)
    .query(`
      INSERT INTO email_verifications (email, otp_hash, expires_at)
      VALUES (@email, @otp_hash, @expires_at)
    `);
};
// const saveOTP = async(email,otpHash)=> {
//     const pool = await sql.connect();
//     const expiresAt = new Date(Date.now()+ 15*60*1000)
//     await pool.request()
//               .input("email", sql.VarChar(255), email)
//               .input("hashOtp", sql.VarChar(255), otpHash)
//               .input("expires_at", sql.DateTime, expiresAt)
//               .query(`
//                 INSERT INTO emial_verification (email, otp_hash, expires_at)
//                 VALUES (@email, @otp_hash, @expires_at)
//                 `)

// }

const sendOtpEmail = async(email,otp)=> {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            password : process.env.EMAIL_PASSWORD
        }
    })
    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : email,
        subject : "Your OTP Code",
        text: `Your verification code is ${otp}. It expires in 15 minutes.`
    })
}

export { hashPassword, createUser, generateOTP, saveOTP,hashOTP,sendOtpEmail, registerFactory, factoryPlan ,factoryLicencing};
