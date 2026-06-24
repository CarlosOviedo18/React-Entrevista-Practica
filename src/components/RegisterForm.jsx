import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() && password.trim() !== "") {
      setEmail("");
      setPassword("");
      setShowMessage(true);
    }
  };

  const validateEmail = (email) => {
    return /@.*\./.test(email.toLowerCase());
  };

  const validatePassword = () => {
    return /^.{6,}$/.test(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div>{email && !validateEmail(email) && <p>Email Incorrect</p>}</div>

      <label htmlFor="password">Password:</label>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        {password && !validatePassword(password) && <p>Password Incorrect</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={!validateEmail(email) && !validatePassword(password)}
        >
          Send
        </button>
      </div>

      {showMessage && <p>All Correct</p>}
    </form>
  );
}
