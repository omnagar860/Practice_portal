// const isEmpty = (str) => {
// if(!str || str.trim()=== ""){
//   return "Field is required"
// }
// return null
// };

// const isValidEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// const isValidMobile = (mobileNum) => {
//   const regex = /^[0-9]{10}$/;
//   return regex.test(mobileNum);
// };

// const minLength = (min, text, type = "string") => {
//   if (type === "string" && text.trim().length < min) {
//     return `Minimum length must be ${min}`;
//   }

//   if (type === "password") {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

//     if (!passwordRegex.test(text)) {
//       return "Password must contain uppercase, lowercase, number, and special character";
//     }
//   }

//   return null;
// };

// const maxLength = (max, text) => {
//   if (text.length > max) {
//     return `Must not be greater than ${max} characters`;
//   }
//   return null;
// };

// const confirmPassword = (password, confirmPassword) => {
//   if (password !== confirmPassword) {
//     return "Passwords do not match";
//   }
//   return null;
// };
// const isValidDOB = (dob) => {
//   const birthDate = new Date(dob);
//   const today = new Date();

//   const age = today.getFullYear() - birthDate.getFullYear();

//   if (age < 18) {
//     return "Must be at least 18 years old";
//   }

//   return null;
// };


// export {
//   isEmpty,
//   isValidEmail,
//   isValidMobile,
//   minLength,
//   maxLength,
//   confirmPassword,
//   isValidDOB
// };

// middlewares/middlewares.js

const isEmpty = (str) => {
  if (!str || str.trim() === "") return "Field is required";
  return null;
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Please enter a valid email";
};

const isValidMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile)
    ? null
    : "Please enter a valid mobile number";
};

const minLength = (min, text) => {
  return text.trim().length < min
    ? `Minimum ${min} characters required`
    : null;
};

const maxLength = (max, text) => {
  return text.length > max
    ? `Maximum ${max} characters allowed`
    : null;
};

const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  return regex.test(password)
    ? null
    : "Password must contain uppercase, lowercase, number and special character";
};

const confirmPassword = (password, confirm) => {
  return password !== confirm ? "Passwords do not match" : null;
};

const isValidDOB = (dob) => {
  const birth = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  return age < 18 ? "Applicant must be 18+ years old" : null;
};

export {
  isEmpty,
  isValidEmail,
  isValidMobile,
  minLength,
  maxLength,
  validatePassword,
  confirmPassword,
  isValidDOB,
};
