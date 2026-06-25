// /@.*\./

// /^.{6,}$/

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = () => {
    setEmail("");
    setPassword("");
    setShowMessage(true);
  };

  const validateEmail = () => {
    return /@.*\./.test(email.toLocaleLowerCase());
  };

  const validatePassword = () => {
    return /^.{6,}$/.test(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>{email && !validateEmail(email) && <p>Email Incorrect</p>}</div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        {password && !validatePassword(password) && <p>password Incorrect</p>}
      </div>

      <div>
        <button
          disabled={!(validateEmail(email) && validatePassword(password))}
        >
          Send
        </button>
      </div>

      <div>
        {showMessage && <p>All CORRECT</p>}
      </div>


    </form>
  );
}
