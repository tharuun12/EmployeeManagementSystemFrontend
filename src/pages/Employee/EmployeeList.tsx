import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { Link, useNavigate } from "react-router-dom";

type Department = {
  departmentName: string;
};

type Employee = {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  department?: Department;
  leaveBalance: number;
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/employees")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employees.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Employees</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-primary" to="/employee/create">
          Add New Employee
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Role</th>
            <th>Department</th>
            <th>Leave Balance</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="data-empty">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={9} className="data-empty">
                {error}
              </td>
            </tr>
          ) : employees.length > 0 ? (
            employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.phoneNumber}</td>
                <td>
                  <span
                    className={
                      "data-status " + (e.isActive ? "approved" : "rejected")
                    }
                  >
                    {e.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{e.role}</td>
                <td>{e.department?.departmentName || ""}</td>
                <td>{e.leaveBalance}</td>
                <td>
                  <Link
                    className="btn btn-warning btn-sm me-1 d-inline-block"
                    to={`/employee/edit/${e.employeeId}`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-danger btn-sm d-inline-block"
                    to={`/employee/delete/${e.employeeId}`}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="data-empty">
                No employee records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;