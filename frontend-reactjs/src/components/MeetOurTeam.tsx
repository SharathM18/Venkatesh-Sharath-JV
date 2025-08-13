import "./css/MeetOurTeam.css";

const teamMembers = [
  {
    name: "Venkatesh Madanwale",
    role: "Team Leader • Full-Stack & Management",
    image: "/src/assets/1.png",
    linkedIn: "https://in.linkedin.com/in/venkatesh-madanwale",
  },
  {
    name: "Sharath M.",
    role: "Full-Stack Developer & DB Admin",
    image: "/src/assets/2.png",
    linkedIn: "https://in.linkedin.com/in/sharathm18",
  },
  {
    name: "Sam C. K.",
    role: "Backend Developer",
    image: "/src/assets/3.png",
    linkedIn: "https://in.linkedin.com/in/",
  },
  {
    name: "Shruthi M. R.",
    role: "Backend Developer",
    image: "/src/assets/4.png",
    linkedIn: "https://in.linkedin.com/in/",
  },
  {
    name: "Bharathi. P. M.",
    role: "Backend Developer",
    image: "/src/assets/5.png",
    linkedIn: "https://in.linkedin.com/in/",
  },
];

const MeetOurTeam = () => {
  return (
    <section className="clean-team-container">
      <h2 className="clean-team-title">Meet Our Team</h2>
      <div className="clean-team-grid">
        {teamMembers.map((member, index) => (
          <a href={member.linkedIn}>
            <div className="clean-team-card" key={index}>
              <div className="clean-image-wrapper">
                <img src={member.image} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MeetOurTeam;
