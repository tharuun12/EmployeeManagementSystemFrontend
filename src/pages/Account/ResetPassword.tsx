import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; import { useNavigate, useLocation } from "react-router-dom";

type ResetPasswordForm = {
  email: string;
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


  const initialState = location.state as { email?: string, otp?: string };
  const emailFromState = initialState?.email;

  const [form, setForm] = useState<ResetPasswordForm>({
    email: emailFromState || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);


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
      setLoading(true);
      const res = await api.post("/account/reset-password", form);
      setSuccess(true);
      notifySuccess("Password reset successful.");
      setLoading(false);
      setTimeout(() => navigate("/account/login"), 1000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.errors ;
      console.error("Reset password error:", errorMessage);
      notifyError(errorMessage[0]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-form">
      <h2 className="login-title">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="email" value={form.email} />

        <div className="form-group">
          <label className="form-label">New Password</label>
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
          <label className="form-label">Confirm Password</label>
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
        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;