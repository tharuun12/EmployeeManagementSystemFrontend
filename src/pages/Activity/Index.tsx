import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { Link } from "react-router-dom";

type Employee = {
  fullName: string;
  email: string;
};

const ActivityIndex = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/activity/employees")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employee activity records.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Employee Activity Tracker</h2>
      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : employees.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>
                  <Link
                    to={`/activity/loginhistory/${encodeURIComponent(emp.email)}`}
                    className="btn btn-sm btn-primary"
                  >
                    Login History
                  </Link>
                  {/* 
                  <Link
                    to={`/activity/recentactivity/${encodeURIComponent(emp.email)}`}
                    className="btn btn-sm btn-secondary"
                  >
                    Recent Activity
                  </Link>
                  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">
          No employee activity records available.
        </div>
      )}
    </div>
  );
};

export default ActivityIndex;