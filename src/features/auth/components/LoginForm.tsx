"use client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useMemo, useState, ReactNode } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaDiscord } from "react-icons/fa";

type OAuthProvider = "google" | "github" | "facebook" | "discord";
type Mode = "email" | "oauth";

export default function LoginForm({
  onSubmit,
  loading,
  onOAuthLogin,
  onForgotPassword,
}: {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  onOAuthLogin: (provider: OAuthProvider) => void;
  onForgotPassword?: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<Mode>("email");

  const isValid = useMemo(() => {
    return form.email.trim().length > 0 && form.password.trim().length > 0;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    onSubmit(form.email, form.password);
  };

  return (
    <div className="space-y-6">
      {/* ================= MODE SWITCH ================= */}
      <div className="w-full space-y-3">
        {/* helper text */}
        <p className="text-sm text-gray-400">
          You can use your email or social login method
        </p>

        {/* switch */}
        <div className="relative w-full h-14 bg-white/5 border border-white/10 rounded-full p-1 flex items-center">
          {/* sliding pill */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-red-600/80 transition-all duration-300 ease-out ${
              mode === "email" ? "left-1" : "left-1/2"
            }`}
          />

          {/* Email */}
          <button
            type="button"
            onClick={() => setMode("email")}
            className="relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium"
          >
            <span className={mode === "email" ? "text-white" : "text-gray-400"}>
              Email Login
            </span>
          </button>

          {/* OAuth */}
          <button
            type="button"
            onClick={() => setMode("oauth")}
            className="relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium"
          >
            <span className={mode === "oauth" ? "text-white" : "text-gray-400"}>
              Social Login
            </span>
          </button>
        </div>
      </div>

      {/* ================= EMAIL ================= */}
      {mode === "email" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 text-sm h-13
                bg-white/5 border border-white/10 rounded-xl
                focus:border-red-500 outline-none transition
                placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 text-sm h-13
                bg-white/5 border border-white/10 rounded-xl
                focus:border-red-500 outline-none transition
                placeholder:text-gray-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition
            bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      )}

      {/* ================= OAUTH ================= */}
      {mode === "oauth" && (
        <div className="space-y-5 mt-5">
          <OAuthButton
            icon={<FaGoogle />}
            label="Continue with Google"
            onClick={() => onOAuthLogin("google")}
          />
          <OAuthButton
            icon={<FaGithub />}
            label="Continue with GitHub"
            onClick={() => onOAuthLogin("github")}
          />
          <OAuthButton
            icon={<FaFacebook />}
            label="Continue with Facebook"
            onClick={() => onOAuthLogin("facebook")}
          />
          <OAuthButton
            icon={<FaDiscord />}
            label="Continue with Discord"
            onClick={() => onOAuthLogin("discord")}
          />
        </div>
      )}
    </div>
  );
}

/* ================= OAUTH BUTTON ================= */
function OAuthButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-2.5 h-13
      bg-white/5 border border-white/10 rounded-xl
      hover:bg-white/10 hover:border-white/20
      transition text-sm cursor-pointer"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
