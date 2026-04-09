// import { confirmPassword, isEmpty, isValidDOB, isValidEmail, isValidMobile, maxLength, minLength } from "../middlewares/middlewares.js";
// import { createUser, generateOTP, hashOTP, hashPassword, saveOTP, sendOtpEmail } from "../utils/utils.js";

// const userRegister = async (req, res) => {
//   try {
//     const {
//       full_name,
//       email,
//       password,
//       confirm_password,
//       mobile_number,
//       date_of_birth,
//       state,
//       district,
//       address,
//       pincode,
//     } = req.body;
//     const fields = {
//       full_name,
//       email,
//       password,
//       confirm_password,
//       mobile_number,
//       date_of_birth,
//       state,
//       district,
//       address,
//       pincode,
//     };
//     console.log("level1")
//     const isAnyFieldEmpty = Object.values(fields).some(field=> !field || isEmpty(field))
//     if(isAnyFieldEmpty){
//         return res.status(400).json({message : "All fields are required"})
//     }
//     if(minLength(3,full_name,'string')) {
//       console.log(full_name)
//          return res.status(400).json({message :  `Full Name must be at least 3 charchter long.`})
//     }
//     if(maxLength(100,full_name,'string')) {
//          return res.status(400).json({message :  `Full Name must not grater than 100 charchter long.`})
//     }
//     if(!isValidEmail(email)) {
//        return res.status(400).json({message :  `Please enter a valid email`})

//     }
//     if(minLength(8, password, "password")) {
//        return res.status(400).json({message :  `Password must contain one uppercase ,lowercase , special character and one digit`})

//     }
//     if(confirmPassword(password,confirm_password)){
//        return res.status(400).json({message :  `Password doest match.`})

//     }
//     if(isValidMobile(mobile_number)){
//        return res.status(400).json({message :`Please enter a valid mobile number`})
//     }
//     if(isValidDOB(date_of_birth)){
//        return res.status(400).json({message :`Applicant must be 18 years ols or elder.`})

//     }
//     if(minLength(10,address,'string')){
//        return res.status(400).json({message :`Address must be at least 10 characters long.`})

//     }
//     if(maxLength(100,address,'string')){
//        return res.status(400).json({message :`Address must not be grater than 100 characters.`})

//     }
//     if(minLength(6,pincode,'string')){
//        return res.status(400).json({message :`Pincode must be 6 digit long.`})

//     }
//     console.log("level2")
//     const hashedPassword = await hashPassword(password)
//     const userToBeCreate = {
//         full_name,
//         email,
//         password : hashedPassword,
//         mobile_number,
//         date_of_birth,
//         state,
//         district,
//         address,
//         pincode
//     }
//     await createUser(userToBeCreate);
//     console.log("level3")

//     const otp = await generateOTP();
//     console.log("otp", otp)
//     const hashedOTP = await hashOTP(otp)
//     console.log("hashedOTP", hashedOTP)
//     await saveOTP(email,hashedOTP)
//     // await sendOtpEmail(email,otp)
//     res.status(201).json({
//   message: "Registration successful. Please verify your email."
// });

//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const userGet = (req, res) => {
//   res.send("Heelo");
// };

// export { userRegister, userGet };

import {
  isEmpty,
  isValidEmail,
  isValidMobile,
  minLength,
  maxLength,
  validatePassword,
  confirmPassword,
  isValidDOB,
} from "../middlewares/middlewares.js";

import {
  createUser,
  generateOTP,
  hashOTP,
  hashPassword,
  saveOTP,
} from "../utils/utils.js";

const userRegister = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      confirm_password,
      mobile_number,
      date_of_birth,
      state,
      district,
      address,
      pincode,
    } = req.body;

    // ✅ Required fields check
    const fields = {
      full_name,
      email,
      password,
      confirm_password,
      mobile_number,
      date_of_birth,
      state,
      district,
      address,
      pincode,
    };

    for (let key in fields) {
      const error = isEmpty(fields[key]);
      if (error) {
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    // ✅ Full Name
    let error = minLength(3, full_name) || maxLength(100, full_name);
    if (error) return res.status(400).json({ message: error });

    // ✅ Email
    error = isValidEmail(email);
    if (error) return res.status(400).json({ message: error });

    // ✅ Password
    error = validatePassword(password);
    if (error) return res.status(400).json({ message: error });

    // ✅ Confirm Password
    error = confirmPassword(password, confirm_password);
    if (error) return res.status(400).json({ message: error });

    // ✅ Mobile
    error = isValidMobile(mobile_number);
    if (error) return res.status(400).json({ message: error });

    // ✅ DOB
    error = isValidDOB(date_of_birth);
    if (error) return res.status(400).json({ message: error });

    // ✅ Address
    error = minLength(10, address) || maxLength(100, address);
    if (error) return res.status(400).json({ message: error });

    // ✅ Pincode
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    // ✅ Hash password
    const hashedPassword = await hashPassword(password);
    // ✅ OTP Flow
    const otp = await generateOTP();
    const hashedOTP = await hashOTP(otp);

    const userToBeCreate = {
      full_name,
      email,
      password: hashedPassword,
      mobile_number,
      date_of_birth,
      state,
      district,
      address,
      pincode,
      hashedOTP,
    };

    await createUser(userToBeCreate);

    await saveOTP(email, hashedOTP);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

const userlogin = async(req,res)=> {
  try {
    
  } catch (error) {
    
  }
}

export { userRegister,userlogin };
