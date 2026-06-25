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
  const [data, setData] = useState([]);
  const [itLoading, setItLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        if (response.ok) {
          const userData = await response.json();
          setData(userData);
          setItLoading(false);
        } else {
          throw new Error("the answer wasn't succesful");
        }
      } catch (error) {
        setError(error);
        setItLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <div>{itLoading && <p>Loding...</p>}</div>

      <div>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.id} - {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div>{error && <p>{error.message}</p>}</div>
    </div>
  );
}
