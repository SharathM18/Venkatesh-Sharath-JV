import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import MeetOurTeam from "./MeetOurTeam";
import "./css/Home.css"; // separate CSS

function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="app-container">
      <div className="dashboard-section">
        <h1 className="welcome-text">Hi {user?.name}...</h1>
        <img
          className="dashboard-image"
          src="/src/assets/dashboard.jpg.webp"
          alt="Dashboard"
        />
      </div>
      <div className="team-section">
        <MeetOurTeam />
      </div>
    </div>
  );
}

export default Home;
