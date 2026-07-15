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