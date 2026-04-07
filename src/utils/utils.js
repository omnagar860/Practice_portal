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
      .input("mobile_number", sql.VarChar(255), user.mobile_number)
      .input("date_of_birth", sql.Date, user.date_of_birth)
      .input("state", sql.VarChar(255), user.state)
      .input("district", sql.VarChar(255), user.district)
      .input("address", sql.VarChar(255), user.address)
      .input("otp_hash", sql.VarChar(255), otpHash) 
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
// const createUser = async (user) => {
//   try {
//     const pool = await sql.connect();
//     const result = await pool
//       .request()
//       .input("full_name", sql.VarChar(100), user.full_name)
//       .input("email", sql.VarChar(255), user.email)
//       .input("password", sql.VarChar(255), user.password)
//       .input("mobile_number", sql.VarChar(255), user.mobile_number)
//       .input("date_of_birth", sql.Date, user.date_of_birth)
//       .input("state", sql.VarChar(255), user.state)
//       .input("district", sql.VarChar(255), user.district)
//       .input("address", sql.VarChar(255), user.address)
//       // .input("otp_hash", sql.VarChar, hashOTP)
//       .input("pincode", sql.VarChar(6), user.pincode).query(`INSERT into users 
//                             (full_name, email,password,mobile_number,date_of_birth,state, district,address,pincode)
//                             VALUES
//                             (@full_name, @email, @password, @mobile_number, @date_of_birth, @state, @district, @address, @pincode)
//                              `);
//     return result;
//   } catch (error) {
//     console.error("Error while creating user " + error);
//     throw error;
//   }
// };

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
      INSERT INTO emial_verification (email, otp_hash, expires_at)
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

export { hashPassword, createUser, generateOTP, saveOTP,hashOTP,sendOtpEmail };
