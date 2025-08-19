import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/McqResults.css";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQ {
  questionId: string;
  questionTitle: string;
  difficulty: string;
  options: Option[];
  selectedOption?: Option;
  status: string;
}

const McqResult = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [mcqs, setMcqs] = useState<MCQ[] | null>(null);

  useEffect(() => {
    if (applicantId) {
      fetch(`http://localhost:3000/applicants/results/mcqs/${applicantId}`)
        .then((res) => res.json())
        .then((data) => setMcqs(data.data))
        .catch(console.error);
    }
  }, [applicantId]);

  const calculateScore = () => {
    if (!mcqs) return 0;
    return mcqs.filter((q) => {
      const correctOption = q.options.find((o) => o.isCorrect);
      return correctOption && q.selectedOption?.id === correctOption.id;
    }).length;
  };

  if (!mcqs)
    return <div className="mcq-result-container">Loading MCQ results...</div>;

  return (
    <div className="mcq-result-container">
      <h2>MCQ Results</h2>
      <p className="mcq-final-score">
        Final Score: {calculateScore()} / {mcqs.length}
      </p>
      {mcqs.map((mcq, idx) => {
        const correctOption = mcq.options.find((o) => o.isCorrect);
        const selectedOptionId = mcq.selectedOption?.id;

        return (
          <div className="mcq-question-card" key={mcq.questionId}>
            <h4 className="mcq-question-title">
              {idx + 1}. {mcq.questionTitle} ({mcq.difficulty})
            </h4>
            <ul className="mcq-options-list">
              {mcq.options.map((option) => {
                const isSelected = option.id === selectedOptionId;
                const isCorrect = option.isCorrect;

                return (
                  <li
                    key={option.id}
                    className={`mcq-option ${isCorrect ? "correct" : ""} ${
                      isSelected && !isCorrect ? "incorrect-selected" : ""
                    }`}
                  >
                    {option.text}
                    {isSelected ? " ⬅ Your answer" : ""}
                    {isCorrect ? " ✔ Correct" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default McqResult;
