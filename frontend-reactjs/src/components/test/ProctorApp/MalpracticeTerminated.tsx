import { useEffect } from "react";

const MalpracticeTerminated = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "about:blank"; // Redirect after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <div style={styles.container}>
      <img
        src="https://i.imgur.com/VXUi6IE.png" // Example disheartened image
        alt="Disheartened"
        style={styles.image}
      />
      <h2 style={styles.message}>
        The test is terminated as you have done a lot of malpractices.
      </h2>
      <p style={styles.thankYou}>Thank you for appearing for the test!</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#444",
    fontFamily: "Arial, sans-serif",
  },
  image: {
    width: "200px",
    marginBottom: "20px",
  },
  message: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#c0392b",
  },
  thankYou: {
    fontSize: "18px",
    color: "#555",
  },
};

export default MalpracticeTerminated;
