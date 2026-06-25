# Resumen teórico de React — Fetch a una API con estados de carga y error

Material de estudio del tercer ejercicio. Léelo después de releer tu código y antes de reescribir el fetch de memoria. Es el patrón más difícil de los tres porque introduce código asíncrono y `useEffect`.

---

## 1. El concepto nuevo: traer datos de afuera

Hasta ahora todos tus datos vivían dentro de React (los escribía el usuario). Acá por primera vez los datos vienen de **internet**, y eso cambia dos cosas:

- **Es asíncrono:** pedir datos a un servidor toma tiempo. El código no se queda congelado esperando; sigue, y los datos llegan "después". Por eso necesitás manejar el tiempo de espera.
- **Puede fallar:** no hay internet, el servidor está caído, la URL está mal. Tenés que contemplar el fracaso, no solo el éxito.

De ahí salen los **tres estados** que definen este patrón: cargando, error, y datos.

---

## 2. `useEffect`: hablar con el mundo exterior

`useEffect` es el hook para ejecutar código que tiene efectos *fuera* de React: una petición a una API, un temporizador, una suscripción. Corre **después** de que el componente se dibuja.

```javascript
useEffect(() => {
  // código del efecto
}, []);
```

La clave es el **array de dependencias** (el segundo argumento):

- `[]` (vacío) → el efecto corre **una sola vez**, al montar el componente. Es lo que querés para un fetch inicial.
- `[algo]` → corre cada vez que `algo` cambia.
- Sin array → corre en **cada render** (peligroso: si adentro actualizás estado, entrás en un bucle infinito).

**Error típico:** poner `}, [fetchUsers()])`. Eso *llama* a la función dentro de las dependencias (mal) y provoca fetch en bucle. La llamada a la función va **dentro** del cuerpo del effect; en el array va solo `[]`.

---

## 3. `async/await` y `fetch`

`fetch` hace la petición y devuelve una **promesa** (un valor que llegará en el futuro). `await` espera a que la promesa se resuelva antes de seguir.

```javascript
useEffect(() => {
  async function fetchUsers() {
    const response = await fetch("https://...");
    const dataUser = await response.json();
    setData(dataUser);
  }
  fetchUsers();
}, []);
```

Dos detalles importantes:

- **Hay dos `await`:** uno para obtener la respuesta (`fetch`), otro para convertir esa respuesta a JSON (`response.json()`). Los dos pasos son asíncronos.
- **La función async va declarada *dentro* del effect y luego se llama.** No podés poner `async` directamente en la función del `useEffect`; por eso se declara una función interna (`fetchUsers`) y se la invoca abajo.

Alternativa: `.then()` encadenado en vez de `async/await`. Las dos sirven; usá la que entiendas y puedas explicar.

---

## 4. La trampa de `response.ok` (lo más valioso de este ejercicio)

Este concepto lo entienden pocos juniors y en una entrevista te hace destacar.

`fetch` solo cae al `catch` cuando hay un **fallo de red** (sin internet, dominio inexistente). Pero si el servidor responde con un error como **404** o **500**, para `fetch` eso **no es una excepción** — la petición "funcionó", el servidor contestó, solo que contestó con un código de error. El `catch` no se entera.

Por eso necesitás revisar `response.ok` (que es `true` solo si el código es 2xx) y, si es `false`, **lanzar el error vos mismo** para que el `catch` lo agarre:

```javascript
if (response.ok) {
  const dataUser = await response.json();
  setData(dataUser);
} else {
  throw new Error("La respuesta no fue exitosa");
}
```

Así unificás los dos tipos de fallo (red y respuesta-de-error) en un solo `catch`. Darle un mensaje al `throw` te permite mostrarlo después.

---

## 5. Los tres estados y dónde se actualizan

```javascript
const [data, setData] = useState([]);       // los datos (array vacío al inicio)
const [loading, setLoading] = useState(true); // arranca cargando
const [error, setError] = useState(false);    // sin error al inicio
```

El flujo de actualización:

