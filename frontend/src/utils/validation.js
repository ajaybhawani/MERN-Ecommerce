export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password.trim()) {
    return "Password is required";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must contain 8 characters, uppercase, lowercase, number and special character";
  }

  return "";
};
