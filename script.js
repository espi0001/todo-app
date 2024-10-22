// Når dokumentet er indlæst (DOM er klar), bliver koden udført
document.addEventListener("DOMContentLoaded", (event) => {
  // Definerer de elementer vi vil arbejde med
  const taskInput = document.getElementById("taskInput"); // Inputfeltet til opgavebeskrivelsen
  const quantityInput = document.getElementById("quantityInput"); // Inputfeltet til antal (hvis relevant)
  const addTaskBtn = document.getElementById("addTaskBtn"); // Knappen til at tilføje en opgave
  const todoList = document.getElementById("todoList"); // Ul-elementet til ikke-udførte opgaver
  const doneList = document.getElementById("doneList"); // Ul-elementet til udførte opgaver

  // Hent eksisterende opgaver fra localStorage, eller start med en tom liste hvis der ikke er nogen
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(); // Kalder renderTasks for at vise de opgaver der allerede er gemt

  // Event listener for tilføj-knappen
  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value; // Henter værdien fra opgave-inputfeltet
    const quantity = quantityInput.value || null; // Henter antal (hvis der er indtastet noget)
    if (task) {
      // Hvis opgave-inputfeltet ikke er tomt
      const newTask = {
        id: crypto.randomUUID(), // Opretter et unikt ID til hver opgave ved hjælp af crypto API'et
        task, // Opgavebeskrivelse
        quantity, // Antal (valgfrit)
        done: false, // Starter som falsk, fordi opgaven ikke er færdig
      };
      tasks.push(newTask); // Tilføjer den nye opgave til tasks-arrayet
      saveTasks(); // Gemmer den opdaterede tasks-liste i localStorage
      renderTasks(); // Opdaterer UI'et med den nye opgave
      taskInput.value = ""; // Rydder opgave-inputfeltet efter tilføjelse
      quantityInput.value = ""; // Rydder antal-inputfeltet efter tilføjelse
    }
  });

  // Funktion til at gemme opgaverne i localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Konverterer tasks-arrayet til JSON og gemmer det i localStorage
  }

  // Funktion til at vise opgaverne i listerne
  function renderTasks() {
    todoList.innerHTML = ""; // Rydder den nuværende todo-liste i UI'et
    doneList.innerHTML = ""; // Rydder den nuværende done-liste i UI'et
    tasks.forEach((task) => {
      const taskItem = document.createElement("li"); // Opretter et nyt listeelement for hver opgave
      taskItem.innerHTML = `${task.task} ${task.quantity ? ` - Antal: ${task.quantity}` : ""}`; // Viser opgavebeskrivelse og evt. antal
      const doneButton = document.createElement("button"); // Opretter en knap til at markere opgaven som færdig/ufærdig
      doneButton.textContent = task.done ? "Fortryd" : "Udført"; // Ændrer teksten på knappen afhængigt af opgavens status
      doneButton.addEventListener("click", () => toggleTaskDone(task.id)); // Tilføjer klikfunktion til at markere opgaven som færdig/ufærdig
      const deleteButton = document.createElement("button"); // Opretter en knap til at slette opgaven
      deleteButton.textContent = "Slet"; // Tekst på slet-knappen
      deleteButton.addEventListener("click", () => deleteTask(task.id)); // Tilføjer klikfunktion til at slette opgaven
      taskItem.appendChild(doneButton); // Tilføjer knappen til opgaveelementet
      taskItem.appendChild(deleteButton); // Tilføjer slet-knappen til opgaveelementet

      if (task.done) {
        // Hvis opgaven er markeret som færdig
        doneList.appendChild(taskItem); // Tilføjer den til færdig-listen
        taskItem.classList.add("completed"); // Tilføjer en CSS-klasse der streger teksten over
      } else {
        // Hvis opgaven ikke er færdig
        todoList.appendChild(taskItem); // Tilføjer den til todo-listen
      }
    });
  }

  // Funktion til at markere en opgave som færdig eller fortryde
  function toggleTaskDone(id) {
    tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)); // Finder opgaven med det matchende ID og ændrer dens done-status
    saveTasks(); // Gemmer opdateringen i localStorage
    renderTasks(); // Opdaterer UI'et
  }

  // Funktion til at slette en opgave
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id); // Fjerner opgaven fra tasks-arrayet ved at filtrere den ud
    saveTasks(); // Gemmer opdateringen i localStorage
    renderTasks(); // Opdaterer UI'et
  }
});
