import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";

type Manager = {
  employeeId: number;
  fullName: string;
};

type DepartmentForm = {
  departmentName: string;
  managerId: string;
};

type DepartmentErrors = {
  departmentName?: string;
  managerId?: string;
};

const DepartmentCreate = () => {
  const [form, setForm] = useState<DepartmentForm>({
    departmentName: "",
    managerId: "",
  });
  const [errors, setErrors] = useState<DepartmentErrors>({});
  const [serverError, setServerError] = useState("");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/employees")
      .then((res) => setManagers(res.data))
      .catch(() => setManagers([]))
      .finally(() => setLoading(false));
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setServerError("");

    if (!form.departmentName) {
      setErrors((prev) => ({
        ...prev,
        departmentName: "Department Name is required",
      }));
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        DepartmentName: form.departmentName,
      };

      if (form.managerId) {
        payload.ManagerId = Number(form.managerId);
      }

      await api.post("/department/create", payload);
      notifySuccess("Department created successfully");
      navigate("/department");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create department";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-form">
      <h2 className="form-title">Create Department</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="form-error" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="departmentName">
            Department Name
          </label>
          <input
            name="departmentName"
            id="departmentName"
            className="form-control"
            value={form.departmentName}
            onChange={handleChange}
            required
          />
          {errors.departmentName && (
            <span className="form-error">{errors.departmentName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="managerId">
            Manager 
          </label>
          <select
            name="managerId"
            id="managerId"
            className="form-control"
            value={form.managerId}
            onChange={handleChange}
          >
            <option value="">-- No Manager Assigned --</option>
            {managers.map((manager) => (
              <option key={manager.employeeId} value={manager.employeeId}>
                {manager.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">
            Create
          </button>
          <Link to="/department" className="btn-cancel btn-action ">
            Back
          </Link>
        </div>

      </form>
    </div>
  );
};

export default DepartmentCreate;