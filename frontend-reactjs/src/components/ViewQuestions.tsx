import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewQuestions.css';

const ViewQuestions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="view-questions-container">
      <h2>View Questions</h2>
      <div className="button-container">
        <button className="question-button" onClick={() => navigate('/view-mcq')}>
          <div className="icon">McQ</div>
          <div>
            <div>MCQs</div>
            <div>Questions</div>
          </div>
        </button>

        <button className="question-button" onClick={() => navigate('/view-coding')}>
          <div className="icon">{`</>`}</div>
          <div>
            <div>Coding</div>
            <div>Questions</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ViewQuestions;
