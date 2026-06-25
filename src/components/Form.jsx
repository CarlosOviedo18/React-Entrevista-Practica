import { useState } from "react";

export default function Form() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(task.trim() !== ""){
      setTasks([...tasks , {id:Date.now(), text: task}]);
      setTask("");
    }
}

return (
  <form onSubmit={handleSubmit}>

        <label htmlFor="task">Task:</label>
        <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />

        <button type="submit">
          Save Task
        </button>

        <div>
          <ul>
            {tasks.map((item) => (
              <li key={item.id}>
                  {item.text} <button type="submit" onClick={() => setTasks(tasks.filter((t) => t.id !== item.id))}>Delete</button>
              </li>
            ))}
          </ul>
        </div>




  </form>
)


  



}