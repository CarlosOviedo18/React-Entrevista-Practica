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

      <button type="submit">Save Task</button>

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
