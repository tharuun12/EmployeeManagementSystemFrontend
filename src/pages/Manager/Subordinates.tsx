import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  leaveBalance: number;
};

const Subordinates = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/manager/subordinates")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subordinates.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Subordinates</h2>
      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : employees.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Role</th>
              <th>Leave Balance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e, idx) => (
              <tr key={idx}>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.phoneNumber}</td>
                <td>
                  <span className={`data-status ${e.isActive ? "approved" : "rejected"}`}>
                    {e.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{e.role}</td>
                <td>{e.leaveBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">No employee records available.</div>
      )}
    </div>
  );
};

export default Subordinates;