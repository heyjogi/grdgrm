let todos = [];
let todoContainer, addTodoBtn, searchInput, darkModeToggle;

function initTodoApp() {
    todoContainer = document.getElementById("todoContainer");
    addTodoBtn = document.getElementById("addTodoBtn");
    searchInput = document.getElementById("searchInput");
    darkModeToggle = document.getElementById("darkModeToggle");

    addTodoBtn.addEventListener("click", createNewTodoInput);
    searchInput.addEventListener("input", searchTodos);
    darkModeToggle.addEventListener("click", toggleDarkMode);

    loadFromLocalStorage();
    renderTodos();
}

function searchTodos() {
    const searchText = searchInput.value.toLowerCase();
    const filteredTodos = todos.filter(todo => todo.text.toLowerCase().includes(searchText));
    renderTodos(filteredTodos);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function createNewTodoInput() {
    const todoItemElement = document.createElement("div");
    todoItemElement.className = "todo-item";

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "todo-input";
    inputElement.placeholder = "할 일을 입력하세요...";

    inputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTodo(inputElement.value);
            todoItemElement.remove();
        }
    });

    todoItemElement.appendChild(inputElement);
    todoContainer.appendChild(todoItemElement);
    inputElement.focus();
}

function addTodo(text) {
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

function renderTodos(filteredList = todos) {
    todoContainer.innerHTML = "";

    filteredList.forEach(todo => {
        const todoElement = document.createElement("div");
        todoElement.className = "todo-item";

        const checkboxElement = document.createElement("input");
        checkboxElement.type = "checkbox";
        checkboxElement.checked = todo.completed;
        checkboxElement.addEventListener("change", () => toggleComplete(todo.id));

        const todoTextElement = document.createElement("div");
        todoTextElement.textContent = todo.text;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.addEventListener("click", () => deleteTodo(todo.id));

        todoElement.appendChild(checkboxElement);
        todoElement.appendChild(todoTextElement);
        todoElement.appendChild(deleteButton);
        todoContainer.appendChild(todoElement);
    });
}

function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener("DOMContentLoaded", initTodoApp);
