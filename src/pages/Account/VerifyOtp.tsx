import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, useLocation } from "react-router-dom";

type VerifyOtpForm = {
  email: string;
  otp: string;
};

type VerifyOtpErrors = {
  otp?: string;
};

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query params or state (adjust as needed)
  const query = new URLSearchParams(location.search);
  const initialEmail = query.get("email") || "";

  const [form, setForm] = useState<VerifyOtpForm>({
    email: initialEmail,
    otp: "",
  });
  const [errors, setErrors] = useState<VerifyOtpErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    if (!form.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    try {
      await api.post("/account/verifyotp", form);
      setSuccess(true);
      setTimeout(() => navigate("/resetpassword?email=" + encodeURIComponent(form.email) + "&otp=" + encodeURIComponent(form.otp)), 1500);
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
            "OTP verification failed"
        );
      } else {
        setServerError("OTP verification failed");
      }
    }
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="text-danger">{serverError}</div>
        )}
        {success && (
          <div className="text-success" style={{ marginBottom: 8 }}>
            OTP verified. Redirecting...
          </div>
        )}
        <input type="hidden" name="email" value={form.email} />
        <div className="form-group">
          <label>Enter OTP</label>
          <input
            name="otp"
            className="form-control"
            value={form.otp}
            onChange={handleChange}
            required
          />
          {errors.otp && (
            <span className="text-danger">{errors.otp}</span>
          )}
        </div>
        <br />
        <button type="submit" className="btn btn-success">
          Verify
        </button>
      </form>
    </>
  );
};

export default VerifyOtp;