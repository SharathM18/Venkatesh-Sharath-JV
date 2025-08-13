import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/AddQuestions.css";

const AddQuestions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="add-questions-container">
      <h2>Add the questions</h2>
      <div className="button-container">
        <button
          className="question-button"
          onClick={() => navigate("/add-mcq")}
        >
          <div className="icon">McQ</div>
          <div>
            <div>MCQs</div>
            <div>Questions</div>
          </div>
        </button>

        {/* <button className="question-button" onClick={() => navigate('/add-coding')}>
          <div className="icon">{`</>`}</div>
          <div>
            <div>Coding</div>
            <div>Questions</div>
          </div>
        </button> */}
      </div>
    </div>
  );
};

export default AddQuestions;
