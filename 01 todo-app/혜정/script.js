const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  //배열 처음에 새로운 아이템 추가
  todos.unshift(item);

  // 요소 생성
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

  //리스트 요소의 node 앞에 집어넣기
  list.prepend(itemEl);

  //생성 시 타이핑 활성화
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

  //체크완료 시
  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  //체크완료시 타이핑 막기
  inputEl.setAttribute("disabled", "");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  //edit, remove 버튼
  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  //enter키로 타이핑 비활성화
  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      inputEl.setAttribute("disabled", "");
      saveToLocalStorage();
    }
  });

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
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== item.id);
    //다른 id값만 새로운 todos 배열로 반환
    itemEl.remove();
    saveToLocalStorage();
  });

  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  //itemEL에 넣기
  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);

  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

//로컬 스토리지 저장
function saveToLocalStorage() {
  // 저장을 위해 스트링 타입으로 변환
  const data = JSON.stringify(todos);

  //window. 생략
  localStorage.setItem("my_todos", data);
}

//로컬 스토리지 데이터 가져오기
function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");

  //스트링을 배열로 변환
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
}

displayTodos();
