import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/shared/Button";

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
    setLoading(false);
    api
      .get("/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch(() => {
        setError("Failed to load employees.");
      }).finally(() => {
        setLoading(true);
      });
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-section">
      <h2 className="data-title">Employees</h2>


      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Link className="btn-action btn-create" style={{ fontSize: 18 }} to="/employee/create">
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
                <LoadingSpinner />
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
                    className="btn-edit btn-action"
                    to={`/employee/edit/${e.employeeId}`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn-delete btn-action"
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