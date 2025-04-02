
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
let todos = [];
function addTodo() {
    const text = todoInput.value.trim();
    if (text !== '') {
        todos.push(text);
        renderTodos();
        todoInput.value = '';
    }
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo}</span>
            <button onclick="deleteTodo(${index})">삭제</button>
        `;
        todoList.appendChild(li);
    });
}

addButton.addEventListener('click', addTodo);