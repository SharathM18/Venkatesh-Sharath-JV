interface Props {
  score: number | null;
  total: number;
}

const Result = ({ score, total }: Props) => {
  return (
    <div className="result">
      <h3>Test Completed</h3>
      <p>Your Score: {score} / {total}</p>
    </div>
  );
};

export default Result;