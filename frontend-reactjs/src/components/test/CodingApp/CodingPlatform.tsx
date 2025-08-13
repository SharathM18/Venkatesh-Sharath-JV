import React, { use, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodingPlatform.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface QuestionResponse {
  status: string;
  problemKey: string;
  title: string;
  description: string;
  difficulty: string;
  functionSignature: string;
  functionName: string;
  testCases: TestCase[];
}

interface RunResponse {
  status: string;
  total: number;
  passed: number;
  output: string;
  testResults: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    stderr: string;
  }[];
}
interface Props {
  handleFinalSubmit: () => void;
}
const CodingPlatform: React.FC<Props> = ({ handleFinalSubmit }) => {
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState(
    "58367b22-5147-4543-812c-48177a1f5feb"
  );
  //   const applicantId = "c263062f-34ff-458e-a18f-551d454f2d80";
  //   const attemptId = "fdffacf7-832a-457d-af89-d9aa01129d74";
  const applicantId = localStorage.getItem("applicantId");
  const attemptId = localStorage.getItem("attemptId");

  const languageMap: any = {
    "ade9c9b9-b772-459e-9e98-d5f591f83826": "python",
    "af451228-e9e6-404f-97ac-070e89e23ff9": "javascript",
    "58367b22-5147-4543-812c-48177a1f5feb": "java",
    "6d823c70-4ed1-4c6f-8cd6-a188d820881d": "csharp",
  };
  const selectedLanguage = languageMap[language];
  //   var { token, applicantId, attemptId } = useParams();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log(
          "Title",
          `http://localhost:3000/applicant-questions/start/${applicantId}/${attemptId}/${language}`
        );

        const res = await axios.get(
          `http://localhost:3000/applicant-questions/start/${applicantId}/${attemptId}/${language}`
        );
        const data = res.data;
        setQuestion(data);
        if (language === "ade9c9b9-b772-459e-9e98-d5f591f83826") {
          setCode(
            `${data.functionSignature}` + "\n\n" + `# Write your code here\n`
          );
        } else if (language === "af451228-e9e6-404f-97ac-070e89e23ff9") {
          setCode(
            `${data.functionSignature}` + "\n{\n" + `// Write your code here\n}`
          );
        } else if (language === "58367b22-5147-4543-812c-48177a1f5feb") {
          setCode(
            `${data.functionSignature}` + "\n{\n" + `// Write your code here\n}`
          );
        } else if (language === "6d823c70-4ed1-4c6f-8cd6-a188d820881d") {
          setCode(
            `${data.functionSignature}` + "\n{\n" + `// Write your code here\n}`
          );
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [language]);
  const navigate = useNavigate();
  const handleRun = () => {
    if (!question) return;
    setRunning(true); // start loader
    fetch("http://localhost:3000/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemKey: question.problemKey,
        language: selectedLanguage,
        userCode: code,
      }),
    })
      .then((res) => res.json())
      .then((data: RunResponse) => setRunResult(data))
      .catch(console.error)
      .finally(() => setRunning(false)); // stop loader
  };

  const handleSubmit = () => {
    if (!question) return;
    setSubmitting(true);
    fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicantId: applicantId,
        problemKey: question.problemKey,
        language: selectedLanguage,
        userCode: code,
      }),
    })
      .then((res) => res.json())
      .then(() => handleFinalSubmit())
      .then(() => alert("Submission successful!"))
      .then(() => navigate("/thank-you"))
      .catch(console.error);
  };

  if (loading) return <p className="loading">Loading question...</p>;

  return (
    <div className="coding-platform">
      <div className="left-panel">
        {question && (
          <>
            <h1>{question.title}</h1>
            <p>{question.description}</p>

            <h3>Test Cases</h3>
            <ul className="test-cases">
              {question.testCases.length > 0 && (
                <>
                  <li>
                    <div className="test-case">
                      <h4>Test Case 1</h4>
                      <strong>Input:</strong>
                      <pre>{question.testCases[0].input}</pre>
                      <strong>Expected Output:</strong>
                      <pre>{question.testCases[0].expectedOutput}</pre>
                    </div>
                  </li>
                  <li>
                    <div className="test-case">
                      <h4>Test Case 2</h4>
                      <strong>Input:</strong>
                      <pre>{question.testCases[1].input}</pre>
                      <strong>Expected Output:</strong>
                      <pre>{question.testCases[1].expectedOutput}</pre>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </>
        )}
      </div>

      <div className="right-panel">
        <div className="language-selector">
          <label htmlFor="language">Language: </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ade9c9b9-b772-459e-9e98-d5f591f83826">Python</option>
            <option value="af451228-e9e6-404f-97ac-070e89e23ff9">
              JavaScript
            </option>
            <option value="58367b22-5147-4543-812c-48177a1f5feb">Java</option>
            <option value="6d823c70-4ed1-4c6f-8cd6-a188d820881d">C#</option>
          </select>
        </div>

        <div className="editor-section">
          <Editor
            height="60vh"
            language={languageMap[language]}
            value={code}
            theme="vs-dark"
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />

          <div className="button-row">
            <button
              className="btn run-btn"
              onClick={handleRun}
              disabled={running}
            >
              {running ? "Running..." : "Run"}
            </button>
            <button
              className="btn submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {running && <p className="loading">Running code, please wait...</p>}

        {runResult && !running && (
          <div className="results">
            <h3>Run Results</h3>
            <p>
              Status: {runResult.status} ({runResult.passed}/{runResult.total}{" "}
              passed)
            </p>
            <ul>
              {runResult.testResults.map((tr, index) => (
                <li
                  key={index}
                  className={`result-item ${tr.passed ? "passed" : "failed"}`}
                >
                  <div>
                    <strong>Input:</strong> {tr.input}
                  </div>
                  <div>
                    <strong>Expected:</strong> {tr.expected}
                  </div>
                  <div>
                    <strong>Actual:</strong> {tr.actual}
                  </div>
                  <div>
                    <strong>Passed:</strong> {tr.passed ? "✅" : "❌"}
                  </div>
                  <div>{tr?.stderr}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPlatform;
