import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

const BACKEND_URL = "http://127.0.0.1:8787/api/v1/auth/signin";

type FormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        BACKEND_URL,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );
      console.log("Login successful:", data);

      localStorage.setItem("jwt", data.jwt);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-blue-400 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-12 w-full max-w-lg space-y-8">
        <h2 className="text-4xl font-bold text-blue-800 text-center">
          Login to Your Account
        </h2>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full pl-12 p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full pl-12 p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-md transition">
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" /> Logging in...
            </div>
          ) : (
            <>
              <LogIn className="inline-block mr-2 h-5 w-5" />
              Log In
            </>
          )}
        </button>
      </form>
    </div>
  );
};
