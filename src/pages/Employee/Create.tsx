import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, Link } from "react-router-dom";

type Department = {
  departmentId: number;
  departmentName: string;
};

type EmployeeForm = {
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

const EmployeeCreate = () => {
  const [form, setForm] = useState<EmployeeForm>({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    departmentId: "",
    isActive: "true",
    leaveBalance: "",
  });
  const [errors, setErrors] = useState<EmployeeErrors>({});
  const [serverError, setServerError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch departments
    api.get("/department")
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments([]));
    // Fetch roles
    api.get("/roles")
      .then(res => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);
  console.log("roles", roles);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await api.post("/employees/create", {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        role: form.role,
        departmentId: Number(form.departmentId),
        isActive: form.isActive === "true",
        leaveBalance: Number(form.leaveBalance),
      });
      navigate("/employee/employeelist");
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
            "Failed to create employee"
        );
      } else {
        setServerError("Failed to create employee");
      }
    }
  };

  return (
    <div className="create-form">
      <h2 className="form-title">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="form-error" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
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
          <label className="form-label" htmlFor="leaveBalance">Total Leave Entitlement</label>
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
          <button type="submit" className="btn btn-success">Create</button>
          <Link to="/employee" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;