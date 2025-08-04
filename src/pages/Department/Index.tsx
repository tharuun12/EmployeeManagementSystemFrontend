import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { Link } from "react-router-dom";

type Manager = {
  fullName: string;
};

type Department = {
  departmentId: number;
  departmentName: string;
  manager?: Manager;
};

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/department/")
      .then((res) => {
        console.log(res.data);
        setDepartments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load departments.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Departments</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-primary" to="/department/create">
          Create New Department
        </Link>
      </div>
      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : departments.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
              <tr key={item.departmentId}>
                <td>{item.departmentId}</td>
                <td>{item.departmentName}</td>
                <td>{item.manager?.fullName || ""}</td>
                <td>
                  <Link
                    to={`/department/edit/${item.departmentId}`}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/department/delete/${item.departmentId}`}
                    className="btn btn-sm btn-danger"
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">No departments found.</div>
      )}
    </div>
  );
};

export default DepartmentList;