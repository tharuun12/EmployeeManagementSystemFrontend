import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { number } from "prop-types";
type Department = {
  departmentId: number;
  departmentName: string;
};

type EmployeeForm = {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  departmentId: string;
  isActive: string;
  leaveBalance: string;
};

type EmployeeErrors = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  departmentId?: string;
  isActive?: string;
  leaveBalance?: string;
};

const EmployeeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<EmployeeForm>({
    employeeId: 0,
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    departmentId: "",
    isActive: "true",
    leaveBalance: "",
  });
  const [prevLeaveBalance, setPrevLeaveBalance] = useState<string>("");
  const [errors, setErrors] = useState<EmployeeErrors>({});
  const [serverError, setServerError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee, departments, and roles
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empRes, deptRes, roleRes] = await Promise.all([
          api.get(`/employees/edit/${id}`),
          api.get("/department"),
          api.get("/roles"),
        ]);
        await setLoading(false);
        const empData = empRes.data;

        setForm({
          employeeId: empData.employee.employeeId || "",
          fullName: empData.employee.fullName || "",
          email: empData.employee.email || "",
          phoneNumber: empData.employee.phoneNumber || "",
          role: empData.employee.role || "",
          departmentId: empData.employee.departmentId?.toString() || "",
          isActive: empData.employee.isActive ? "true" : "false",
          leaveBalance: empData.employee.leaveBalance?.toString() || "",
        });
        setPrevLeaveBalance(empData.employee.leaveBalance?.toString() || "");
        setDepartments(deptRes.data || []);
        setRoles(roleRes.data || []);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to load employee data.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setServerError("");
    if (!form.fullName) {
      setErrors(prev => ({ ...prev, fullName: "Full Name is required" }));
      return;
    }
    if (!form.email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!form.role) {
      setErrors(prev => ({ ...prev, role: "Role is required" }));
      return;
    }
    if (!form.departmentId) {
      setErrors(prev => ({ ...prev, departmentId: "Department is required" }));
      return;
    }
    if (!form.leaveBalance) {
      setErrors(prev => ({ ...prev, leaveBalance: "Leave Balance is required" }));
      return;
    }
    try {
      setLoading(true);
      await api.put(`/employees/edit/${form.employeeId}`, {
        employeeId: form.employeeId,
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        role: form.role,
        departmentId: Number(form.departmentId),
        isActive: form.isActive === "true",
        leaveBalance: Number(form.leaveBalance) + Number(prevLeaveBalance),
      });
      notifySuccess("Employee Updated successfully!");
      navigate("/employee/employeelist");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message;
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
      <h2 className="form-title">Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="form-error" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
        <input type="hidden" name="employeeId" value={form.employeeId} />

        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            name="fullName"
            id="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && (
            <span className="form-error">{errors.fullName}</span>
          )}
        </div>

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
          {errors.email && (
            <span className="form-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
          <input
            name="phoneNumber"
            id="phoneNumber"
            className="form-control"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <span className="form-error">{errors.phoneNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
          {errors.role && (
            <span className="form-error">{errors.role}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="departmentId">Department</label>
          <select
            name="departmentId"
            id="departmentId"
            className="form-control"
            value={form.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <span className="form-error">{errors.departmentId}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="isActive">Activity Status</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            value={form.isActive}
            onChange={handleChange}
            required
          >
            <option value="true">Active</option>
            <option value="false">Not Active</option>
          </select>
          {errors.isActive && (
            <span className="form-error">{errors.isActive}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="leaveBalance">Update Leave Balance ( current leave Balance: {prevLeaveBalance} )</label>
          <input
            name="leaveBalance"
            id="leaveBalance"
            className="form-control"
            value={form.leaveBalance}
            onChange={handleChange}
            required
          />
          {errors.leaveBalance && (
            <span className="form-error">{errors.leaveBalance}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">Update</button>
          <Link to="/employee" className="btn-cancel btn-action">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;