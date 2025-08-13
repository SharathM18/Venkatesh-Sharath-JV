import React, { useState, useEffect } from "react";
import "./css/SendTest.css";
import axios from "axios";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  clientName: string;
}

const SendTest = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    job: "",
    experience: "",
    skillA: "",
    skillB: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchSkillsAndJobs = async () => {
      try {
        const [skillsRes, jobsRes] = await Promise.all([
          axios.get("http://localhost:3000/skills"),
          axios.get("http://localhost:3000/jobs"),
        ]);
        setSkills(skillsRes.data.data || []);
        setJobs(jobsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to load skills or jobs.";
        toast.error(errorMessage);
      }
    };

    fetchSkillsAndJobs();
  }, []);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Invalid email format";
    }
    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (!/^[A-Za-z\s]{3,}$/.test(value))
        error = "Name must be at least 3 letters";
    }
    if (name === "phone") {
      if (!value.trim()) error = "Phone is required";
      else if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live validation for the three fields
    if (["email", "name", "phone"].includes(name)) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const emailError = validateField("email", formData.email);
    const nameError = validateField("name", formData.name);
    const phoneError = validateField("phone", formData.phone);

    if (emailError || nameError || phoneError) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const ta_id = user?.id || "";

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      job_id: formData.job,
      experience_level_id: formData.experience,
      primary_skill_id: formData.skillA,
      secondary_skill_id: formData.skillB || null,
      ta_id,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/test/generate-link",
        payload
      );
      toast.success("Test link sent successfully!");
      console.log("Response:", response.data);

      // Reset form
      setFormData({
        email: "",
        name: "",
        phone: "",
        job: "",
        experience: "",
        skillA: "",
        skillB: "",
      });
      setErrors({ email: "", name: "", phone: "" });
    } catch (error) {
      console.error("Error sending link:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to send test link.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-link-container">
      <h2>Send Test Link</h2>
      <form className="send-link-form" onSubmit={handleSubmit}>
        <input
          className="send-link-input"
          type="email"
          name="email"
          placeholder="Email Id:"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          className="send-link-input"
          type="text"
          name="name"
          placeholder="Name:"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          className="send-link-input"
          type="tel"
          name="phone"
          placeholder="Phone no."
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <select
          className="send-link-input"
          name="job"
          value={formData.job}
          onChange={handleChange}
          required
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} ({job.clientName})
            </option>
          ))}
        </select>

        <select
          className="send-link-input"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        >
          <option value="">Select experience level</option>
          <option value="a0c3f9cb-d673-461f-b130-4437e57cedcf">Fresher</option>
          <option value="833d6ee0-27f6-462f-aba3-f4df251bf47e">Junior</option>
          <option value="2ec03951-43b3-42a6-ad36-346d9b8d4ab6">
            Mid-Level
          </option>
          <option value="8b5adf1a-2ec5-4094-89a8-992cee152f07">Senior</option>
        </select>

        <select
          className="send-link-input"
          name="skillA"
          value={formData.skillA}
          onChange={handleChange}
          required
        >
          <option value="">Select Primary Skill A</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <select
          className="send-link-input"
          name="skillB"
          value={formData.skillB}
          onChange={handleChange}
        >
          <option value="">Select Primary Skill B (Optional)</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <button className="send-link-button" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Link"}
        </button>
      </form>
    </div>
  );
};

export default SendTest;
