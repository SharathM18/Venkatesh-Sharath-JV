import React, { useEffect, useState } from "react";
import "./css/ViewCoding.css";

interface LanguageConfig {
  language: string;
  signature: string;
  functionName: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  key: string;
  title: string;
  description: string;
  difficulty: string;
  languageConfigs: LanguageConfig[];
  testCases: TestCase[];
}

const ViewCoding: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/problems")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.data || []);
        setFilteredProblems(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = problems;

    if (difficultyFilter) {
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    if (searchKey) {
      filtered = filtered.filter((p) =>
        p.key.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [difficultyFilter, searchKey, problems]);

  return (
    <div className="coding-questions-container">
      <h1>Coding Problems</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by key..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : filteredProblems.length === 0 ? (
        <p className="no-results">No problems found.</p>
      ) : (
        <div className="problems-list">
          {filteredProblems.map((problem) => (
            <div key={problem.key} className="problem-card">
              <div className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </div>
              <h2>{problem.title}</h2>
              {/* <p className="key">Key: {problem.key}</p> */}
              <p className="description">{problem.description}</p>

              {/* <h4>Language Signatures:</h4>
              <ul>
                {problem.languageConfigs.map((lang, index) => (
                  <li key={index}>
                    <strong>{lang.language}:</strong> {lang.signature}
                  </li>
                ))}
              </ul> */}

              {problem.testCases.length > 0 && (
                <>
                  <h4>Test Cases:</h4>
                  <ul>
                    {problem.testCases.map((test, idx) => (
                      <li key={idx}>
                        <strong>Input:</strong> {test.input} |{" "}
                        <strong>Expected Output:</strong> {test.expectedOutput}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCoding;
