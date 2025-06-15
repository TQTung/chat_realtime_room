import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { useAppService } from "../context/app-service";
import Cookies from "js-cookie";
import Cookie from "js-cookie";
import { useAccount } from "../hooks/useAccount";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

interface SigninFormData {
  email: string;
  password: string;
}

const SigninPage = () => {
  const { clientApi } = useAppService();
  const { getProfile } = useAccount();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onsubmit = async (data: SigninFormData) => {
    try {
      setIsLoggingIn(true);
      const res = await clientApi.auth.signin(data);
      if (res.status === "success") {
        toast.success(res.message || "Login successful");
        Cookies.set("accessToken", res.data?.accessToken);
        Cookies.set("refreshToken", res.data?.refreshToken);
        getProfile();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
      Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookie.remove(cookieName);
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  {...register("email")}
                />
                <p className="text-red-400 mt-1 text-sm ml-1">
                  {errors.email?.message}
                </p>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <p className="text-red-400 mt-1 text-sm ml-1">
                {errors.password?.message}
              </p>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};

export default SigninPage;
