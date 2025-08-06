import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; import { useNavigate } from "react-router-dom";

type LeaveRequestForm = {
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

type LeaveRequestErrors = {
  startDate?: string;
  endDate?: string;
  reason?: string;
};

const LeaveApply = () => {
  const [employee, setEmployee] = useState<{ employeeId: string; fullName: string } | null>(null);
  const [form, setForm] = useState<LeaveRequestForm>({
    employeeId: localStorage.getItem("userId") || "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState<LeaveRequestErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch employee info on mount
  useEffect(() => {
    api
      .get("/employees/profile")
      .then((res) => {
        setEmployee({
          employeeId: res.data.employee.employeeId?.toString() ?? "",
          fullName: res.data.employee.fullName ?? "",
        });
        console.log("Employee:", res.data.employee);
        setForm((prev) => ({
          ...prev,
          employeeId: res.data.employee.employeeId?.toString() ?? "",
        }));
      })
      .catch(() => {
        setEmployee(null);
      });
  }, []);

  // Ensure EndDate cannot be before StartDate
  useEffect(() => {
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      setErrors((prev) => ({
        ...prev,
        endDate: "End Date cannot be before Start Date",
      }));
    } else {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  }, [form.startDate, form.endDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setSubmitting(true);

    // Basic validation
    let hasError = false;
    const newErrors: LeaveRequestErrors = {};
    if (!form.startDate) {
      newErrors.startDate = "Start Date is required";
      hasError = true;
    }
    if (!form.endDate) {
      newErrors.endDate = "End Date is required";
      hasError = true;
    }
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      newErrors.endDate = "End Date cannot be before Start Date";
      hasError = true;
    }
    if (!form.reason) {
      newErrors.reason = "Reason is required";
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/leave/apply", form);
      navigate(`/leave/myleaves`);
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
            "Failed to submit leave request"
        );
      } else {
        setServerError("Failed to submit leave request");
      }
      setSubmitting(false);
    }
  };

  // Set min date for StartDate as today
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <h2 className="text-center">Apply for Leave</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeId">Employee Name</label>
          <input
            type="hidden"
            name="employeeId"
            value={form.employeeId}
            readOnly
          />
          <p className="form-control-plaintext">
            <strong>{employee?.fullName || ""}</strong>
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            name="startDate"
            id="StartDate"
            className="form-control"
            type="date"
            min={today}
            value={form.startDate}
            onChange={handleChange}
            required
          />
          {errors.startDate && (
            <span className="text-danger">{errors.startDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            name="endDate"
            id="EndDate"
            className="form-control"
            type="date"
            min={form.startDate || today}
            value={form.endDate}
            onChange={handleChange}
            required
          />
          {errors.endDate && (
            <span className="text-danger">{errors.endDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            name="reason"
            id="reason"
            className="form-control"
            value={form.reason}
            onChange={handleChange}
            required
          />
          {errors.reason && (
            <span className="text-danger">{errors.reason}</span>
          )}
        </div>
        <br />

        {serverError && (
          <div className="text-danger" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}

        <button type="submit" className="btn-approve btn-action" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </>
  );
};

export default LeaveApply;