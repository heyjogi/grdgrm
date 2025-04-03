const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");
const todoPercent = document.querySelector(".todo-percent"); // 추가 변수 선언

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  // 배열 처음에 새로운 아이템을 추가
  todos.unshift(item);

  //요소 생성하기
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

  // 리스트 요소안에 방금 생성한 아이템 요소 추가
  list.prepend(itemEl);

  inputEl.removeAttribute("disabled");

  inputEl.focus();
  saveToLocalStorage();
  updateCompletionPercent(); // ✅ 추가: 새로운 할 일이 추가될 때 완료율 갱신
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item", "todo-item"); // todo-item 클래스 추가

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", "");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";

  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add("complete", "completed"); // completed 추가
      itemEl.style.textDecoration = "line-through"; // 완료된 task 취소선
      itemEl.style.color = "#888"; // 완료된 텍스트 색 변경
      itemEl.style.backgroundColor = "#f0f0f0"; // 완료된 task 백그라운드 색 변경
      list.appendChild(itemEl); // 완료된 항목을 맨 아래로 이동
    } else {
      itemEl.classList.remove("complete", "completed"); //completed 추가
      itemEl.style.textDecoration = "none"; // 취소선 제거
      itemEl.style.color = ""; // 텍스트 색상 초기화
      itemEl.style.backgroundColor = ""; // 배경색 초기화
    }
    updateCompletionPercent(); // 완료율 업데이트
    saveToLocalStorage();
  });

  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== item.id);

    itemEl.remove();
    updateCompletionPercent(); // 추가
    saveToLocalStorage();
  });

  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);

  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

function saveToLocalStorage() {
  const data = JSON.stringify(todos);

  localStorage.setItem("my-todos", data);
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("my-todos");

  if (data) {
    todos = JSON.parse(data);
  }
}

function displayTodos() {
  loadFromLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  }
  updateCompletionPercent(); // 추가
}

// 체크박스 클릭 이벤트 리스너 추가
todoList.addEventListener("change", function (e) {
  if (e.target.type === "checkbox") {
    const todoItem = e.target.parentElement;
    const checkbox = e.target;

    if (checkbox.checked) {
      // 완료 상태로 변경
      todoItem.classList.add("completed");
      todoItem.style.textDecoration = "line-through";
      todoItem.style.color = "#888";
      todoItem.style.backgroundColor = "#f0f0f0";

      // 완료된 항목을 목록 마지막으로 이동
      todoList.appendChild(todoItem);
    } else {
      // 미완료 상태로 변경
      todoItem.classList.remove("completed");
      todoItem.style.textDecoration = "none";
      todoItem.style.color = "";
      todoItem.style.backgroundColor = "";
    }

    // 완료율 업데이트
    updateCompletionPercent();
  }
});

// 완료율 계산 및 표시 함수
function updateCompletionPercent() {
  const totalTasks = document.querySelectorAll(".todo-item").length;
  const completedTasks = document.querySelectorAll(
    ".todo-item.complete"
  ).length; // complete 클래스 기준으로 수정
  let percentage = (completedTasks / totalTasks) * 100;

  if (totalTasks === 0) {
    percentage = 0; // 할 일이 없으면 완료율 0%
  } else {
    percentage = Math.min(percentage, 100); // 100%를 넘지 않도록 제한
  }

  const percentElement = document.querySelector(".todo-percent");
  if (percentElement) {
    percentElement.textContent = `완료율: ${Math.round(percentage)}%`;
  }
}

displayTodos();
