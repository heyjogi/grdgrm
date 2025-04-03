import { renderChart } from "./chart.js";

// 전역 상태
let todos = [];
let deletedTodos = [];

let todoContainer;
let addTodoBtn;

let filterText = "";
let filterStatus = "all";
let sortOrder = "latest";

// 앱 초기화
function initTodoApp() {
  todoContainer = document.getElementById("todoContainer");
  addTodoBtn = document.getElementById("addTodoBtn");

  // 이벤트 리스너 등록
  addTodoBtn.addEventListener("click", createNewTodoInput);

  // localStorage에서 데이터 로드
  loadFromLocalStorage();

  // 초기 렌더링
  renderTodos();
  setupTrashModal();
}

// localStorage에서 todos 로드
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  const storedDeleted = localStorage.getItem("deletedTodos");

  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
  if (storedDeleted) deletedTodos = JSON.parse(storedDeleted);
}

// localStorage에 todos 저장
function saveToLocalStorage() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
  } catch (error) {
    alert("localStorage에 데이터를 저장하는 중 오류가 발생했습니다.");
    console.error(
      "localStorage에 데이터를 저장하는 중 오류가 발생했습니다.",
      error
    );
  }
}

// 새로운 todo 입력창 생성
function createNewTodoInput() {
  const todoItemElement = document.createElement("div");
  todoItemElement.className = "todo-item";

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "todo-input";
  inputElement.placeholder = "할 일을 입력하세요...";

  const handleInput = () => {
    const value = inputElement.value.trim();

    if (value) {
      addTodo(value);
    }

    todoItemElement.remove();
  };

  inputElement.addEventListener("blur", () => {
    todoItemElement.remove();
  });

  // Enter 키 이벤트
  inputElement.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInput();
    }
  };

  todoItemElement.appendChild(inputElement);
  todoContainer.appendChild(todoItemElement);
  inputElement.focus();
}

// 새로운 todo 추가
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos = [...todos, newTodo];

  saveToLocalStorage();
  renderTodos();
}

// todo 삭제
function deleteTodo(id) {
  const deleted = todos.find((todo) => todo.id === id);
  if (deleted) {
    deletedTodos = [...deletedTodos, deleted];
  }
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

// todo 영구 삭제
function permanentlyDeleteTodo(id) {
  deletedTodos = deletedTodos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTrashBin();
}

// todo 복원
function restoreTodo(id) {
  const restored = deletedTodos.find((todo) => todo.id === id);
  if (restored) {
    todos = [...todos, restored];
  }
  deletedTodos = deletedTodos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
  renderTrashBin();
}

// todo 완료 상태 토글
function toggleComplete(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }

    return todo;
  });

  saveToLocalStorage();
  renderTodos();
}

// todo 수정
function editTodo(id, newText) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: newText };
    }

    return todo;
  });

  saveToLocalStorage();
  renderTodos();
}

// todo 수정 모드로 전환
function startEditMode(todoItemElement, todo) {
  const todoTextElement = todoItemElement.querySelector(".todo-text");
  const actionsElement = todoItemElement.querySelector(".actions");

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "todo-input";
  inputElement.value = todo.text;

  const recoverTodoText = () => {
    todoTextElement.style.display = "";
    actionsElement.style.display = "";
    inputElement.remove();
  };

  const handleEdit = () => {
    const value = inputElement.value.trim();

    if (value) {
      editTodo(todo.id, value);
    }

    recoverTodoText();
  };

  inputElement.addEventListener("blur", recoverTodoText);

  // Enter 키 이벤트
  inputElement.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    }
  };

  // 기존 요소를 숨기고 입력창 표시
  todoTextElement.style.display = "none";
  actionsElement.style.display = "none";

  todoItemElement.insertBefore(inputElement, todoTextElement);
  inputElement.focus();
}

// 드래그 앤 드롭 핸들러
function attachDragHandlers(todoElement, todo) {
  todoElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", todo.id);
    todoElement.classList.add("dragging");
  });

  todoElement.addEventListener("dragend", () => {
    todoElement.classList.remove("dragging");
  });

  todoElement.addEventListener("dragover", (e) => {
    e.preventDefault();

    const dragging = document.querySelector(".dragging");
    const bounding = todoElement.getBoundingClientRect();
    const offset = e.clientY - (bounding.top + bounding.height / 2);
    console.log(offset, bounding.top, bounding.height);

    todoElement.style.borderTop = offset < 0 ? "2px solid #2196f3" : "";
    todoElement.style.borderBottom = offset > 0 ? "2px solid #2196f3" : "";
  });

  todoElement.addEventListener("dragleave", () => {
    todoElement.style.borderTop = "";
    todoElement.style.borderBottom = "";
  });

  todoElement.addEventListener("drop", (e) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    const targetId = todo.id;
    if (draggedId === targetId) return;

    const draggedIndex = todos.findIndex((t) => t.id === draggedId);
    const targetIndex = todos.findIndex((t) => t.id === targetId);
    const draggedItem = todos.splice(draggedIndex, 1)[0];

    const bounding = todoElement.getBoundingClientRect();
    const offset = e.clientY - (bounding.top + bounding.height / 2);

    // 삽입 위치 결정
    if (offset > 0) {
      todos.splice(targetIndex + 1, 0, draggedItem);
    } else {
      todos.splice(targetIndex, 0, draggedItem);
    }

    saveToLocalStorage();
    renderTodos();
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  filterText = e.target.value.toLowerCase();
  renderTodos();
});

