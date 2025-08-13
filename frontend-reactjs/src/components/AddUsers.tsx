import React, { useState, useEffect } from "react";
import "./css/AddUsers.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { fetchRoles } from "../redux/slices/rolesSlice";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddUser: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { roles, loading: roleLoading } = useSelector(
    (state: RootState) => state.roles
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    password: "",
    status: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    password: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!/^[A-Za-z\s]{3,}$/.test(value))
          error = "Name must be at least 3 letters and contain only alphabets";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;

      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Phone number must be 10 digits";
        break;

      case "roleId":
        if (!value) error = "Please select a role";
        break;

      case "status":
        if (!value) error = "Please select a status";
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submit
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) isValid = false;
    });

    if (!isValid) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    try {
      const result = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(result)) {
        toast.success("User registered successfully!");
        navigate("/");
      } else {
        toast.error(
          "Registration failed: " + (result.payload || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <div className="add-user-container">
      <div className="form-section">
        <h2>
          Add users <span className="highlight">mirafra</span>
        </h2>
        <form className="user-form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Full Name:"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Id:"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone No.:"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <select name="roleId" value={formData.roleId} onChange={handleChange}>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && <p className="error">{errors.roleId}</p>}

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <p className="error">{errors.status}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password:"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">Register</button>
        </form>
        {roleLoading && <p>Loading roles...</p>}
      </div>

      <div className="image-section">
        <img
          src="src/assets/add-user-placeholder.png"
          alt="add-user-placeholder"
          className="illustration"
        />
      </div>
    </div>
  );
};

export default AddUser;
