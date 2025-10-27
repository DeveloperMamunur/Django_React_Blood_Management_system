import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn} from "lucide-react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function Login() {
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!username || !password) {
        addToast("Please fill in all fields", "error", 3000);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const result = await login({ username, password });
        if (result.success) {
          addToast("Login successful!", "success", 1500);
          const params = new URLSearchParams(location.search);
          const nextUrl = decodeURIComponent(params.get("next") || "/dashboard");
          setTimeout(() => {
            navigate(nextUrl, { replace: true });
          }, 1000);
        } else {
          addToast(result.error || "Login failed", "error", 4000);
          setIsLoading(false);
        }
      } catch (err) {
        addToast(err.message || "Unexpected error", "error", 4000);
        setIsLoading(false);
      }
    };

  return (
    <div>
      <div className="min-h-screen dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 transition-colors duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="johndoe"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}