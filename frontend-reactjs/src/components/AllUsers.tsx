import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/AllUsers.css";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.phone.includes(filters.phone) &&
      user.role.toLowerCase().includes(filters.role.toLowerCase()) &&
      user.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  return (
    <div className="all-users-container">
      <h2>All Users</h2>
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>
                Name
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  placeholder="Filter"
                />
              </th>
              <th>
                Email
                <input
                  type="text"
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  placeholder="Filter"
                />
              </th>
              <th>
                Phone
                <input
                  type="text"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange("phone", e.target.value)}
                  placeholder="Filter"
                />
              </th>
              <th>
                Role
                <input
                  type="text"
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  placeholder="Filter"
                />
              </th>
              <th>
                Status
                <input
                  type="text"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  placeholder="Filter"
                />
              </th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                {/* <td>{new Date(user.createdAt).toLocaleString().slice(0, 9)}</td> */}

                <td>
                  {new Date(user.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
