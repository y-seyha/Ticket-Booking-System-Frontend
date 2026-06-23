"use client";

import { useMemo, useState } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaDiscord } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};

export type OAuthProvider = "google" | "github" | "facebook" | "discord";
type Mode = "email" | "oauth";

export default function RegisterForm({
  onSubmit,
  onOAuthRegister,
  loading,
}: {
  onSubmit: (data: RegisterData) => void;
  onOAuthRegister: (provider: OAuthProvider) => void;
  loading?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= VALIDATION ================= */
  const isStrongPassword = (password: string) =>
    /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);

  const weakPassword = useMemo(
    () => form.password.length > 0 && !isStrongPassword(form.password),
    [form.password],
  );

  const passwordMismatch = useMemo(
    () =>
      form.confirmPassword.length > 0 && form.password !== form.confirmPassword,
    [form.password, form.confirmPassword],
  );

  const isValid =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.password &&
    !weakPassword &&
    !passwordMismatch;

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
  };

  return (
    <div className="space-y-5">
      {/* SWITCH */}
      <div className="w-full space-y-2">
        <p className="text-sm text-gray-400">Choose your registration method</p>

        <div className="relative w-full h-14 bg-white/5 border border-white/10 rounded-full p-1 flex items-center">
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-red-600/80 transition-all duration-300 ${
              mode === "email" ? "left-1" : "left-1/2"
            }`}
          />

          <button
            type="button"
            onClick={() => setMode("email")}
            className="relative z-10 w-1/2 h-full flex items-center justify-center text-sm"
          >
            <span className={mode === "email" ? "text-white" : "text-gray-400"}>
              Email Register
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode("oauth")}
            className="relative z-10 w-1/2 h-full flex items-center justify-center text-sm"
          >
            <span className={mode === "oauth" ? "text-white" : "text-gray-400"}>
              Social Register
            </span>
          </button>
        </div>
      </div>

      {/* EMAIL */}
      {mode === "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="input"
              disabled={loading}
            />

            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="input"
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            disabled={loading}
          />

          {/* PHONE */}
          <input
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
            disabled={loading}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input pr-10"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {weakPassword && (
            <p className="text-xs text-red-400">
              Password must be at least 6 characters and include a number.
            </p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="input pr-10"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {passwordMismatch && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700
            disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      )}

      {/* OAUTH */}
      {mode === "oauth" && (
        <div className="space-y-4 mt-4">
          <OAuthButton
            icon={<FaGoogle />}
            label="Continue with Google"
            onClick={() => onOAuthRegister("google")}
          />
          <OAuthButton
            icon={<FaGithub />}
            label="Continue with GitHub"
            onClick={() => onOAuthRegister("github")}
          />
          <OAuthButton
            icon={<FaFacebook />}
            label="Continue with Facebook"
            onClick={() => onOAuthRegister("facebook")}
          />
          <OAuthButton
            icon={<FaDiscord />}
            label="Continue with Discord"
            onClick={() => onOAuthRegister("discord")}
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
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-3
      bg-white/5 border border-white/10 rounded-xl
      hover:bg-white/10 hover:border-white/20
      transition text-sm"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
