import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch departments and roles on mount
  useEffect(() => {
    setLoading(false)
    api.get("/department/create")
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
    api.get("/roles")
      .then(res => setRoles(res.data))
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
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
  };

  return (
    <div className="employee-filter-page">
      <h2 className="filter-title">Filter Employees</h2>
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-col">
            <label htmlFor="departmentId" className="filter-label">Department</label>
            <select
              id="departmentId"
              name="departmentId"
              className="filter-select"
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
          <div className="filter-col">
            <label htmlFor="role" className="filter-label">Role</label>
            <select
              id="role"
              name="role"
              className="filter-select"
              value={filters.role}
              onChange={handleChange}
            >
              <option value="">-- All Roles --</option>
              {roles.map((role: any) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-col filter-col-btn">
            <button type="submit" className="filter-btn">
              Apply Filter
            </button>
          </div>
        </div>
      </form>

      <hr className="separator" />

      {loading ? (
        <LoadingSpinner />
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