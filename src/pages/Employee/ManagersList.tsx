import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
type Manager = {
  employeeId: number;
  fullName: string;
  email: string;
  departmentName: string;
};

const ManagersList = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/employees/managers")
      .then((res) => {
        setManagers(res.data);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load managers.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="data-section">
      <h2 className="data-title">Manager Details</h2>
      {error ? (
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