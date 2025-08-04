import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate, Link } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setServerError("");

  try {
    console.log("Submitting login form:", form);
    const response = await api.post("/account/login", form);

    // Assuming the backend returns a JWT token and user details like:
    // { token: "xxx", user: { id: 1, email: "test@example.com", role: "Admin" } }

    const { token, roles, name, email } = response.data;

    // Save token and user info
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ name, email, roles }));

    // Set default Authorization header for future API calls
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Redirect based on role
    const role = roles[0]; // assuming one role per user
    if (role === "Admin") navigate("/admin/dashboard");
    else if (role === "Manager") navigate("/manager/dashboard");
    else navigate("/employee/dashboard");

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
        ((err as any).response.data.message as string) || "Login failed"
      );
    } else {
      setServerError("Login failed");
    }
  }
};


  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {serverError && (
          <div className="login-validation-summary">{serverError}</div>
        )}

        <div className="login-group">
          <label className="login-label">Email</label>
          <input
            name="email"
            type="email"
            className="login-input"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="login-error">{errors.email}</span>
          )}
        </div>

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
              id="passwordField"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
                id="passwordToggleIcon"
              ></i>
            </button>
          </div>
          {errors.password && (
            <span className="login-error">{errors.password}</span>
          )}
        </div>

        <div className="login-remember-forgot">
          <div className="login-remember">
            <input
              name="rememberMe"
              type="checkbox"
              className="login-checkbox"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <label className="login-remember-label">Remember Me</label>
          </div>
          <Link to="/forgotpassword" className="login-forgot-link1">
            Forgot Password?
          </Link>
        </div>

        <div className="login-actions">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>

        <div className="login-remember-forgot1">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="login-forgot-link1">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;