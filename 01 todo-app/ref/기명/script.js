// 할 일 목록을 표시할 HTML 요소 가져오기
const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");
const sortOptions = document.getElementById("sort-options");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");

// 할 일 목록 데이터를 저장할 배열
let todos = [];

// 이벤트 리스너 추가 (버튼 클릭 또는 필터 변경 시 실행)
createBtn.addEventListener("click", createNewTodo);
sortOptions.addEventListener("change", displayTodos);
categoryFilter.addEventListener("change", displayTodos);
statusFilter.addEventListener("change", displayTodos);

// 새로운 할 일 생성하는 함수
function createNewTodo() {
  const item = {
    id: new Date().getTime(), // 현재 시간을 기반으로 고유 ID 생성
    text: "", // 할 일 내용 (초기값: 빈 문자열)
    complete: false, // 완료 여부 (초기값: 미완료)
    createdAt: new Date().toISOString(), // 생성 날짜 (ISO 형식)
    priority: 0, // 중요도 (0: 낮음, 1: 중간, 2: 높음)
    category: "personal", // 기본 카테고리 (personal: 개인)
  };

  // 새 할 일을 배열의 앞쪽에 추가
  todos.unshift(item);

  // 새 할 일 요소 생성 및 화면에 추가
  const { itemEl, inputEl } = createTodoElement(item);
  list.prepend(itemEl);

  // 새로 추가된 할 일의 입력칸을 활성화
  inputEl.removeAttribute("disabled");
  inputEl.focus();

  // 변경된 데이터를 저장
  saveToLocalStorage();
}

// 할 일 목록을 화면에 표시하는 함수
function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  // 체크박스 (완료 여부)
  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;
  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;
    item.complete
      ? itemEl.classList.add("complete")
      : itemEl.classList.remove("complete");
    saveToLocalStorage();
    displayTodos();
  });

  // 할 일 입력란 (텍스트)
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", ""); // 기본적으로 수정 불가
  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });
  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  // 날짜 입력 필드
  const dateInputEl = document.createElement("input");
  dateInputEl.type = "date";
  dateInputEl.value = item.createdAt.split("T")[0]; // 날짜 부분만 사용
  dateInputEl.addEventListener("change", () => {
    item.createdAt = dateInputEl.value + "T00:00:00.000Z"; // 시간 초기화
    saveToLocalStorage();
    displayTodos();
  });

  // 중요도 선택 (낮음, 중간, 높음)
  const priorityEl = document.createElement("select");
  ["낮음", "중간", "높음"].forEach((level, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.innerText = level;
    if (index == item.priority) option.selected = true;
    priorityEl.append(option);
  });
  priorityEl.addEventListener("change", () => {
    item.priority = parseInt(priorityEl.value);
    saveToLocalStorage();
    displayTodos();
  });

  // 카테고리 선택 (업무, 개인)
  const categoryEl = document.createElement("select");
  ["work", "personal"].forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat === "work" ? "업무" : "개인";
    if (cat === item.category) option.selected = true;
    categoryEl.append(option);
  });
  categoryEl.addEventListener("change", () => {
    item.category = categoryEl.value;
    saveToLocalStorage();
    displayTodos();
  });

  // 수정 및 삭제 버튼
  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";
  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";
  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== item.id);
    itemEl.remove();
    saveToLocalStorage();
  });

  actionsEl.append(editBtnEl, removeBtnEl);
  itemEl.append(
    checkboxEl,
    inputEl,
    dateInputEl,
    priorityEl,
    categoryEl,
    actionsEl
  );

  return { itemEl, inputEl };
}

// 데이터를 로컬 스토리지에 저장하는 함수
function saveToLocalStorage() {
  localStorage.setItem("my-todos", JSON.stringify(todos));
}

// 로컬 스토리지에서 데이터를 불러오는 함수
function loadFromLocalStorage() {
  const data = localStorage.getItem("my-todos");
  if (data) {
    todos = JSON.parse(data);
  }
}

// 할 일 목록을 화면에 표시하는 함수
function displayTodos() {
  list.innerHTML = ""; // 기존 목록 초기화
  loadFromLocalStorage();

  let filteredTodos = [...todos];

  // 상태 필터링 (진행 중, 완료)
  if (statusFilter.value === "completed") {
    filteredTodos = filteredTodos.filter((todo) => todo.complete);
  } else if (statusFilter.value === "progress") {
    filteredTodos = filteredTodos.filter((todo) => !todo.complete);
  }

  // 카테고리 필터링 (전체, 업무, 개인)
  if (categoryFilter.value !== "all") {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.category === categoryFilter.value
    );
  }

  // 정렬 (날짜순, 중요도순)
  if (sortOptions.value === "date") {
    filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOptions.value === "priority") {
    filteredTodos.sort((a, b) => b.priority - a.priority);
  }

  // 필터링 및 정렬된 할 일 목록을 화면에 추가
  filteredTodos.forEach((item) => {
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  });
}

// 페이지 로드 시 기존 할 일 목록 표시
displayTodos();
