import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
type Manager = {
  employeeId: number;
  fullName: string;
  email: string;
  departmentName: string;
};

const ManagersList = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/employees/managers")
      .then((res) => {
        setManagers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load manager records.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Manager Details</h2>
      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : managers.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.employeeId}>
                <td>{manager.employeeId}</td>
                <td>{manager.fullName}</td>
                <td>{manager.email}</td>
                <td>{manager.departmentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">No manager records available.</div>
      )}
    </div>
  );
};

export default ManagersList;