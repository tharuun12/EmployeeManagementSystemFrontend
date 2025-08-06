import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { Link } from "react-router-dom";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/department/")
      .then((res) => {
        setDepartments(res.data);
        setLoading(true);
      })
      .catch(() => {
        toast.error("Failed to load departments.");
        setError("Failed to load departments.");
        setLoading(true);
      }).finally(() => {
        setLoading(false);
      });
  }, []);


  return (
    <div className="data-section">
      <h2 className="data-title">Departments</h2>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Link className="btn-action btn-create" style={{ fontSize: 18 }} to="/department/create">
          Add New Department
        </Link>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : departments.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Manager</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
              <tr key={item.departmentId}>
                <td>{item.departmentId}</td>
                <td>{item.departmentName}</td>
                <td>{item.manager?.fullName || "No Manager"}</td>
                <td>
                  <Link
                    to={`/department/edit/${item.departmentId}`}
                    className="btn-edit btn-action"
                  >
                    Edit
                  </Link>
                  
                </td>
                <td>
                  <Link
                    to={`/department/delete/${item.departmentId}`}
                    className="btn-delete btn-action"
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