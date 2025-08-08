import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate, useParams, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

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
      notifySuccess("Employee Delete successfully!");
      navigate("/employee/employeelist");
    } catch (err: any){
      const errorMessage =
        err?.response?.data?.message || "Failed to delete employee.";
      toast.error(errorMessage);
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />
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
        <button type="submit" className="btn-delete btn-action" disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
        <Link to="/employee/employeelist" className="btn-cancel btn-action" style={{ marginLeft: 8 }}>
          Cancel
        </Link>
      </form>
    </>
  );
};

export default EmployeeDelete;