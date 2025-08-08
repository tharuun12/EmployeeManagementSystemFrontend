import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
import { useNavigate, useLocation } from "react-router-dom";

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

  const { otp: expectedOtp, otpEmail, otpExpiry } = location.state || {};

  const [form, setForm] = useState<VerifyOtpForm>({
    email: otpEmail || "",
    otp: "",
  });

  const [errors, setErrors] = useState<VerifyOtpErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


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
      setLoading(true);
      await api.post("/account/verify-otp", {
        email: form.email,
        otp: form.otp,
        expectedOtp,
        otpExpiry,
      });

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/account/resetpassword", {
          state: { email: form.email },
        });
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        err?.response?.data?.message ;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="create-form">
      <h2 className="login-title">Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        {serverError && <div className="text-danger">{serverError}</div>}
        {success && (
          <div className="text-success mb-2">OTP verified. Redirecting...</div>
        )}
        <input type="hidden" name="email" value={form.email} />
        <div className="form-group">
          <label className="form-label">Enter OTP</label>
          <input
            name="otp"
            className="form-control"
            value={form.otp}
            onChange={handleChange}
            required
          />
          {errors.otp && <span className="text-danger">{errors.otp}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">
            Verify
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default VerifyOtp;
