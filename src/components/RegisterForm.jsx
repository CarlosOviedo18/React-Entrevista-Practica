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
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div>{email && !validateEmail(email) && <p>Email incorrect</p>}</div>

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        {password && !validatePassword(password) && <p>Password incorrect</p>}
      </div>

      <button disabled={!(validateEmail(email) && validatePassword(password))}>
        Login
      </button>

      <div>{showMessage && <h2>Login susceefull</h2>}</div>
    </form>
  );
}