- **Éxito:** `setData(dataUser)` con los datos que llegaron.
- **Error:** `setError(error)` en el `catch`, guardando el objeto error.
- **Loading:** arranca en `true` y tiene que pasar a `false` cuando la petición termina — **haya salido bien o mal**.

### El detalle clave de `setLoading(false)`

Si ponés `setLoading(false)` solo dentro del `if (response.ok)`, entonces cuando la petición falla, `loading` se queda en `true` para siempre → "Cargando..." eterno. La solución: que `setLoading(false)` corra **siempre**, en éxito y en error.

Dos formas:
- Ponerlo tanto en el camino de éxito como en el `catch`.
- O usar un bloque **`finally`**, que corre siempre pase lo que pase:

```javascript
try {
  // ...
} catch (error) {
  setError(error);
} finally {
  setLoading(false);  // corre sí o sí
}
```

El `finally` es la forma más limpia: una sola línea que cubre los dos casos.

---

## 6. Acceder a datos de objetos

Cada usuario de la API es un **objeto** con propiedades. Para leer una usás el punto:

```javascript
item.name        // "Leanne Graham"
item.email       // "Sincere@april.biz"
```

**Datos anidados:** algunas propiedades son objetos dentro del objeto. Encadenás puntos para bajar de nivel:

```javascript
item.address.city      // ciudad (address es un objeto)
item.company.name      // nombre de la empresa
```

**Optional chaining (`?.`):** si un dato anidado podría no existir, `item.address.city` explota con "Cannot read property 'city' of undefined". El operador `?.` lo protege: "si existe, seguí; si no, devolvé undefined sin romper".

```javascript
item.address?.city     // seguro: no explota si address no existe
```

Cuidado de no confundir: `data` es tu estado (la lista completa); `item` es un elemento de esa lista; `item.name` es una propiedad de ese elemento. `data` no es una propiedad de cada item.

---

## 7. Renderizar los tres estados

Lo idiomático es mostrar **una cosa a la vez**: o cargando, o error, o la lista.

```javascript
return (
  <div>
    {loading && <p>Cargando...</p>}
    {error && <p>{error.message}</p>}
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  </div>
);
```

Mostrar `{error.message}` (el mensaje real) en vez de un texto fijo es más útil: ves *por qué* falló. Como unificaste todo en el `catch`, `error.message` cubre tanto tu mensaje del `throw` como los errores nativos de red ("Failed to fetch").

Para una versión más estricta, podés hacer los tres casos mutuamente excluyentes con returns tempranos o ternarios anidados, pero los tres `&&` bien ordenados ya funcionan bien.

---

## 8. Puntos a vigilar (de esta práctica)

- **No mezcles patrones.** Se te colaban piezas del todo list (`{id, text}`, `[...data]`, `item.text`, el `<form>`). Acá los datos llegan todos juntos del fetch: `setData(dataUser)` reemplaza el array entero, sin spread ni ids propios.
- **`<form>` vs `<div>`.** Este ejercicio solo muestra datos, no envía nada. El contenedor es un `<div>`, no un `<form>`. (Fue tu punto ciego de esta ronda.)
- **El `return` en el `.map()`.** Con llaves `{}` en la arrow necesitás `return`; con paréntesis `()` el return es implícito.
- **`response.ok` no atrapa los 404.** Hay que lanzar el error con `throw` para que el `catch` lo maneje.

---

## Checklist antes de decir "terminé"

- [ ] ¿El `useEffect` tiene `[]` para correr una sola vez?
- [ ] ¿Llamo a la función async *dentro* del effect (no en las dependencias)?
- [ ] ¿Manejo el caso `!response.ok` con un `throw`?
- [ ] ¿`setLoading(false)` corre en éxito Y en error (idealmente en `finally`)?
- [ ] ¿Muestro los tres estados: cargando, error, lista?
- [ ] ¿El contenedor es `<div>` y no `<form>`?
- [ ] ¿Puedo reescribir todo esto de memoria, sin mirar la referencia?