import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
        body: JSON.stringify({ email }),
      });

      // If server fails to respond with JSON, handle gracefully
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return JSON");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center px-4">
      <form
        onSubmit={handleResetRequest}
        className="bg-base-100 p-6 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-base-content/60">
          Enter your email and we’ll send you a reset link.
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="email"
              className="input input-bordered w-full pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-sm text-center">
          Remembered your password?{" "}
          <Link to="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
