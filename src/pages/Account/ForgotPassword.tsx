import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate } from "react-router-dom";

type ForgotPasswordForm = {
  email: string;
};

type ForgotPasswordErrors = {
  email?: string;
};

const ForgotPassword = () => {
  const [form, setForm] = useState<ForgotPasswordForm>({ email: "" });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    if (!form.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      const res = await api.post("/account/forgotpassword", form);
      console.log("Forgot password response:", res.data);
      const OtpData = res.data
      setSuccess(true);
      navigate("/account/verifyotp", { state: { otp: OtpData.otp,  otpEmail: OtpData.otpEmail, otpExpiry: OtpData.otpExpiry } });
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
            "Failed to send OTP"
        );
      } else {
        setServerError("Failed to send OTP");
      }
    }
  };
  console.log("ForgotPassword form state:", form);
  return (
    <>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="text-danger">{serverError}</div>
        )}
        {success && (
          <div className="text-success" style={{ marginBottom: 8 }}>
            OTP sent to your email if it exists in our system.
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="text-danger">{errors.email}</span>
          )}
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Send OTP
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;