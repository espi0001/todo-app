let taskIdCounter = 0; // Tæller der holder styr på opgave-id'erne
let tasks = []; // Array der holder styr på opgaverne

// Funktion til at tilføje en ny opgave
function addTask() {
  const taskDescription = document.getElementById("taskInput").value;
  const quantity = document.getElementById("quantityInput").value;

  // Tjekker om der er en opgavebeskrivelse og viser en advarsel hvis der ikke er opgavebeskrivelse
  if (taskDescription.trim() === "") {
    console.log("Missing a task");
    alert("Please enter a task");
    return;
  }

  // Opretter en ny opgave som et objekt
  const task = {
    id: taskIdCounter++, // giver opgaven et unikt id
    taskDescription: taskDescription, // Sætter opgavebeskrivelsen
    quantity: quantity || null, // Sætter antal, hvis den er udfyldt, eller null
    isCompleted: false, // Sætter opgaven som ikke færdig som default
  };

  tasks.push(task); // Tilføjer den nye opgave til opgavelisten (arrayet)
  console.log("task udfyldt", task); // Viser det i konsollen

  // Nulstiller inputfelterne, så de er klar til en ny opgave
  document.getElementById("taskInput").value = ""; // Opgavebeskrivelsen
  document.getElementById("quantityInput").value = ""; // Antallet

  saveTasks(); // Gemmer opgaverne i localStorage efter tilføjelse
  renderTasks(); // Opdaterer visningen af opgaver
}

// Funktion til at opdatere og vise listen af opgaver på skærmen
function renderTasks() {
  const todoList = document.getElementById("todoList"); // Henter todo-listen
  const doneList = document.getElementById("doneList"); // Henter done-listen
  todoList.innerHTML = ""; // Nulstiller todo-listen
  doneList.innerHTML = ""; // Nulstiller done-listen

  tasks.forEach((task) => {
    // Gennemgår hver opgave i tasks-arrayet
    const listItem = document.createElement("li"); // Opretter en ny liste element

    const doneButton = document.createElement("button"); // Opretter en knap til at markere opgaven som færdig/ufærdig
    doneButton.textContent = ""; // Teksten på knappen
    doneButton.classList.add(task.isCompleted ? "undo" : "done"); // Tilføjer en klasse baseret på om opgaven er færdig eller ej

    // Definerer hvad der sker når knappen trykkes
    doneButton.onclick = () => {
      if (task.isCompleted) {
        undoTask(task.id); // Hvis opgaven er færdig, fortryd færdiggørelsen
      } else {
        doneTask(task.id); // Ellers marker opgaven som færdig
      }
    };
    listItem.appendChild(doneButton); // Tilføjer knappen til liste elementet

    const taskText = document.createElement("span"); // Opretter en span til opgavebeskrivelsen
    taskText.innerHTML = task.taskDescription; // Viser opgavebeskrivelsen

    // Tilføjer "completed" klassen hvis opgaven er færdig
    if (task.isCompleted) {
      taskText.classList.add("completed"); // Tilføjer klassen til span
    }

    listItem.appendChild(taskText); // Tilføjer opgavebeskrivelsen til liste elementet

    // Hvis der er angivet en mængde, vises den her
    if (task.quantity) {
      const quantityText = document.createElement("span"); // Opretter en span til antallet
      quantityText.innerHTML = `${task.quantity}x `; // Viser antallet med 'x'
      listItem.appendChild(quantityText); // Tilføjer antallet til liste elementet
    }

    // Slet knap til at fjerne opgaver
    const deleteButton = document.createElement("button"); // Opretter en knap til at slette en opgave
    deleteButton.textContent = "delete"; // Teksten på knappen
    deleteButton.onclick = () => deleteTask(task.id); // Når knappen trykkes, slettes opgaven
    listItem.appendChild(deleteButton); // Tilføjer knappen til liste elementet

    // Tilføjer opgaven til enten todo- eller done-listen
    if (task.isCompleted) {
      listItem.classList.add("done"); // Tilføjer en klasse til at markere opgaven som færdig
      doneList.appendChild(listItem); // Tilføjer opgaven til done-listen
    } else {
      todoList.appendChild(listItem); // Tilføjer opgaven til todo-listen
    }
  });
}

// Funktion til at fjerne en opgave
function deleteTask(taskId) {
  const taskToDelete = tasks.find((task) => task.id === taskId); // Finder opgaven der skal slettes
  console.log("taskToDelete", taskToDelete); // Viser det i konsollen

  tasks = tasks.filter((task) => task.id !== taskId); // Fjerner opgaven fra tasks-arrayet
  saveTasks(); // Gemmer opgaverne i localStorage efter sletning
  renderTasks(); // Opdaterer visningen af opgaver
}

// Funktion til at markere en opgave som færdig
function doneTask(taskId) {
  const taskDone = tasks.find((task) => task.id === taskId); // Finder opgaven der skal markeres som færdig
  taskDone.isCompleted = true; // Marker opgaven som færdig

  console.log("taskDone", taskDone); // Viser det i konsollen

  saveTasks(); // Gemmer opgaverne i localStorage efter opdatering
  renderTasks(); // Opdaterer visningen af opgaver
}

// Funktion til at fortryde færdiggørelse af en opgave
function undoTask(taskId) {
  const taskUndo = tasks.find((task) => task.id === taskId); // Finder opgaven der skal fortrydes færdiggørelse af
  taskUndo.isCompleted = false; // Fortryder færdiggørelsen
  console.log("taskUndo", taskUndo); // Viser det i konsollen

  saveTasks(); // Gemmer opdateringen i localStorage
  renderTasks(); // Opdaterer visningen af opgaver
}

// Funktion til at gemme opgaverne i localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Konverterer tasks-arrayet til JSON og gemmer det i localStorage
}

// Funktion til at hente opgaverne fra localStorage ved sidens indlæsning
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks"); // Henter opgaverne fra localStorage
  if (storedTasks) {
    tasks = JSON.parse(storedTasks); // Konverterer opgaverne fra JSON til et JavaScript array
    taskIdCounter = tasks.length; // Opdaterer taskIdCounter, så nye opgaver får et unikt id
    renderTasks(); // Viser de hentede opgaver på siden
  }
}
// Kald loadTasks når siden indlæses
window.onload = loadTasks;
