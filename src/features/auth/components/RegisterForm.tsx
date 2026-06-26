"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaDiscord } from "react-icons/fa";
import { Eye, EyeOff, AlertCircle, ChevronDown } from "lucide-react";

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};

export type OAuthProvider = "google" | "github" | "facebook" | "discord";
type Mode = "email" | "oauth";

const COUNTRY_CODES = [
  { code: "+855", label: "🇰🇭", name: "Cambodia" },
  { code: "+1", label: "🇺🇸", name: "United States" },
  { code: "+44", label: "🇬🇧", name: "United Kingdom" },
  { code: "+61", label: "🇦🇺", name: "Australia" },
  { code: "+84", label: "🇻🇳", name: "Vietnam" },
  { code: "+66", label: "🇹🇭", name: "Thailand" },
];

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

  // Phone state
  const [country, setCountry] = useState(COUNTRY_CODES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [phoneRaw, setPhoneRaw] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayPhone = (value: string) => {
    const nums = value.replace(/\D/g, "");
    const chunks = nums.match(/.{1,3}/g);
    return chunks ? chunks.join(" ") : nums;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNums = e.target.value.replace(/\D/g, "");
    setPhoneRaw(cleanNums);
  };

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

    const finalPhoneNumber = phoneRaw
      ? `${country.code}${phoneRaw}`.replace(/\s+/g, "")
      : undefined;

    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: finalPhoneNumber,
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
              className="input h-12"
              disabled={loading}
            />

            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="input h-12"
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input h-12"
            disabled={loading}
          />

          {/* PHONE */}
          <div className="relative w-full flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-white/20 px-3 h-12 transition-all">
            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="relative h-full flex items-center shrink-0"
            >
              <button
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 pr-1.5 h-full text-sm text-white font-medium select-none hover:text-gray-200 transition-colors"
                disabled={loading}
              >
                <span>{country.label}</span>
                <span className="text-sm text-white/90 font-sans">
                  {country.code}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] w-48 max-h-56 overflow-y-auto bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl py-1 z-50 shadow-xl animate-fadeIn">
                  {COUNTRY_CODES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-white/5 ${
                        country.code === c.code
                          ? "text-red-400 bg-white/5 font-medium"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="truncate">
                        {c.label} {c.name}
                      </span>
                      <span className="text-gray-500 font-mono text-[11px] ml-2 shrink-0">
                        {c.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="tel"
              placeholder="95 453 535 (optional)"
              value={formatDisplayPhone(phoneRaw)}
              onChange={handlePhoneChange}
              className="w-full bg-transparent border-0 outline-none pl-1.5 h-full text-sm text-white placeholder-gray-500 min-w-0 font-sans"
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div
            className={`w-full flex items-center justify-between px-3 h-12 rounded-xl bg-white/5 border transition-all ${
              weakPassword
                ? "border-red-500/50 focus-within:border-red-500"
                : "border-white/10 focus-within:border-white/20"
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-transparent border-0 outline-none py-2 text-sm text-white placeholder-gray-500 min-w-0"
              disabled={loading}
            />

            <div className="flex items-center gap-2 select-none shrink-0 ml-2">
              {weakPassword && (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 animate-fadeIn">
                  <AlertCircle size={12} />
                  Weak
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div
            className={`w-full flex items-center justify-between px-3 h-12 rounded-xl bg-white/5 border transition-all ${
              passwordMismatch
                ? "border-red-500/50 focus-within:border-red-500"
                : "border-white/10 focus-within:border-white/20"
            }`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full bg-transparent border-0 outline-none py-2 text-sm text-white placeholder-gray-500 min-w-0"
              disabled={loading}
            />

            <div className="flex items-center gap-2 select-none shrink-0 ml-2">
              {passwordMismatch && (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 animate-fadeIn">
                  <AlertCircle size={12} />
                  Mismatch
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700
            disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center font-medium"
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
      transition text-sm font-medium"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
