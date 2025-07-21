import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";

export const RegisterPage = () => {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Паролі не збігаються");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    try {
      await auth.register({ email, username, fullName, company, password });
      navigate("/login");
    } catch (err) {
      setError("Помилка реєстрації: " + err.message);
      console.error("Помилка реєстрації:", err);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="company">Company:</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
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
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
