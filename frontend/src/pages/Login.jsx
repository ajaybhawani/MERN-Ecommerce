import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { validateEmail } from "../utils/validation";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/toastContext";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    const emailError = validateEmail(formData.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      const userData = {
        token: response?.data?.token,
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      toast.success(response?.data?.message || "Logged in successfully");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                error.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {error.email && (
              <p className="mt-1 text-sm text-red-500">{error.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition ${
                  error.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              <Button
                variant="plain"
                size="none"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>

            {error.password && (
              <p className="mt-1 text-sm text-red-500">{error.password}</p>
            )}
          </div>

          <Button
            type="submit"
            radius="lg"
            fullWidth
            loading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
