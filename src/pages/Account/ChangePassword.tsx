import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
import { useNavigate } from "react-router-dom";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordErrors = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const ChangePassword = () => {
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [serverError, setServerError] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    if (form.newPassword !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      await api.post("/account/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
        Email: user?.email,
      });
      navigate("/");
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
            "Change password failed"
        );
      } else {
        setServerError("Change password failed");
      }
    }
  };

  return (
    <div className="create-form">
      <h2 className="form-title">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="text-danger" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="oldPassword">OldPassword</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="oldPassword"
              id="oldPassword"
              type={showOld ? "text" : "password"}
              className="form-control"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className=""
              style={{ marginLeft: 8 }}
              onClick={() => setShowOld((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${showOld ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          {errors.oldPassword && (
            <span className="text-danger">{errors.oldPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">NewPassword</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="newPassword"
              id="newPassword"
              type={showNew ? "text" : "password"}
              className="form-control"
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
          <label htmlFor="confirmPassword">ConfirmPassword</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="confirmPassword"
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className="form-control"
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
        <button type="submit" className="btn-create btn-action">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;