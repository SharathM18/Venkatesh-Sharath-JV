import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Jobs.css";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  createdBy: string;
}

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    clientName: "",
    createdBy: "",
    createdAt: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    clientName: "",
    createdBy: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/jobs");
        setJobs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        toast.error("Failed to fetch jobs list");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (["title", "clientName", "createdBy"].includes(name)) {
      if (value && !/^[A-Za-z\s]*$/.test(value)) {
        error = "Only letters and spaces allowed";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (["title", "clientName", "createdBy"].includes(key)) {
      validateField(key, value);
    }
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      clientName: "",
      createdBy: "",
      createdAt: "",
    });
    setErrors({
      title: "",
      clientName: "",
      createdBy: "",
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const dateFormatted = new Date(job.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      job.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      job.clientName.toLowerCase().includes(filters.clientName.toLowerCase()) &&
      job.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()) &&
      dateFormatted.toLowerCase().includes(filters.createdAt.toLowerCase())
    );
  });

  return (
    <>
      <div className="title">
        <h2>List of Jobs</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="question-button"
            onClick={() => navigate("/add-job")}
          >
            Add Job
          </button>
          <button className="question-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="all-users-container">
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th style={{ display: "flex", flexDirection: "column" }}>
                    Title
                    <input
                      type="text"
                      placeholder="Search title"
                      value={filters.title}
                      onChange={(e) => handleFilterChange(e, "title")}
                    />
                    {errors.title && <p className="error">{errors.title}</p>}
                  </th>
                  <th>
                    Client Name
                    <input
                      type="text"
                      placeholder="Search client"
                      value={filters.clientName}
                      onChange={(e) => handleFilterChange(e, "clientName")}
                    />
                    {errors.clientName && (
                      <p className="error">{errors.clientName}</p>
                    )}
                  </th>
                  <th>
                    Created By
                    <input
                      type="text"
                      placeholder="Search creator"
                      value={filters.createdBy}
                      onChange={(e) => handleFilterChange(e, "createdBy")}
                    />
                    {errors.createdBy && (
                      <p className="error">{errors.createdBy}</p>
                    )}
                  </th>
                  <th>
                    Created At
                    <input
                      type="text"
                      placeholder="Search date"
                      value={filters.createdAt}
                      onChange={(e) => handleFilterChange(e, "createdAt")}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.clientName}</td>
                      <td>{job.createdBy}</td>
                      <td>
                        {new Date(job.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Jobs;
