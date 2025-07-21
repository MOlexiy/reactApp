import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to={isAuthenticated ? "/home" : "/"}>React App</Link>
      </div>
      <nav className="header-nav">
        {isAuthenticated && user ? (
          <div className="user-menu-container" ref={menuRef}>
            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="profile-link">
              <span className="material-symbols-outlined">account_circle</span>
              <span className="username">{user.fullName}</span>
              <span className="material-symbols-outlined">
                {isMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </div>
            {isMenuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/company" onClick={() => setIsMenuOpen(false)}>
                    Company
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};