import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
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

  // Get OTP data from state
  const { otp: expectedOtp, otpEmail, otpExpiry } = location.state || {};

  const [form, setForm] = useState<VerifyOtpForm>({
    email: otpEmail || "",
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
      console.log("Submitting OTP verification form:", form);

      // Send all required data to backend
      await api.post("/account/verify-otp", {
        email: form.email,
        otp: form.otp,
        expectedOtp,
        otpExpiry,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/account/resetpassword", {
          state: { email: form.email },
        });
      }, 1000);
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || "OTP verification failed"
      );
    }
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        {serverError && <div className="text-danger">{serverError}</div>}
        {success && (
          <div className="text-success mb-2">OTP verified. Redirecting...</div>
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
          {errors.otp && <span className="text-danger">{errors.otp}</span>}
        </div>
        <br />
        <button type="submit" className="btn-approve btn-action">
          Verify
        </button>
      </form>
    </>
  );
};

export default VerifyOtp;
