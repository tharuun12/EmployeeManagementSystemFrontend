import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate, Link } from "react-router-dom";

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  fullName: string;
};

type RegisterErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    // Basic client-side validation
    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      await api.post("/account/register", form);
      navigate("/account/login");
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
            "Registration failed"
        );
      } else {
        setServerError("Registration failed");
      }
    }
  };

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {serverError && (
          <div className="register-validation-summary">{serverError}</div>
        )}
        <div className="register-group">
          <label className="register-label">Email</label>
          <input
            name="email"
            type="email"
            className="register-input"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="register-error">{errors.email}</span>
          )}
        </div>

        {/* Hidden fields for PhoneNumber and FullName */}
        <input
          type="hidden"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="hidden"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

        <div className="login-group">
          <label className="login-label">Password</label>
          <div className="password-input-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={form.password}
              onChange={handleChange}
              required
              id="registerPasswordField"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                id="registerPasswordToggleIcon"
              ></i>
            </button>
          </div>
          {errors.password && (
            <span className="login-error">{errors.password}</span>
          )}
        </div>

        <div className="login-group">
          <label className="login-label">Confirm Password</label>
          <div className="password-input-container">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className="login-input"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              id="confirmPasswordField"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${
                  showConfirm ? "fa-eye" : "fa-eye-slash"
                }`}
                id="confirmPasswordToggleIcon"
              ></i>
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="login-error">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="register-actions">
          <button type="submit" className="register-button">
            Register
          </button>
        </div>
        <div className="login-remember-forgot1">
          <p>
            Already have an account?{" "}
            <Link to="/account/login" className="login-forgot-link1">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;