// Requisitos:
// El formulario tiene dos campos: email y contraseña.
// Validar el email: debe tener un formato válido (incluir un @ y un punto después).
// Validar la contraseña: debe tener al menos 6 caracteres.
// Mostrar un mensaje de error debajo de cada campo cuando su valor sea inválido.
// El botón de "Enviar" debe estar deshabilitado mientras el formulario no sea válido.
// Al enviar el formulario correctamente, mostrar un mensaje de éxito.

// Restricciones técnicas:
// Usar solo React y manejo de estado con useState.
// No se permite backend ni librerías externas de validación.

// Bonus (opcional): Mostrar los errores solo después de que el usuario haya tocado el campo (para no mostrar errores apenas carga la página).


import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(true);
    setEmail("");
    setPassword("");
  };

  const validateEmail = (email) => {
    return /@.*\./.test(email.toLowerCase());
  };

  const validatePassword = (password) =>  {
    return /^.{6,}$/.test(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="text"
        value={email}
        onChange={ (e)=> setEmail(e.target.value)}
      />

      <div>
        {email && !validateEmail(email) && <p>Email incorrect</p>}
      </div>

      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        {password && !validatePassword(password) && <p>password incorrect</p>}
      </div>

      <div>
        <button
          disabled={!(validateEmail(email) && validatePassword(password))} 
          type="submit">Save</button>

      </div>
      {show && <p>All CORRECT</p>}
    </form>
  );
}



// Requisitos:
// Debe haber un campo de texto donde el usuario escribe una tarea.
// El usuario puede agregar la tarea de dos formas: haciendo clic en un botón "Agregar" o presionando Enter en el campo de texto.
// Al agregar una tarea, el campo de texto debe quedar vacío.
// No se deben poder agregar tareas vacías (texto en blanco o solo espacios).
// Las tareas agregadas se muestran en una lista.
// Cada tarea tiene un botón para eliminarla individualmente.
// Restricciones técnicas:
// Usar solo React y manejo de estado con useState.
// No se permite backend, base de datos ni librerías externas.
// Cada tarea debe tener un identificador único.

import { useState } from "react";

export default function Form() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: task }]);
      setTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task">Task:</label>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button>Save</button>

      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            {item.text}{" "}
            <button
              onClick={() => setTasks(tasks.filter((t) => t.id !== item.id))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </form>
  );
}
