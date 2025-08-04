import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { Link } from "react-router-dom";

type Employee = {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

const AdminEmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/employees")
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
    <div>
      <h2>Employees</h2>
      <Link to="/admin/create" className="btn btn-primary mb-2">
        Add New
      </Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5}>{error}</td>
            </tr>
          ) : employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.role}</td>
                <td>
                  <Link
                    to={`/admin/edit/${emp.employeeId}`}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/delete/${emp.employeeId}`}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEmployeeList;