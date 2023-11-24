// Função para adicionar tarefa
function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const dueDateInput = document.getElementById("dueDate");

  // Validar entrada
  if (!title || !description || !category || !dueDateInput.value) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!/.*[a-zA-Z].*/.test(title)) {
    alert("O título deve conter pelo menos uma letra.");
    return;
  }

  if (title.length < 4) {
    alert("O título deve ter no mínimo 4 caracteres.");
    return;
  }

  if (description.length < 20) {
    alert("A descrição deve ter no mínimo 20 caracteres.");
    return;
  }

  // Verificar duplicatas
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (existingTasks.some((task) => task.title === title)) {
    alert("Já existe uma tarefa com este título.");
    return;
  }

  // Adicionar tarefa ao localStorage
  const newTask = {
    id: new Date().getTime(),
    title,
    description,
    category,
    dueDate: dueDateInput.value,
    removed: false,
  };

  existingTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(existingTasks));

  // Limpar formulário
  document.getElementById("todoForm").reset();

  // Atualizar a tabela de tarefas exibida
  displayTasks();
  displayTotals();
}

// Função para exibir tarefas
function displayTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tasksBody = document.getElementById("tasksBody");
  tasksBody.innerHTML = "";

  tasks.forEach((task) => {
    const row = tasksBody.insertRow();
    row.insertCell().innerText = task.id;
    row.insertCell().innerText = task.title;
    row.insertCell().innerText = task.description;
    row.insertCell().innerText = task.category;
    row.insertCell().innerText = task.dueDate || "Sem vencimento";

    // botão para remoção
    const removeButton = document.createElement("button");
    removeButton.innerText = task.removed ? "Restaurar" : "Remover";
    removeButton.onclick = () => showRemoveOptions(task.id, task.removed);
    removeButton.className = task.removed ? "restore" : "remove";
    row.insertCell().appendChild(removeButton);
  });
}

// Função para mostrar opções de remoção
function showRemoveOptions(id, removed) {
  const confirmMessage = removed
    ? "Deseja restaurar esta tarefa?"
    : "Deseja remover permanentemente esta tarefa?";
  const confirmRemove = confirm(confirmMessage);

  if (confirmRemove) {
    removed ? restoreTask(id) : deleteTask(id);
  }
}

// Função para excluir permanentemente uma tarefa
function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter((task) => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  displayTasks();
  displayTotals();
}

// Função para restaurar uma tarefa
function restoreTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, removed: false };
    } else {
      return task;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  displayTasks();
  displayTotals();
}

// Função para pesquisar por título
function searchByTitle() {
  const searchTitle = document
    .getElementById("searchTitle")
    .value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTitle));
  const tasksBody = document.getElementById("tasksBody");
  tasksBody.innerHTML = "";

  filteredTasks.forEach((task) => {
    const row = tasksBody.insertRow();
    row.insertCell().innerText = task.id;
    row.insertCell().innerText = task.title;
    row.insertCell().innerText = task.description;
    row.insertCell().innerText = task.category;
    row.insertCell().innerText = task.dueDate || "Sem vencimento";

    // botão para remoção
    const removeButton = document.createElement("button");
    removeButton.innerText = task.removed ? "Restaurar" : "Remover";
    removeButton.onclick = () => showRemoveOptions(task.id, task.removed);
    removeButton.className = task.removed ? "restore" : "remove";
    row.insertCell().appendChild(removeButton);
  });
}

// Função para exibir totalizadores
function displayTotals() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const totalTasks = tasks.length;
  const tasksWithoutCategory = tasks.filter((task) => !task.category).length;
  const tasksByCategory = countTasksByCategory(tasks);
  const tasksWithoutDueDate = tasks.filter((task) => !task.dueDate).length;
  const overdueTasks = tasks.filter((task) => task.dueDate && isTaskOverdue(task)).length;
  const tasksOnTime = totalTasks - overdueTasks;

  document.getElementById("totalTasks").innerText = totalTasks;
  document.getElementById("tasksWithoutCategory").innerText =
    tasksWithoutCategory;
  document.getElementById("tasksByCategory").innerText = tasksByCategory;
  document.getElementById("tasksWithoutDueDate").innerText =
    tasksWithoutDueDate;
  document.getElementById("overdueTasks").innerText = overdueTasks;
  document.getElementById("tasksOnTime").innerText = tasksOnTime;
}

// Função auxiliar para contar tarefas por categoria
function countTasksByCategory(tasks) {
  const categories = new Set(tasks.map((task) => task.category));
  categories.delete(undefined); // Remover categorias indefinidas (sem categoria)
  return categories.size;
}

// Função auxiliar para verificar se uma tarefa está atrasada
function isTaskOverdue(task) {
  const dueDate = new Date(task.dueDate);
  const currentDate = new Date();
  return dueDate < currentDate;
}

// Exibir tarefas e totalizadores ao carregar a página
displayTasks();
displayTotals();

// Atualizar totalizadores quando ocorrerem alterações nas tarefas
window.addEventListener("storage", () => {
  displayTotals();
});