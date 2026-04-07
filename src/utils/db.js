// import sql from "mssql/msnodesqlv8.js";

// const config = {
//   server: "localhost" ||"localhost\\SQLEXPRESS",  // or DESKTOP-XXXX\SQLEXPRESS
//   database: "demoApp",
//   driver: "msnodesqlv8",
//   options: {
//     trustedConnection: true
//   }
// };

// export const connectDB = async () => {
//   try {
//     const pool = await sql.connect(config);
//     console.log("DB Connected");
//     return pool;
//   } catch (err) {
//     console.error("DB Connection Failed:", err);
//   }
// };

import sql from "mssql/msnodesqlv8.js";

const config = {
  // Use a raw connection string to tell the ODBC driver exactly what to do
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=demoApp;Trusted_Connection=yes;',
};

export const connectDB = async () => {
  try {
    // Note: When using connectionString, you pass it directly or inside the object
    const pool = await sql.connect(config);
    console.log("DB Connected");
    return pool;
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
  }
};