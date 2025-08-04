import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, useParams, Link } from "react-router-dom";

type Employee = {
  employeeId: number;
  fullName: string;
};

const EmployeeDelete = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Invalid employee ID.");
      setLoading(false);
      return;
    }
    api
      .get(`/employees/delete/${id}`)
      .then((res) => {
        setEmployee(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employee.");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/employees/delete/${employee.employeeId}`);
      navigate("/employee/employeelist");
    } catch {
      setError("Failed to delete employee.");
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
      <h2>Delete Employee</h2>
      <p>
        Are you sure you want to delete <strong>{employee?.fullName}</strong>?
      </p>
      <form onSubmit={handleDelete}>
        <input type="hidden" name="employeeId" value={employee?.employeeId ?? ""} />
        <button type="submit" className="btn btn-danger" disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
        <Link to="/employee" className="btn btn-secondary" style={{ marginLeft: 8 }}>
          Cancel
        </Link>
      </form>
    </>
  );
};

export default EmployeeDelete;