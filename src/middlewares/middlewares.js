
const isEmpty = (value) => {
  if (value === undefined || value === null) {
    return "Field is required";
  }

  if (typeof value === "string" && value.trim() === "") {
    return "Field is required";
  }

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

const hasInvalidSpecialChar =(str)=> {
  const regex = /[^a-zA-Z0-9_&]/;
  if(!regex.test(str)){
    return `Specail characters are not allowed except & and _.`
  }
  return null;
}

const isValidAadhar = (aadhar)=> {
  const regex = /^[0-9]{12}$/ ;
  if(!regex.test(aadhar)){
    return 'Please enter a valid 12 digit aadhar no.'
  }
  return null;
}

const isValidPAN = (pan)=> {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if(!pan) return `PAN Number is required.`
  if(!regex.test(pan)){
    return "Invalid PAN number format (e.g., ABCDE1234F)"
  }
  return null;
}

const validateFiles = (file,length)=> {
  if(!file || file.length === 0) {
    return `At least one document is required`
  }
  if(file.length > length) {
    return `Maximum ${length} file can be uploaded`
  }
  return null
}

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
  hasInvalidSpecialChar,
  isValidAadhar,
  isValidPAN,
  validateFiles
};
