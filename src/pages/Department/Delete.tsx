import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, useParams, Link } from "react-router-dom";

type Department = {
  departmentId: number;
  departmentName: string;
};

const DepartmentDelete = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Invalid department ID.");
      setLoading(false);
      return;
    }
    api
      .get(`/department/delete/${id}`)
      .then((res) => {
        setDepartment(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load department.");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!department) return;
    setDeleting(true);
    setError("");
    try {
      console.log("Deleting department:", department.departmentId);
      await api.delete(`/department/delete/${department.departmentId}`);
      navigate("/department");
    } catch {
      setError("Failed to delete department.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <h2>Delete Department</h2>
      <p>
        Are you sure you want to delete <strong>{department?.departmentName}</strong>?
      </p>
      <form onSubmit={handleDelete}>
        <input type="hidden" name="departmentId" value={department?.departmentId ?? ""} />
        <button type="submit" className="btn btn-danger" disabled={deleting}>
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <Link to="/department" className="btn btn-secondary" style={{ marginLeft: 8 }}>
          Cancel
        </Link>
      </form>
    </>
  );
};

export default DepartmentDelete;