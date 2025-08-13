import { useSelector } from "react-redux";
import "./Navbar.css";
import { type RootState } from "../../../redux/store";

const Navbar = () => {
  const capturedImage = useSelector((state: RootState) => state.proctor.capturedImage);
  return (
    <nav className="navbarr">
      <h2 className="navbarr-title" style={{"color":"green"}}>mirafra</h2>
      <div className="navbarr-right">
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured Face"
            className="captured-image"
            width={50}
            height={50}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;