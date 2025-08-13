import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <img
            src="src/assets/mirafraLogo.svg"
            alt="Logo"
            className="navbar__logo"
          />
        </Link>
      </div>

      <div className="navbar__center">
        <ul className="navbar__links">
          {isAuthenticated && role == "super admin" && (
            <li>
              <Link to="/all-users">All Users</Link>
            </li>
          )}
          {isAuthenticated && role == "super admin" && (
            <li>
              <Link to="/add-users">Add Users</Link>
            </li>
          )}
          {isAuthenticated &&
            (role == "super admin" || role == "talent acquisition") && (
              <li>
                <Link to="/send-test">Send Test</Link>
              </li>
            )}
          {isAuthenticated &&
            (role == "super admin" ||
              role == "talent acquisition" ||
              role == "manager") && (
              <li>
                <Link to="/jobs">Jobs</Link>
              </li>
            )}
          {isAuthenticated && (role == "manager" || role == "super admin") && (
            <li>
              <Link to="/add-questions">Add Questions</Link>
            </li>
          )}
          {isAuthenticated &&
            (role == "super admin" ||
              role == "talent acquisition" ||
              role == "manager") && (
              <li>
                <Link to="/view-questions">View Questions</Link>
              </li>
            )}
          {isAuthenticated &&
            (role == "super admin" ||
              role == "talent acquisition" ||
              role == "manager") && (
              <li>
                <Link to="/results">Results</Link>
              </li>
            )}
        </ul>
      </div>

      <div className="navbar__right">
        {isAuthenticated ? (
          <>
            <span className="navbar__user">{user?.name}</span>
            <button className="navbar__btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <button className="navbar__btn">
            <Link to="/login" className="btn">
              Log in
            </Link>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// import './Navbar.css';
// import { Link } from 'react-router-dom';
// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar__left">
//         <Link to="/">
//         <img src="src/assets/mirafraLogo.svg" alt="Logo" className="navbar__logo" />
//         </Link>
//       </div>
//       <div className="navbar__center">
//         <ul className="navbar__links">
//           <li><Link to="/all-users">All Users</Link></li>
//           <li><Link to="/add-users">Add Users</Link></li>
//           <li><Link to="/send-test">Send Test</Link></li>
//           <li><Link to="/jobs">Jobs</Link></li>
//           <li><Link to="/add-questions">Add Questions</Link></li>
//           <li><Link to="/view-questions">View Questions</Link></li>
//           <li><Link to="/results">Results</Link></li>
//         </ul>
//       </div>
//       <div className="navbar__right">
//         <button className="navbar__btn"><Link to="/login" className='btn'>Log in</Link></button>
//         <button className="navbar__btn"><Link to="/logout" className='btn'>Log out</Link></button>

//       </div>
//     </nav>
//   );
// };

// export default Navbar;
