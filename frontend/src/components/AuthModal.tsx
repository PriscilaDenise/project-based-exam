"use client";

import { useState } from "react";
import { X, LogIn, UserPlus, Loader2, Film, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PasswordInput from "@/components/PasswordInput";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ open, onClose, initialMode = "login" }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function resetSensitiveFields() {
    setPassword("");
    setPasswordConfirm("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        if (!email) {
          setError("Email is required");
          setLoading(false);
          return;
        }
        if (password !== passwordConfirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters");
          setLoading(false);
          return;
        }
        await register(username, email, password, passwordConfirm);
      }
      onClose();
      setUsername("");
      setEmail("");
      resetSensitiveFields();
    } catch {
      setError(
        mode === "login"
          ? "Invalid username or password"
          : "Registration failed. Username may already exist."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-0/85 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Top shine */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/15">
              <Film className="w-7 h-7 text-surface-0" />
            </div>

            <h2 className="text-2xl font-bold font-display">
              {mode === "login" ? "Welcome back" : "Join CineQuest"}
            </h2>
            <p className="text-sm text-white/30 mt-1">
              {mode === "login"
                ? "Sign in to access your personalized experience"
                : "Create an account to save your preferences"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="auth-username"
                className="text-[11px] uppercase tracking-wider text-white/30 font-semibold mb-1.5 block"
              >
                Username
              </label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                autoComplete="username"
                className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-white/[0.08] text-white placeholder:text-white/20 outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all font-body"
                placeholder="Your username"
              />
            </div>

            {mode === "register" && (
              <div className="animate-fade-in">
                <label
                  htmlFor="auth-email"
                  className="text-[11px] uppercase tracking-wider text-white/30 font-semibold mb-1.5 block"
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-white/[0.08] text-white placeholder:text-white/20 outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all font-body"
                  placeholder="you@example.com"
                />
              </div>
            )}

            <PasswordInput
              id="auth-password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder={mode === "register" ? "Min 8 characters" : "Your password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              name="password"
            />

            {mode === "register" && (
              <div className="animate-fade-in">
                <PasswordInput
                  id="auth-password-confirm"
                  label="Confirm password"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={8}
                  name="password_confirm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-surface-0 font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>

            {/* Toggle mode */}
            <p className="text-center text-sm text-white/30 pt-2">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setPasswordConfirm("");
                    }}
                    className="text-gold hover:text-gold-light font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setPasswordConfirm("");
                    }}
                    className="text-gold hover:text-gold-light font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
