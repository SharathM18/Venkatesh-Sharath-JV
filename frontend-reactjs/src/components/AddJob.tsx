import React, { useState } from 'react';
import './css/AddJob.css';
import axios from 'axios';
import { toast } from 'sonner'; // optional for better feedback
import { useNavigate } from 'react-router-dom';

const AddJob: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    job: '',
    client: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const createdBy = user?.id || '';

    if (!createdBy) {
      toast.error('User ID not found. Please login again.');
      return;
    }

    const postData = {
      title: formData.job,
      clientName: formData.client,
      createdById: createdBy,
    };

    try {
      const response = await axios.post('http://localhost:3000/jobs', postData);
      toast.success('Job added successfully!');
      console.log('Success:', response.data);

      // Clear form
      setFormData({ job: '', client: '' });
      navigate("/jobs")


    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to add job.');
    }
  };

  // const handleUpload = () => {
  //   alert('Upload XLSX clicked');
  // };

  return (
    <>
    <h2 className="add-job-title">Add Job...</h2>
    <div className="add-job-container">
      {/* <div className="upload-btn-container">
        <button className="upload-btn" onClick={handleUpload}>Upload xlsx</button>
        </div> */}

      <form className="job-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="job"
          placeholder="Job:"
          value={formData.job}
          onChange={handleChange}
          required
          />
        <input
          type="text"
          name="client"
          placeholder="Client:"
          value={formData.client}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">Add</button>
      </form>
    </div>
    </>
  );
};

export default AddJob;
