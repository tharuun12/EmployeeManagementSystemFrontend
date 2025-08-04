import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
type Department = {
  departmentId: number;
  departmentName: string;
};

type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  department?: { departmentName: string };
  role: string;
};

const EmployeeFilter = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({ departmentId: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments and roles on mount
  useEffect(() => {
    api.get("/departments")
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments([]));
    api.get("/roles")
      .then(res => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  // Fetch employees when filters change
  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/employees/filter", { params: filters })
      .then(res => setEmployees(res.data))
      .catch(() => {
        setEmployees([]);
        setError("Failed to load employees.");
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The useEffect will trigger on filters change
  };

  return (
    <div className="employee-filter-page">
      <h2 className="filter-title">Filter Employees</h2>
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="departmentId" className="form-label">Department</label>
            <select
              id="departmentId"
              name="departmentId"
              className="form-select"
              value={filters.departmentId}
              onChange={handleChange}
            >
              <option value="">-- All Departments --</option>
              {departments.map(dept => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={filters.role}
              onChange={handleChange}
            >
              <option value="">-- All Roles --</option>
              {roles.map((role: any) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              Apply Filter
            </button>
          </div>
        </div>
      </form>

      <hr className="separator" />

      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : employees.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.department?.departmentName || ""}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">
          No employees found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default EmployeeFilter;