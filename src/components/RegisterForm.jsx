// /@.*\./

// /^.{6,}$/

// Requisitos:
// El formulario tiene dos campos: email y contraseña.
// Validar el email: debe tener un formato válido (incluir un @ y un punto después).
// Validar la contraseña: debe tener al menos 6 caracteres.
// Mostrar un mensaje de error debajo de cada campo cuando su valor sea inválido.
// El botón de "Enviar" debe estar deshabilitado mientras el formulario no sea válido.
// Al enviar el formulario correctamente, mostrar un mensaje de éxito.

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    setShowMessage(true);
  };

  const validateEmail = (email) => {
    return /@.*\./.test(email.toLowerCase());
  };

  const validatePassword = (password) => {
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

        {email && !validateEmail(email) && <p>Email incorrect</p>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password && !validatePassword(password) && <p>Password incorrect</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={!validateEmail(email) && !validatePassword(password)}
        >
          Send
        </button>
      </div>

      <div>{showMessage && <p>All Correct</p>}</div>
    </form>
  );
}
