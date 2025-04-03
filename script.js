const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];
let deletedTodos = [];

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
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

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
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }
    saveToLocalStorage();
  });

  inputEl.addEventListener("blur", () => {
    const value = inputEl.value.trim();
    if (value === "") {
      todos = todos.filter((t) => t.id !== item.id);
      itemEl.remove();
      return;
    }

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
    deletedTodos.unshift(item);
    todos = todos.filter((t) => t.id !== item.id);

    itemEl.remove();
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
  localStorage.setItem("deleted-todos", JSON.stringify(deletedTodos));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("my-todos");
  const deleted = localStorage.getItem("deleted-todos");

  if (data) {
    todos = JSON.parse(data);
  }
  if (deleted) {
    deletedTodos = JSON.parse(deleted);
  }
}

// 휴지통 렌더링
function renderTrashBin() {
  const trashContainer = document.getElementById("trashContainer");
  trashContainer.innerHTML = "";

  for (const item of deletedTodos) {
    const itemEl = document.createElement("div");
    itemEl.classList.add("item");

    const textEl = document.createElement("span");
    textEl.textContent = item.text;

    const restoreBtn = document.createElement("button");
    restoreBtn.classList.add("material-icons");
    restoreBtn.innerText = "restore";
    restoreBtn.addEventListener("click", () => {
      todos.unshift(item);
      deletedTodos = deletedTodos.filter((t) => t.id !== item.id);
      saveToLocalStorage();
      renderTrashBin();
      displayTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("material-icons", "remove-btn");
    deleteBtn.innerText = "delete_forever";
    deleteBtn.addEventListener("click", () => {
      deletedTodos = deletedTodos.filter((t) => t.id !== item.id);
      saveToLocalStorage();
      renderTrashBin();
    });

    const actions = document.createElement("div");
    actions.classList.add("actions");
    actions.appendChild(restoreBtn);
    actions.appendChild(deleteBtn);

    itemEl.appendChild(textEl);
    itemEl.appendChild(actions);
    trashContainer.appendChild(itemEl);
  }
}

// 휴지통 모달 설정
function setupTrashModal() {
  const modal = document.getElementById("trashModal");
  const openBtn = document.getElementById("trash-btn");
  const closeBtn = document.getElementById("closeTrashBtn");

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    renderTrashBin();
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

function displayTodos() {
  loadFromLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  }
  setupTrashModal();
}

displayTodos();
