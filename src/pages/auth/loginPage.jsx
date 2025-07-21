import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await auth.login(username, password);
      navigate("/profile"); // Redirect to profile page on successful login
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="flex flex-col">
          <div>
            <button className="pb-4" type="submit">
              Login
            </button>
          </div>
          <div>
            <button type="button" onClick={handleRegister} className="">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
