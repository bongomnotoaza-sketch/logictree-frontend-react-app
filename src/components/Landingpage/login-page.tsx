"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// LogicTree Academy — login page
// Same dark theme as the landing page. Wired to the same CSRF + login flow
// as your original login script, EXCEPT on success it does not navigate
// anywhere — it just swaps the form for an in-page "you're logged in" state.
//
// Requires: shadcn/ui `button` + `input` components, and `lucide-react`.
//   npx shadcn@latest add button input
//   npm install lucide-react
// ---------------------------------------------------------------------------


type ToastType = "success" | "error" | "info";
interface Toast {
  message: string;
  type: ToastType;
}

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: "#1f3d35", border: "#2ed573", text: "#b8f0d6" },
  info: { bg: "#1d2e3e", border: "#2ed573", text: "#b0d6f0" },
  error: { bg: "#3d1f1f", border: "#e05d5d", text: "#f2b8b8" },
};

interface LoginPageProps {
  /** Called once the server confirms login. Optional — the page shows its
   *  own "logged in" state regardless, this just lets a parent react to it
   *  (e.g. swap to the dashboard) if you wire it up later. */
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"idle" | "csrf" | "login">("idle");
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function notify(message: string, type: ToastType = "info") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  async function getCSRFToken(): Promise<string | null> {
    try {
      const response = await fetch(`https://www.logictree.co.za/auth/get-csrf-token/`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error(`CSRF endpoint returned ${response.status}`);
      const data = await response.json();
      if (!data.csrfToken || typeof data.csrfToken !== "string") {
        throw new Error("Server did not return a valid CSRF token");
      }
      return data.csrfToken;
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      notify("Please fill in all fields", "error");
      return;
    }

    try {
      setLoading("csrf");
      const csrfToken = await getCSRFToken();
      if (!csrfToken) throw new Error("Could not get CSRF token");

      setLoading("login");
      const loginResponse = await fetch(`https://www.logictree.co.za/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
      });

      let result: { message?: string; error?: string } = {};
      try {
        result = await loginResponse.json();
      } catch (parseError) {
        console.error("Parse error:", parseError);
        result = { message: "Unable to parse server response" };
      }

      if (loginResponse.ok) {
        // No redirect — just show the logged-in state in place.
        setLoggedIn(true);
        notify(result.message || "Login successful", "success");
        onLoginSuccess?.();
      } else {
        const errorMessage =
          result.message || result.error || `Login failed (Status: ${loginResponse.status})`;
        notify(errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      notify("Error: " + error.message, "error");
    } finally {
      setLoading("idle");
    }
  }

  async function recoverPassword() {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      notify("Please enter your username first.", "error");
      return;
    }

    notify("Processing password recovery request...", "info");

    try {
      const csrfToken = await getCSRFToken();
      if (!csrfToken) {
        notify("Unable to get CSRF token. Please refresh the page.", "error");
        return;
      }

      const response = await fetch(`/auth/password-recovery/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ username: trimmedUsername }),
      });

      const data = await response.json();

      if (response.ok) {
        notify(data.message || "Password recovery instructions sent to your email.", "success");
      } else {
        notify(data.error || data.message || "Password recovery failed.", "error");
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      notify("Unable to connect to the server.", "error");
    }
  }

  const isSubmitting = loading !== "idle";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#070a09] px-5 text-[#f4f6f4]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,246,244,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,246,244,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v6M12 9L7 15M12 9l5 6M7 15v6M17 15v6"
              stroke="#5fa382"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.2" fill="#1f5c3f" stroke="#5fa382" strokeWidth="1" />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight">LogicTree</span>
        </div>

        <div className="rounded-xl border border-[#232f29] bg-[#101613] p-8 shadow-2xl shadow-black/50">
          {loggedIn ? (
            // -----------------------------------------------------------
            // Logged-in state — replaces the form in place, no navigation
            // -----------------------------------------------------------
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1f5c3f]/20 border border-[#1f5c3f]">
                <Check size={22} color="#5fa382" strokeWidth={2} />
              </div>
              <h1 className="text-lg font-semibold">You're logged in</h1>
              <p className="mt-2 text-sm text-[#8a9c94]">
                Signed in as <span className="text-[#f4f6f4]">{username}</span>.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold">Log in</h1>
              <p className="mt-1 mb-6 text-sm text-[#8a9c94]">
                Welcome back — enter your details to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-xs text-[#8a9c94]">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    className="border-[#232f29] bg-[#070a09] text-[#f4f6f4] placeholder:text-[#8a9c94]/60 focus-visible:ring-[#5fa382]"
                    placeholder="yourname"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs text-[#8a9c94]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="border-[#232f29] bg-[#070a09] pr-10 text-[#f4f6f4] placeholder:text-[#8a9c94]/60 focus-visible:ring-[#5fa382]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a9c94] hover:text-[#f4f6f4] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={recoverPassword}
                    className="text-xs text-[#8a9c94] hover:text-[#5fa382] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1f5c3f] text-[#eafaf1] hover:bg-[#276b49]"
                >
                  {loading === "csrf" ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Getting ready...
                    </>
                  ) : loading === "login" ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Logging in...
                    </>
                  ) : (
                    <>
                      Log in <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[999] max-w-[90%] -translate-x-1/2 rounded-xl border px-6 py-3 text-center text-sm font-medium shadow-2xl shadow-black/50"
          style={{
            background: TOAST_STYLES[toast.type].bg,
            borderColor: TOAST_STYLES[toast.type].border,
            color: TOAST_STYLES[toast.type].text,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}