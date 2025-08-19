import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/CodingResult.css";
interface TestResult {
  input: string;
  actual: string;
  expected: string;
  passed: boolean;
  stderr?: string;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
}

interface Problem {
  key: string;
  title: string;
  description: string;
  difficulty: string;
}

interface CodingResult {
  submissionId: string;
  status: string;
  code: string;
  output: string;
  testResults: TestResult[];
  applicant: Applicant;
  problem: Problem;
}

const CodingResultPage = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [codingResults, setCodingResults] = useState<CodingResult[] | null>(
    null
  );

  useEffect(() => {
    if (applicantId) {
      fetch(`http://localhost:3000/applicants/results/coding/${applicantId}`)
        .then((res) => res.json())
        .then((data) => setCodingResults(data.data))
        .catch(console.error);
    }
  }, [applicantId]);

  if (!codingResults)
    return <div className="coding-result-container">Loading...</div>;

  return (
    <div className="coding-result-container">
      {codingResults.map((result) => (
        <div className="coding-card" key={result.submissionId}>
          <h2 className="coding-problem-title">
            {result.problem.title} ({result.problem.difficulty})
          </h2>
          <p className="coding-applicant">
            <strong>Applicant:</strong> {result.applicant.name} (
            {result.applicant.email})
          </p>
          <p className="coding-status">
            <strong>Status:</strong> {result.status}
          </p>
          <p className="coding-code-label">Code:</p>
          <pre className="coding-code">{result.code}</pre>
          <h3>Test Results:</h3>
          <div className="coding-table-responsive">
            <table className="coding-test-table">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected</th>
                  <th>Actual</th>
                  <th>Passed</th>
                </tr>
              </thead>
              <tbody>
                {result.testResults.map((test, index) => (
                  <tr
                    key={index}
                    className={test.passed ? "test-pass" : "test-fail"}
                  >
                    <td>{test.input}</td>
                    <td>{test.expected}</td>
                    <td>{test.actual}</td>
                    <td>{test.passed ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodingResultPage;
