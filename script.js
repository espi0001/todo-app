document.addEventListener("DOMContentLoaded", (event) => {
  const taskInput = document.getElementById("taskInput");
  const quantityInput = document.getElementById("quantityInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");

  // Hent opgaver fra localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Funktion til at oprette en ny opgave
  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value;
    const quantity = quantityInput.value || null;
    if (task) {
      const newTask = {
        id: crypto.randomUUID(),
        task,
        quantity,
        done: false,
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      taskInput.value = "";
      quantityInput.value = "";
    }
  });

  // Gem opgaver i localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Vis opgaverne
  function renderTasks() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `${task.task} ${task.quantity ? ` - Antal: ${task.quantity}` : ""}`;
      const doneButton = document.createElement("button");
      doneButton.textContent = task.done ? "Fortryd" : "Udført";
      doneButton.addEventListener("click", () => toggleTaskDone(task.id));
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Slet";
      deleteButton.addEventListener("click", () => deleteTask(task.id));
      taskItem.appendChild(doneButton);
      taskItem.appendChild(deleteButton);

      if (task.done) {
        doneList.appendChild(taskItem);
        taskItem.classList.add("completed");
      } else {
        todoList.appendChild(taskItem);
      }
    });
  }

  // Markér opgave som færdig/ikke færdig
  function toggleTaskDone(id) {
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }

  // Slet opgave
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
});
