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


// Ejercicio técnico: Fetch a una API con estados de carga y error
// Objetivo: Mostrar datos traídos de una API pública, manejando correctamente los tres estados de una petición: cargando, éxito y error.
// Requisitos:

// Al cargar el componente, hacer una petición a una API pública y mostrar los datos en pantalla (una lista).
// Mientras la petición está en curso, mostrar un mensaje o indicador de "Cargando...".
// Si la petición falla, mostrar un mensaje de error.
// Cuando los datos llegan, mostrarlos en una lista.

// Restricciones técnicas:

// Usar useState y useEffect.
// Usar fetch (viene en el navegador, no instales nada).
// API sugerida: https://jsonplaceholder.typicode.com/users (devuelve 10 usuarios con nombre, email, etc.).

import { useState, useEffect } from "react";

export default function FetchApi() {
  
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        if (response.ok) {
          const dataUser = await response.json();
          setData(dataUser);
          setLoading(false);
        } else {
          throw new Error("The answer wasn't successful");
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <div>{loading && <p>Loading...</p>}</div>

      <div>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>

      {error && <p>{error.message}</p>}
    </div>
  );
}




// Ejercicio técnico: Buscador con filtro en vivo
// Objetivo: Construir una lista de elementos que se filtra en tiempo real a medida que el usuario escribe en un campo de búsqueda.
// Requisitos:

// Debe haber un campo de texto para buscar.
// Debe haber una lista de elementos predefinida (por ejemplo, una lista de nombres, frutas, países — lo que prefieras, mínimo 8-10 elementos).
// A medida que el usuario escribe, la lista visible debe filtrarse mostrando solo los elementos que coinciden con el texto escrito.
// El filtro no debe distinguir mayúsculas de minúsculas (buscar "ana" debe encontrar "Ana").
// Si no hay resultados, mostrar un mensaje como "No se encontraron resultados".
// Si el campo de búsqueda está vacío, se debe mostrar la lista completa.

// Restricciones técnicas:

// Usar solo React y useState. No hace falta useEffect para este ejercicio (el filtrado se calcula directo en cada render).
// No usar backend ni librerías externas.

// Bonus (opcional): Resaltar (con negrita o color) la parte del texto que coincide con la búsqueda dentro de cada resultado.

import { useState, useEffect } from "react";

export default function FetchApi() {
  const [data, setData] = useState([]);
  const [itLoading, setItsLoading] = useState(true);
  const [error, setError] = useState("");
  const [writeUser, setWriteUser] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const userData = await response.json();
        setData(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setItsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const usersFiltered = data.filter((user) =>
    user.name.toLowerCase().includes(writeUser.toLowerCase())
  );

  return (
    <div>
      <label>Search:</label>

      <input
        type="text"
        value={writeUser}
        onChange={(e) => setWriteUser(e.target.value)}
        placeholder="Buscar usuario..."
      />

      {itLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      <ul>
        {usersFiltered.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}