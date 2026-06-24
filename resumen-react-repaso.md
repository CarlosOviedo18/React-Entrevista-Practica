# Resumen teórico de React — Todo list y formulario con validación

Material de estudio basado en los dos ejercicios prácticos. Léelo después de releer tu código y antes de reescribir el formulario de memoria.

---

## 1. Estado: `useState`

El estado es la memoria del componente: los datos que cambian y que, al cambiar, hacen que React vuelva a dibujar la pantalla.

```javascript
const [task, setTask] = useState("");
```

- `task` es el valor actual.
- `setTask` es la única forma correcta de cambiarlo. Nunca modifiques la variable directamente.
- El argumento de `useState` es el valor inicial (`""` para texto, `[]` para una lista, `false` para un booleano).

Cada cosa que cambia en pantalla suele ser un `useState` distinto. En el todo list tenías dos (`task` para el input, `tasks` para la lista). En el formulario tenías tres (`email`, `password`, `show`).

**Regla mental:** ¿qué datos cambian en pantalla? Eso va en estado.

---

## 2. Input controlado

Un input controlado es aquel donde React es el dueño del valor, no el navegador. Se logra con dos props que van **siempre juntas**:

```javascript
<input value={task} onChange={(e) => setTask(e.target.value)} />
```

- `value={task}` → el input muestra lo que diga el estado.
- `onChange` → cada vez que el usuario teclea, actualiza el estado.

El ciclo es: tecla → `onChange` → `setTask` → re-render → `value` actualizado. Es un círculo cerrado.

Si pones solo `value` sin `onChange`, el input queda congelado. Si pones solo `onChange` sin `value`, pierdes el control de React. Van en pareja.

El parámetro `e` es el **evento**: un objeto que React te pasa con información de lo que pasó. `e.target` es el elemento que disparó el evento, y `e.target.value` es su contenido en ese momento.

---

## 3. Eventos y el principio del "único lugar" (el más importante)

Este fue el concepto que más costó, así que va con detalle.

Los formularios HTML, al enviarse, **recargan la página por defecto** (comportamiento de los años 90). En React no quieres eso: perderías el estado. Por eso la primera línea del handler es:

```javascript
e.preventDefault();
```

Esto cancela la recarga. **Ojo con los paréntesis:** `e.preventDefault()` ejecuta; `e.preventDefault` (sin paréntesis) solo nombra la función y no hace nada.

### La regla de oro

Toda la lógica del envío va en `handleSubmit`, conectado al form con `onSubmit`. El botón es solo `type="submit"`, **sin `onClick`**.

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  setShow(true);      // mostrar éxito
  setEmail("");       // limpiar campos
  setPassword("");
};

// ...
<form onSubmit={handleSubmit}>
  <button type="submit">Enviar</button>
</form>
```

**¿Por qué en el form y no en el botón?** Porque el envío puede venir de dos lados: el clic en el botón **o** la tecla Enter. Los dos pasan por `onSubmit`. Si pusieras la lógica en el `onClick` del botón, el Enter no la dispararía. Una sola función maneja todo el envío — una sola fuente de verdad.

Frase para una entrevista: *"Manejo el envío en el form y no en el botón para que funcione igual con clic y con Enter."*

---

## 4. Renderizado de listas: `.map()` y `key`

Para mostrar una lista, recorres el array con `.map()` y devuelves un elemento por cada item:

```javascript
{tasks.map((item) => (
  <li key={item.id}>{item.text}</li>
))}
```

El `key` le da a React una **identidad estable** de cada elemento para saber cuál es cuál entre re-renders.

**Por qué `key={item.id}` y no `key={index}`:** el índice es la *posición* en el array; el id es la *identidad*. Si eliminas un elemento del medio, las posiciones se reordenan y React puede confundir qué elemento es cuál, causando bugs sutiles. El id nunca cambia. Por eso conviene guardar objetos con id en vez de strings sueltos:

```javascript
setTasks([...tasks, { id: Date.now(), text: task }]);
```

Nota sobre `Date.now()` vs `crypto.randomUUID()`: `Date.now()` sirve, pero dos items creados en el mismo milisegundo tendrían el mismo id. `randomUUID()` es más seguro.

---

## 5. Inmutabilidad y `filter` para borrar

En React no se muta el estado directamente: se reemplaza por uno nuevo. Por eso para agregar usas el spread (`[...tasks, nuevo]`) y para borrar usas `filter`:

```javascript
setTasks(tasks.filter((t) => t.id !== item.id));
```

`filter` recorre el array y construye **uno nuevo** solo con los elementos que cumplen la condición. Aquí: "quédate con toda tarea cuyo id sea distinto al de la que estoy borrando". `filter` no toca el array original — crea otro. Eso es justo lo que React quiere.

**Borrar por id, no por índice:** misma lección que el `key`. El índice depende de la posición; el id depende de la identidad. La identidad es lo robusto.

---

## 6. Closures (por qué cada botón "recuerda" su item)

Cuando el botón de borrar está dentro del `.map()`, React crea un botón distinto por cada tarea, y cada uno "recuerda" su propio `item`:

```javascript
{tasks.map((item) => (
  <li key={item.id}>
    {item.text}
    <button onClick={() => borrar(item.id)}>Borrar</button>
  </li>
))}
```

Esto es un **closure**: la función del `onClick` se acuerda de las variables que existían cuando se creó. Cuando el map procesa "comprar pan", crea un botón cuyo `item` es "comprar pan"; cuando procesa "lavar ropa", otro botón con su propio `item`. Cada función quedó "amarrada" a su tarea.

Detalle clave: la función del `onClick` **no se ejecuta cuando el map dibuja el botón** — solo se *crea* ahí (y captura el item). Se ejecuta después, al hacer clic. Por eso se usa la arrow `() => ...`: guarda la acción para después. Si pusieras `onClick={borrar(item.id)}` sin la flecha, se ejecutaría de inmediato al renderizar.

Los closures caen mucho en entrevistas de JavaScript como pregunta teórica.

---

## 7. Renderizado condicional

Mostrar algo solo si se cumple una condición. Dos formas comunes:

```javascript
// Con && : muestra el elemento solo si la condición es verdadera
{show && <p>Todo correcto</p>}