document.getElementById("statusFilter").addEventListener("change", (e) => {
  filterStatus = e.target.value;
  renderTodos();
});

document.getElementById("dateSort").addEventListener("change", (e) => {
  sortOrder = e.target.value;
  renderTodos();
});

// 모든 todo 렌더링
function renderTodos() {
  todoContainer.innerHTML = "";
  let filteredTodos = todos
    .filter((todo) => {
      const matchText = todo.text.toLowerCase().includes(filterText);
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "completed"
          ? todo.completed
          : !todo.completed;

      return matchText && matchStatus;
    })
    .sort((a, b) => {
      const timeA = parseInt(a.id); // id가 timestamp
      const timeB = parseInt(b.id);
      return sortOrder === "latest" ? timeB - timeA : timeA - timeB;
    });

  for (const todo of filteredTodos) {
    const todoElement = document.createElement("div");
    todoElement.className = "todo-item";
    todoElement.setAttribute("draggable", "true");

    if (todo.completed) {
      todoElement.classList.add("completed");
    }

    // 체크박스 생성
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.className = "checkbox";
    checkboxElement.checked = todo.completed;
    checkboxElement.addEventListener("change", () => toggleComplete(todo.id));

    // Todo 텍스트
    const todoTextElement = document.createElement("div");
    todoTextElement.className = "todo-text";
    todoTextElement.textContent = todo.text;

    // 액션 버튼들
    const actionsElement = document.createElement("div");
    actionsElement.className = "actions";

    // 수정 버튼
    const editButtonElement = document.createElement("button");
    editButtonElement.className = "edit-btn";
    editButtonElement.textContent = "수정";
    editButtonElement.addEventListener("click", () =>
      startEditMode(todoElement, todo)
    );

    // 삭제 버튼
    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.className = "delete-btn";
    deleteButtonElement.textContent = "삭제";
    deleteButtonElement.addEventListener("click", () => deleteTodo(todo.id));

    // 요소들 추가
    actionsElement.appendChild(editButtonElement);
    actionsElement.appendChild(deleteButtonElement);

    todoElement.appendChild(checkboxElement);
    todoElement.appendChild(todoTextElement);
    todoElement.appendChild(actionsElement);

    attachDragHandlers(todoElement, todo);

    todoContainer.appendChild(todoElement);
  }
  renderChart(todos);
}

// 휴지통 렌더링
function renderTrashBin() {
  const trashContainer = document.getElementById("trashContainer");
  trashContainer.innerHTML = "";

  for (const todo of deletedTodos) {
    const trashItem = document.createElement("div");
    trashItem.className = "todo-item";

    const text = document.createElement("div");
    text.className = "todo-text";
    text.textContent = todo.text;

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "복구";
    restoreBtn.className = "edit-btn";
    restoreBtn.addEventListener("click", () => restoreTodo(todo.id));

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "완전 삭제";
    removeBtn.className = "delete-btn";
    removeBtn.addEventListener("click", () => permanentlyDeleteTodo(todo.id));

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(restoreBtn);
    actions.appendChild(removeBtn);

    trashItem.appendChild(text);
    trashItem.appendChild(actions);
    trashContainer.appendChild(trashItem);
  }
}

// 휴지통 모달 설정
function setupTrashModal() {
  const modal = document.getElementById("trashModal");
  const openBtn = document.getElementById("openTrashBtn");
  const closeBtn = document.getElementById("closeTrashBtn");

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    renderTrashBin(); // 팝업 열 때 렌더링
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 모달 바깥 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// 앱 초기화
document.addEventListener("DOMContentLoaded", initTodoApp);
const themeToggleBtn = document.getElementById("themeToggleBtn");

function applyTheme(theme) {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(theme);

  themeToggleBtn.textContent =
    theme === "dark-mode" ? "☀️ 라이트모드" : "🌙 다크모드";
  localStorage.setItem("theme", theme);
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark-mode"
    : "light-mode";
  const newTheme = currentTheme === "dark-mode" ? "light-mode" : "dark-mode";
  applyTheme(newTheme);
});

// 초기 테마 적용
const savedTheme = localStorage.getItem("theme") || "light-mode";
applyTheme(savedTheme);
