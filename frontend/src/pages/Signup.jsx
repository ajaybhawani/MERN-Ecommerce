import React, { useState } from "react";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
import { validateEmail, validatePassword } from "../utils/validation";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailError = validateEmail(formData.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const response = await api.post("auth/signup", formData);
      setServerError(response?.data?.message);

      setFormData;
    } catch (error) {
      setServerError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

          <p className="mt-2 text-sm text-gray-500">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {serverError && (
            <div className="rounded-lg border text-center border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-blue-600">
              {serverError}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