// Con ternario: elige entre dos opciones
{esValido ? <p>Bien</p> : <p>Mal</p>}
```

Para mensajes de error, la lógica correcta es: si el usuario escribió algo **y** NO es válido, muestra el error:

```javascript
{email && !validateEmail(email) && <p>Email inválido</p>}
```

El `!` invierte: "no es válido". Y el `email &&` al principio evita mostrar el error apenas carga la página, cuando el campo todavía está vacío.

---

## 8. Validación y el botón `disabled`

Validar sin librerías: para "al menos 6 caracteres" basta con la longitud del string (`password.length >= 6`), no necesitas regex. Para un email simple, verificar que tenga un `@` y un punto después alcanza para cumplir el enunciado y lo entiendes al 100%.

**Lección importante:** una regex compleja copiada que funciona pero que no puedes explicar es peor que una validación simple que sí puedes explicar. En una entrevista te pueden pedir que la expliques línea por línea.

El botón se deshabilita con la prop `disabled`, que espera un booleano. La forma idiomática es **un solo botón** con la condición de invalidez:

```javascript
<button type="submit" disabled={!(validateEmail(email) && validatePassword(password))}>
  Enviar
</button>
```

Se lee: "deshabilitado cuando NO es cierto que ambos sean válidos". Esto es mejor que dos botones en un ternario.

---

## 9. El método para empezar cualquier ejercicio

Ante cualquier problema de React, este orden te destraba siempre:

1. **¿Qué datos cambian en pantalla?** → eso va en `useState`.
2. **¿Qué acciones puede hacer el usuario?** → eso son los handlers (`onClick`, `onChange`, `onSubmit`).
3. **¿Cómo se muestra el estado?** → eso es el JSX, con `.map()` si es una lista.

Estado primero, acciones después, render al final. Si arrancas siempre por "qué datos cambian", nunca te quedas en blanco frente a la pantalla.

---

## 10. Tus tres puntos débiles a vigilar

No son fallas de entender React — son de detalle y de reflejo. Vigílalos al revisar tu código:

1. **El evento en un solo lugar.** La lógica del envío va en `handleSubmit`, no en el `onClick` del botón. (Fue lo que más costó.)
2. **Los paréntesis de los métodos.** Si un método HACE algo, lleva `()`: `preventDefault()`, `trim()`, `filter()`. Sin paréntesis no se ejecuta.
3. **Completar todos los requisitos.** Lee el enunciado como checklist. Los detalles del final (botón de borrar, mensajes de error, los `id`) son los que se escapan. Truco: escribe primero lo que sueles olvidar.

---

## Checklist rápido antes de decir "terminé"

- [ ] ¿Cada método que ejecuta algo tiene sus `()`?
- [ ] ¿La lógica del envío está en `handleSubmit` y no en el `onClick`?
- [ ] ¿El `.map()` usa `key={item.id}` (no el índice)?
- [ ] ¿Los `id` de los inputs coinciden con el `htmlFor` de los labels?
- [ ] ¿Cumplí todos los puntos del enunciado, incluidos los del final?
- [ ] ¿Puedo explicar cada línea en voz alta?
