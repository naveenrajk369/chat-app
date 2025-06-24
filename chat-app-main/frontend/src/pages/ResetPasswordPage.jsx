import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center px-4">
      <form
        onSubmit={handleReset}
        className="bg-base-100 p-6 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-xl font-semibold">Reset Your Password</h1>
        <p className="text-sm text-base-content/60">
          Set a new password to recover your account.
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="password"
              className="input input-bordered w-full pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-sm text-center">
          Back to{" "}
          <Link to="/login" className="link link-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
