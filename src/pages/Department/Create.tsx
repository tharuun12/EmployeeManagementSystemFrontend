import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useNavigate, Link } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/employees")
      .then((res) => setManagers(res.data))
      .catch(() => setManagers([]));
      
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    // Basic validation for department name
    if (!form.departmentName) {
      setErrors((prev) => ({
        ...prev,
        departmentName: "Department Name is required",
      }));
      return;
    }

    try {
      const payload: any = {
        DepartmentName: form.departmentName,
      };

      // Only add ManagerId if a manager is selected
      if (form.managerId) {
        payload.ManagerId = Number(form.managerId);
      }

      await api.post("/department/create", payload);
      navigate("/department");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response &&
        typeof (err as any).response.data === "object" &&
        (err as any).response.data !== null
      ) {
        setServerError(
          ((err as any).response.data.message as string) ||
            "Failed to create department"
        );
      } else {
        setServerError("Failed to create department");
      }
    }
  };


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
    Manager <span style={{ fontWeight: "normal", color: "#666" }}>(Optional)</span>
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
          <button type="submit" className="btn btn-success">
            Create
          </button>
          <Link to="/department" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DepartmentCreate;