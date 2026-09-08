import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;

        localStorage.setItem("token", token);

        if (response.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        navigate("/");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Activity size={32} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            AYURIX
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Clinical Research Management System
          </p>

        </div>


        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to your AYURIX account
            </p>
          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ayurix.com"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </div>


            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>


            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}

            </button>

          </form>


          {/* Demo Account */}
          <div className="mt-6 rounded-lg bg-slate-50 p-4">

            <p className="text-xs font-semibold text-slate-600">
              Demo Account
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Email: admin@ayurix.com
            </p>

            <p className="text-xs text-slate-500">
              Password: Admin@123
            </p>

          </div>

        </div>


        <p className="mt-6 text-center text-xs text-slate-400">
          AYURIX Clinical Research • AIIA CTMS
        </p>

      </div>

    </div>
  );
}

export default Login;