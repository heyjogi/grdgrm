const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");
const themeIndicator = document.getElementById("current-theme-indicator");
const swatches = document.querySelectorAll("[data-theme]");
const todoPercent = document.querySelector(".todo-percent"); // 추가 변수 선언
const sortOptions = document.getElementById("sort-options");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let todos = [];
let deletedTodos = [];
let lastFilteredTodos = [];
let filteredTodos = [];

// 이벤트 리스너 추가 (버튼 클릭 또는 필터 변경 시 실행)
createBtn.addEventListener("click", createNewTodo);
sortOptions.addEventListener("change", () => {
  localStorage.setItem("sortOption", sortOptions.value); // 추가: 선택값 저장
  displayTodos();
});
categoryFilter.addEventListener("change", displayTodos);
statusFilter.addEventListener("change", displayTodos);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
    createdAt: new Date().toISOString(),
    priority: 0,
    category: "personal",
    note: "",
    originalIndex: todos.length,
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
  updateCompletionPercent(); //  추가: 새로운 할 일이 추가될 때 완료율 갱신
  displayTodos(); // 새 할 일 추가 후 정렬된 목록 다시 표시
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item", "todo-item"); // todo-item 클래스 추가
  //id 추가
  itemEl.dataset.id = item.id;

  //드래그 버튼 추가
  const dragBtnEl = document.createElement("button");
  dragBtnEl.classList.add("material-icons", "drag_indicator-btn");
  dragBtnEl.innerText = "drag_indicator";
  dragBtnEl.setAttribute("draggable", "true");

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

  // 추가 메모 섹션 추가
  const noteBtnEl = document.createElement("button");
  noteBtnEl.classList.add("material-icons", "note-btn");
  noteBtnEl.innerText = "note";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";

  // 날짜 입력 필드
  const dateInputEl = document.createElement("input");
  dateInputEl.type = "date";
  dateInputEl.value = item.createdAt
    ? item.createdAt.split("T")[0]
    : new Date().toISOString().split("T")[0]; // 날짜 부분만 사용
  dateInputEl.addEventListener("change", () => {
    item.createdAt = dateInputEl.value + "T00:00:00.000Z"; // 시간 초기화
    saveToLocalStorage();
    displayTodos();

    const existingItemEl = document.querySelector(`[data-id="${item.id}"]`);
    if (existingItemEl) {
      const newItemEl = createTodoElement(item).itemEl;
      existingItemEl.replaceWith(newItemEl);
    }
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

  // 드래그 앤 드롭
  // dragBtnEl.addEventListener("dragstart", (e) => {
  //   e.dataTransfer.setData("text/plain", item.id);
  //   itemEl.classList.add("dragging");
  //   itemEl.style.opacity = "0.7";
  // });

  // itemEl.addEventListener("dragover", (e) => {
  //   e.preventDefault();
  // });

  // itemEl.addEventListener("drop", (e) => {
  //   e.preventDefault();
  //   const draggedId = e.dataTransfer.getData("text/plain");
  //   const draggedIndex = filteredTodos.findIndex((t) => t.id == draggedId);
  //   const targetIndex = filteredTodos.findIndex((t) => t.id == item.id);

  //   if (
  //     draggedIndex !== -1 &&
  //     targetIndex !== -1 &&
  //     draggedIndex !== targetIndex
  //   ) {
  //     const [draggedItem] = filteredTodos.splice(draggedIndex, 1);
  //     filteredTodos.splice(targetIndex, 0, draggedItem);

  //     todos = filteredTodos.concat(
  //       todos.filter((t) => !filteredTodos.some((ft) => ft.id === t.id))
  //     );

  //     sortOptions.value = "custom"; // 사용자 정의 정렬로 설정

  //     saveToLocalStorage();
  //     displayTodos();
  //   }

  //   itemEl.classList.remove("dragging");
  // });

  // dragBtnEl.addEventListener("dragend", () => {
  //   itemEl.classList.remove("dragging");
  //   itemEl.style.opacity = "1";

  //   saveToLocalStorage();
  // });

  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add("complete", "completed");
      list.appendChild(itemEl); // 완료된 항목을 맨 아래로 이동
    } else {
      itemEl.classList.remove("complete", "completed");
    }
    updateCompletionPercent(); // 완료율 업데이트
    saveToLocalStorage();
    displayTodos();
  });

  inputEl.addEventListener("blur", () => {
    const value = inputEl.value.trim();
    if (value === "") {
      inputEl.value = "할 일을 입력하세요";
      item.text = inputEl.value;
    } else {
      item.text = inputEl.value;
    }
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  // enter 키로 비활성화 하기
  inputEl.addEventListener("keydown", (event) => {
    // input 요소에서 키를 눌렀을 때 이벤트 처리
    if (event.key === "Enter") {
      inputEl.setAttribute("disable", ""); // input 요소를 읽기 전용으로 설정
      inputEl.blur(); // input 요소에서 포커스 제거
      saveToLocalStorage(); // 로컬 스토리지에 저장
    }
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  // 추가 메모 버튼 이벤트 추가
  noteBtnEl.addEventListener("mouseenter", (event) => {
    showNoteTextarea(item, noteBtnEl, false);
  });

  noteBtnEl.addEventListener("mouseleave", () => {
    if (activeNote && !activeNote.classList.contains("editing")) {
      activeNote.remove();
      activeNote = null;
    }
  });

  noteBtnEl.addEventListener("click", (event) => {
    event.stopPropagation();
    showNoteTextarea(item, noteBtnEl, true);
  });

  removeBtnEl.addEventListener("click", () => {
    deletedTodos.unshift(item);
    todos = todos.filter((t) => t.id !== item.id);

    itemEl.remove();
    updateCompletionPercent(); // 추가
    saveToLocalStorage();
  });

  actionsEl.append(editBtnEl);
  actionsEl.append(noteBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(dragBtnEl);
  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(dateInputEl);
  itemEl.append(priorityEl);
  itemEl.append(categoryEl);
  itemEl.append(actionsEl);

  return { itemEl, inputEl, editBtnEl, noteBtnEl, removeBtnEl };
}

function saveToLocalStorage() {
  const data = JSON.stringify(todos);
  localStorage.setItem("my-todos", data);
  localStorage.setItem("deleted-todos", JSON.stringify(deletedTodos));
}

// 로컬 스토리지에서 데이터를 불러오는 함수
function loadFromLocalStorage() {
  const data = localStorage.getItem("my-todos");
  const deleted = localStorage.getItem("deleted-todos");

  if (data) {
    todos = JSON.parse(data);
  }
  if (deleted) {
    deletedTodos = JSON.parse(deleted);
  }

  todos.forEach((todo, index) => {
    if (!todo.createdAt) {
      todo.createdAt = new Date().toISOString();
    }
    if (!todo.hasOwnProperty("originalIndex")) {
      todo.originalIndex = index;
    }
    // if (!todo.hasOwnProperty("priority")) {
    //   todo.priority = 0; // 기본값 설정
    // }
  });
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
      const confirmed = confirm("삭제하시겠습니까?");
      if (!confirmed) return;

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

deleteAllBtn.addEventListener("click", () => {
  const confirmed = confirm("정말 모든 항목을 삭제하시겠습니까?");
  if (confirmed) {
    deletedTodos = [];
    saveToLocalStorage();
    renderTrashBin();
    alert("모든 항목이 삭제되었습니다.");
  }
});

function setupProfileUpload() {
  const profilePic = document.getElementById("profilePic");
  const uploadProfilePic = document.getElementById("uploadProfilePic");

  // Load saved profile picture from localStorage when page loads
  const savedProfilePic = localStorage.getItem("profilePic");
  if (savedProfilePic) {
    profilePic.src = savedProfilePic;
  }

  uploadProfilePic.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
        localStorage.setItem("profilePic", e.target.result); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  });
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

// 추가 메모 버튼 클릭 시 메모 편집
let activeNote = null;

function showNoteTextarea(item, btnEl, editable) {
  if (activeNote) {
    activeNote.remove();
  }

  const noteEl = document.createElement("textarea");
  noteEl.classList.add("note-textarea");
  noteEl.placeholder = "메모 추가";
  noteEl.value = item.note || "";
  noteEl.readOnly = !editable;

  document.body.appendChild(noteEl);
  const rect = btnEl.getBoundingClientRect();

  let leftPos = rect.right + 10 + window.scrollX;
  let topPos = rect.top + 30 + window.scrollY;

  if (leftPos + 220 > window.innerWidth) {
    leftPos = window.innerWidth - 220;
  }

  if (topPos + 100 > window.innerHeight) {
    topPos = window.innerHeight - 100 - 10;
  }
  noteEl.style.top = `${topPos}px`;
  noteEl.style.left = `${leftPos}px`;

  if (editable) {
    noteEl.classList.add("editing");
    noteEl.focus();
  }

  activeNote = noteEl;

  noteEl.addEventListener("blur", () => {
    item.note = noteEl.value;
    saveToLocalStorage();
    noteEl.remove();
    activeNote = null;
  });
}

// 공유 기능 추가
const shareBtn = document.createElement("button");
shareBtn.classList.add("material-icons", "share-btn");
shareBtn.innerText = "share";
document.body.appendChild(shareBtn);

shareBtn.addEventListener("click", shareTodos);

function shareTodos() {
  if (todos.length === 0) {
    alert("공유할 TODO가 없습니다!");
    return;
  }

  const todoData = JSON.stringify(todos, null, 2);
  //클립보드 복사
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(todoData)
      .then(() => alert("TODO가 클립보드에 복사되었습니다!"))
      .catch((err) =>
        console.error("클립보드에 복사하는 데 실패했습니다:", err)
      );
  } else {
    alert("클립보드 복사 기능이 지원되지 않습니다.");
  }
}

function displayTodos() {
  list.innerHTML = "";
  loadFromLocalStorage();
  filteredTodos = [...todos];
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

  // 정렬 (날짜순, 중요도순) + 사용자 정렬 추가
  if (sortOptions.value === "date") {
    filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOptions.value === "priority") {
    filteredTodos.sort((a, b) => b.priority - a.priority);
  } else if (sortOptions.value === "custom") {
  }

  //  완료된 항목을 항상 아래로 + 사용자 정렬 추가
  if (statusFilter.value === "all") {
    filteredTodos.sort((a, b) => {
      if (a.complete === b.complete) return 0;
      return a.complete ? 1 : -1;
    });
  }

  // 필터링된 할 일 목록 추가
  filteredTodos.forEach((item) => {
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  });

  console.log("현재 정렬 기준:", sortOptions.value);

  updateCompletionPercent(); // 추가
  setupTrashModal();
  setupProfileUpload();
}

window.onload = function () {
  loadFromLocalStorage();
  const savedSortOption = localStorage.getItem("sortOption");
  if (savedSortOption) {
    sortOptions.value = savedSortOption;
  }

  displayTodos();
};

// 드롭 다운 기능
const dropdown = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".drop-btn");

dropdownBtn.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

// 테마 선택
function applytheme(themeName) {
  const htmlEl = document.documentElement;

  // 중복 방지용 테마 클래스 제거
  htmlEl.classList.forEach((cls) => {
    if (cls.startsWith("light-") || cls.startsWith("dark-")) {
      htmlEl.classList.remove(cls);
    }
  });

  // 새 테마 클래스 추가
  htmlEl.classList.add(themeName);

  // 버튼에 테마 색상 적용 표시
  themeIndicator.className = `drop-btn current-theme-indicator ${getColorClass(
    themeName
  )}`;

  localStorage.setItem("theme", themeName);
}

// 테마 이름에 다른 컬러 클래스 추출
function getColorClass(themeName) {
  if (themeName.includes("light-pink")) return "light-pink";
  if (themeName.includes("light-purple")) return "light-purple";
  if (themeName.includes("light-blue")) return "light-blue";
  if (themeName.includes("light-cream")) return "light-cream";
  if (themeName.includes("dark-pink")) return "dark-pink";
  if (themeName.includes("dark-purple")) return "dark-purple";
  if (themeName.includes("dark-blue")) return "dark-blue";
  if (themeName.includes("dark-brown")) return "dark-brown";
  return "";
}

//초기 테마
const savedTheme = localStorage.getItem("theme") || "light-pink";
applytheme(savedTheme);

//클릭 이벤트
const themeButtons = document.querySelectorAll(".theme-button");
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applytheme(theme);

    dropdown.classList.remove("open");
  });
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

new Sortable(list, {
  animation: 150,
  handle: ".drag_indicator-btn",
  onStart: function (evt) {
    evt.item.style.opacity = "0.7";
  },
  onEnd: function (evt) {
    evt.item.style.opacity = "1";
    sortOptions.value = "custom"; // 사용자 정의 정렬로 설정
    localStorage.setItem("sortOption", "custom");

    // 드래그가 끝났을 때 호출되는 함수
    const newOrder = [...list.children].map((item) => {
      const id = parseInt(item.dataset.id);
      return todos.find((todo) => todo.id === id);
    });
    // 새로운 순서로 todos 배열 업데이트

    todos = newOrder;
    saveToLocalStorage();
    displayTodos(); // 새로운 순서로 다시 렌더링
  },
});

displayTodos();
