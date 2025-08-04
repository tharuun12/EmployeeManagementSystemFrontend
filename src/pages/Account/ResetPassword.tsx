import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, useLocation } from "react-router-dom";

type ResetPasswordForm = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and otp from query params or state (adjust as needed)
  const query = new URLSearchParams(location.search);
  const initialEmail = query.get("email") || "";
  const initialOtp = query.get("otp") || "";

  const [form, setForm] = useState<ResetPasswordForm>({
    email: initialEmail,
    otp: initialOtp,
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      await api.post("/account/resetpassword", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response &&
        typeof (err as any).response.data === "object" &&
        (err as any).response.data !== null
      ) {
        setServerError(
          ((err as any).response.data.message as string) ||
            "Reset password failed"
        );
      } else {
        setServerError("Reset password failed");
      }
    }
  };

  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="text-danger" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
        {success && (
          <div className="text-success" style={{ marginBottom: 8 }}>
            Password reset successful. Redirecting to login...
          </div>
        )}
        <input type="hidden" name="email" value={form.email} />
        <input type="hidden" name="otp" value={form.otp} />

        <div className="form-group">
          <label>New Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="newPassword"
              className="form-control"
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              style={{ marginLeft: 8 }}
              onClick={() => setShowNew((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${showNew ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-danger">{errors.newPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="confirmPassword"
              className="form-control"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              style={{ marginLeft: 8 }}
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-danger">{errors.confirmPassword}</span>
          )}
        </div>
        <br />
        <div className="form-actions ">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;