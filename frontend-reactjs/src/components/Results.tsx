import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./css/Results.css";

interface TestResult {
  passed: boolean;
}

interface CodingResult {
  testResults: TestResult[];
}

interface Applicant {
  id: string;
  name: string;
  mcqScore: number | null;
  codingResult: CodingResult[];
  questionCount: number;
}

const Results = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "mcq" | "coding">("name");

  useEffect(() => {
    fetch("http://localhost:3000/applicants/results")
      .then((res) => res.json())
      .then((data) => setApplicants(data.data))
      .catch(console.error);
  }, []);

  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicants.filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "mcq") return (b.mcqScore ?? 0) - (a.mcqScore ?? 0);
      if (sortKey === "coding") {
        const aPass =
          a.codingResult[0]?.testResults.filter((tr) => tr.passed).length ?? 0;
        const bPass =
          b.codingResult[0]?.testResults.filter((tr) => tr.passed).length ?? 0;
        return bPass - aPass;
      }
      return 0;
    });
  }, [applicants, searchTerm, sortKey]);

  return (
    <div className="results-container">
      <h1>Applicant Results</h1>

      <div className="results-controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
        >
          <option value="name">Sort by Name</option>
          <option value="mcq">Sort by MCQ Score</option>
          <option value="coding">Sort by Coding Passed</option>
        </select>
      </div>

      <div className="results-table-responsive">
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>MCQ Score</th>
              <th>Coding Test Cases</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.id}</td>
                <td>{applicant.name}</td>
                <td>
                  {applicant.mcqScore ?? "N/A"} / {applicant.questionCount}
                </td>
                <td>
                  {applicant.codingResult.length > 0
                    ? applicant.codingResult[0].testResults.filter(
                        (tr) => tr.passed
                      ).length
                    : 0}
                  /
                  {applicant.codingResult.length > 0
                    ? applicant.codingResult[0].testResults.length
                    : 0}
                </td>
                <td className="results-actions">
                  <Link to={`/results/mcq/${applicant.id}`}>View MCQ</Link>
                  <Link to={`/results/coding/${applicant.id}`}>
                    View Coding
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
