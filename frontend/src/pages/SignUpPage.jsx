import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", gender: "" });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.gender) return toast.error("Choose male or female for your default avatar");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() === true) signup(formData);
  };

  return (
    <main className="grid min-h-screen bg-base-200 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-0">
      <AuthImagePattern
        title="Start with a chat space that feels organized."
        subtitle="Create your profile, see who is online, send images, reply in context, and keep messages easy to scan."
      />

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-neutral text-neutral-content">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="muted-label">HiChat</p>
              <h1 className="text-2xl font-semibold">Create account</h1>
            </div>
          </div>

          <div className="section-panel p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="field-label">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-base-content/35" />
                  <input
                    type="text"
                    className="mono-input pl-10"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
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

              <div className="space-y-2">
                <label className="field-label">Default avatar</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male", label: "Male", avatar: "/avatars/male.svg" },
                    { value: "female", label: "Female", avatar: "/avatars/female.svg" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        formData.gender === option.value
                          ? "border-base-content bg-base-200"
                          : "border-base-300 hover:bg-base-200"
                      }`}
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                    >
                      <img src={option.avatar} alt="" className="size-9 rounded-full" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full rounded-lg" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating account
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-base-content underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;
