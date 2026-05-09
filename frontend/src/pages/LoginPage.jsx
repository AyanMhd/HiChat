import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <main className="grid min-h-screen bg-base-200 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-0">
      <AuthImagePattern
        title="A calmer place for every conversation."
        subtitle="HiChat keeps the interface quiet so the people, messages, images, replies, and presence states stay easy to read."
      />

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-neutral text-neutral-content">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="muted-label">HiChat</p>
              <h1 className="text-2xl font-semibold">Welcome back</h1>
            </div>
          </div>

          <div className="section-panel p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="field-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-base-content/35" />
                  <input
                    type="email"
                    className="mono-input pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="field-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-base-content/35" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="mono-input pl-10 pr-10"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/45 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full rounded-lg" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-base-content/60">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-base-content underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
