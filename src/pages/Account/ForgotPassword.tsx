import { useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";

type ForgotPasswordForm = {
  email: string;
};

type ForgotPasswordErrors = {
  email?: string;
};

const ForgotPassword = () => {
  const [form, setForm] = useState<ForgotPasswordForm>({ email: "" });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!form.email) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/account/forgotpassword", form);
      const OtpData = res.data
      setLoading(false);
      notifySuccess("OTP sent to your email if it exists in our system.");
      navigate("/account/verifyotp", { state: { otp: OtpData.otp,  otpEmail: OtpData.otpEmail, otpExpiry: OtpData.otpExpiry } });
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        err?.response?.data?.message;
      toast.error(errorMessage);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-form">
      <h2 className="login-title">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
         <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />

        </div>
        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">
          Send OTP
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default ForgotPassword;