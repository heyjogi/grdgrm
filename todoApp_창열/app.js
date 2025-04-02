// 전역 상태
let todos = [];
let todoContainer;
let addTodoTitle;

// 앱 초기화
function initTodoApp() {
  todoContainer = document.getElementById("todoContainer");
  addTodoTitle = document.querySelector(".add-todo-title");

  // 이벤트 리스너 등록
  addTodoTitle.addEventListener("click", (e) => {
    e.preventDefault();
    createNewTodoInput();
  });

  // localStorage에서 데이터 로드
  loadFromLocalStorage();

  // 초기 렌더링
  renderTodos();
}

// localStorage에서 todos 로드
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");

  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
}

// localStorage에 todos 저장
function saveToLocalStorage() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
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
  // 이미 존재하는 입력창이 있다면 제거
  const existingInput = document.querySelector(".new-todo-input");
  if (existingInput) {
    existingInput.remove();
    return;
  }

  const todoItemElement = document.createElement("div");
  todoItemElement.className = "todo-item new-todo-input";

  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.className = "checkbox";
  checkboxElement.disabled = true;

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
    // blur 이벤트 발생 시 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      if (document.activeElement !== inputElement) {
        todoItemElement.remove();
      }
    }, 200);
  });

  // Enter 키 이벤트
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInput();
    } else if (e.key === "Escape") {
      todoItemElement.remove();
    }
  });

  const actionsElement = document.createElement("div");
  actionsElement.className = "actions";

  const editIcon = document.createElement("span");
  editIcon.className = "material-icons";
  editIcon.style.visibility = "hidden";
  editIcon.textContent = "edit";

  const deleteIcon = document.createElement("span");
  deleteIcon.className = "material-icons";
  deleteIcon.style.visibility = "hidden";
  deleteIcon.textContent = "remove_circle";

  actionsElement.appendChild(editIcon);
  actionsElement.appendChild(deleteIcon);

  todoItemElement.appendChild(checkboxElement);
  todoItemElement.appendChild(inputElement);
  todoItemElement.appendChild(actionsElement);

  todoContainer.insertBefore(todoItemElement, todoContainer.firstChild);
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
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
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

// 모든 todo 렌더링
function renderTodos() {
  todoContainer.innerHTML = "";

  for (const todo of todos) {
    const todoElement = document.createElement("div");
    todoElement.className = "todo-item";

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
    const editIcon = document.createElement("span");
    editIcon.className = "material-icons";
    editIcon.textContent = "edit";
    editButtonElement.appendChild(editIcon);
    editButtonElement.addEventListener("click", () =>
      startEditMode(todoElement, todo)
    );

    // 삭제 버튼
    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.className = "delete-btn";
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "material-icons";
    deleteIcon.textContent = "remove_circle";
    deleteButtonElement.appendChild(deleteIcon);
    deleteButtonElement.addEventListener("click", () => deleteTodo(todo.id));

    // 요소들 추가
    actionsElement.appendChild(editButtonElement);
    actionsElement.appendChild(deleteButtonElement);

    todoElement.appendChild(checkboxElement);
    todoElement.appendChild(todoTextElement);
    todoElement.appendChild(actionsElement);

    todoContainer.appendChild(todoElement);
  }
}

// 앱 초기화
document.addEventListener("DOMContentLoaded", initTodoApp);
