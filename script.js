const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');
const toggleThemeBtn = document.querySelector('.header__theme-button');

let todos = [];
let deletedTodos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: '',
    complete: false,
    createdAt: new Date().toISOString(),
    priority: 1,
    category: 'personal',
    note: '',
  };

  // 배열 처음에 새로운 아이템을 추가
  todos.unshift(item);

  //요소 생성하기
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

  // 리스트 요소안에 방금 생성한 아이템 요소 추가
  list.prepend(itemEl);

  inputEl.removeAttribute('disabled');

  inputEl.focus();
  saveToLocalStorage();
}

function createTodoElement(item) {
  const itemEl = document.createElement('div');
  itemEl.classList.add('item');
  //id 추가
  itemEl.dataset.id = item.id;

  //드래그 버튼 추가
  const dragBtnEl = document.createElement('button');
  dragBtnEl.classList.add('material-icons', 'drag_indicator-btn');
  dragBtnEl.innerText = 'drag_indicator';
  dragBtnEl.setAttribute('draggable', 'true');

  const checkboxEl = document.createElement('input');
  checkboxEl.type = 'checkbox';
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add('complete');
  }

  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.value = item.text;
  inputEl.setAttribute('disabled', '');

  const actionsEl = document.createElement('div');
  actionsEl.classList.add('actions');

  const editBtnEl = document.createElement('button');
  editBtnEl.classList.add('material-icons');
  editBtnEl.innerText = 'edit';

  // 추가 메모 섹션 추가
  const noteBtnEl = document.createElement('button');
  noteBtnEl.classList.add('material-icons', 'note-btn');
  noteBtnEl.innerText = 'note';

  const removeBtnEl = document.createElement('button');
  removeBtnEl.classList.add('material-icons', 'remove-btn');
  removeBtnEl.innerText = 'remove_circles';

  //  날짜 입력 필드 추가
  const dateInputEl = document.createElement('input');
  dateInputEl.type = 'date';
  dateInputEl.value =
    item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
  dateInputEl.addEventListener('change', () => {
    item.createdAt = dateInputEl.value + 'T00:00:00.000Z';
    saveToLocalStorage();
  });

  //  중요도 선택 필드 추가
  const priorityEl = document.createElement('select');
  ['낮음', '중간', '높음'].forEach((level, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = level;
    if (item.priority == index) option.selected = true;
    priorityEl.appendChild(option);
  });
  priorityEl.addEventListener('change', () => {
    item.priority = parseInt(priorityEl.value);
    saveToLocalStorage();
  });

  //  카테고리 선택 필드 추가
  const categoryEl = document.createElement('select');
  ['personal', 'work'].forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat === 'personal' ? '개인' : '업무';
    if (item.category === cat) option.selected = true;
    categoryEl.appendChild(option);
  });
  categoryEl.addEventListener('change', () => {
    item.category = categoryEl.value;
    saveToLocalStorage();
  });

  // 드래그 앤 드롭
  dragBtnEl.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', item.id);
    itemEl.classList.add('dragging');
    itemEl.style.opacity = '0.7';
  });

  dragBtnEl.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  itemEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedIndex = todos.findIndex((t) => t.id == draggedId);
    const targetIndex = todos.findIndex((t) => t.id == item.id);

    if (
      draggedIndex !== -1 &&
      targetIndex !== -1 &&
      draggedIndex !== targetIndex
    ) {
      const [draggedItem] = todos.splice(draggedIndex, 1);
      todos.splice(targetIndex, 0, draggedItem);

      saveToLocalStorage();
      displayTodos();
    }

    itemEl.classList.remove('dragging');
  });

  dragBtnEl.addEventListener('dragend', () => {
    itemEl.classList.remove('dragging');
    itemEl.style.opacity = '1';

    saveToLocalStorage();
  });

  checkboxEl.addEventListener('change', () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add('complete');
    } else {
      itemEl.classList.remove('complete');
    }
    saveToLocalStorage();
  });

  inputEl.addEventListener('blur', () => {
    const value = inputEl.value.trim();
    if (value === '') {
      inputEl.value = '할 일을 입력하세요';
      item.text = inputEl.value;
    } else {
      item.text = inputEl.value;
    }
    inputEl.setAttribute('disabled', '');
    saveToLocalStorage();
  });

  inputEl.addEventListener('input', () => {
    item.text = inputEl.value;
  });

  // enter 키로 비활성화 하기
  inputEl.addEventListener('keydown', (event) => {
    // input 요소에서 키를 눌렀을 때 이벤트 처리
    if (event.key === 'Enter') {
      // 누른 키가 Enter인 경우
      inputEl.setAttribute('readonly', 'readonly'); // input 요소를 읽기 전용으로 설정
      inputEl.blur(); // input 요소에서 포커스 제거
    }
  });

  editBtnEl.addEventListener('click', () => {
    inputEl.removeAttribute('disabled');
    inputEl.focus();
  });

  // 추가 메모 버튼 이벤트 추가
  noteBtnEl.addEventListener('mouseenter', (event) => {
    showNoteTextarea(item, noteBtnEl, false);
  });

  noteBtnEl.addEventListener('mouseleave', () => {
    if (activeNote && !activeNote.classList.contains('editing')) {
      activeNote.remove();
      activeNote = null;
    }
  });

  noteBtnEl.addEventListener('click', (event) => {
    event.stopPropagation();
    showNoteTextarea(item, noteBtnEl, true);
  });

  removeBtnEl.addEventListener('click', () => {
    deletedTodos.unshift(item);
    todos = todos.filter((t) => t.id !== item.id);

    itemEl.remove();
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
  localStorage.setItem('my-todos', data);
  localStorage.setItem('deleted-todos', JSON.stringify(deletedTodos));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('my-todos');
  const deleted = localStorage.getItem('deleted-todos');

  if (data) {
    todos = JSON.parse(data);
  }
  if (deleted) {
    deletedTodos = JSON.parse(deleted);
  }
}

// 휴지통 렌더링
function renderTrashBin() {
  const trashContainer = document.getElementById('trashContainer');
  trashContainer.innerHTML = '';

  for (const item of deletedTodos) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');

    const textEl = document.createElement('span');
    textEl.textContent = item.text;

    const restoreBtn = document.createElement('button');
    restoreBtn.classList.add('material-icons');
    restoreBtn.innerText = 'restore';
    restoreBtn.addEventListener('click', () => {
      todos.unshift(item);
      deletedTodos = deletedTodos.filter((t) => t.id !== item.id);
      saveToLocalStorage();
      renderTrashBin();
      displayTodos();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('material-icons', 'remove-btn');
    deleteBtn.innerText = 'delete_forever';
    deleteBtn.addEventListener('click', () => {
      deletedTodos = deletedTodos.filter((t) => t.id !== item.id);
      saveToLocalStorage();
      renderTrashBin();
    });

    const actions = document.createElement('div');
    actions.classList.add('actions');
    actions.appendChild(restoreBtn);
    actions.appendChild(deleteBtn);

    itemEl.appendChild(textEl);
    itemEl.appendChild(actions);
    trashContainer.appendChild(itemEl);
  }
}

// 휴지통 모달 설정
function setupTrashModal() {
  const modal = document.getElementById('trashModal');
  const openBtn = document.getElementById('trash-btn');
  const closeBtn = document.getElementById('closeTrashBtn');

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    renderTrashBin();
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// 추가 메모 버튼 클릭 시 메모 편집
let activeNote = null;

function showNoteTextarea(item, btnEl, editable) {
  if (activeNote) {
    activeNote.remove();
  }

  const noteEl = document.createElement('textarea');
  noteEl.classList.add('note-textarea');
  noteEl.placeholder = '메모 추가';
  noteEl.value = item.note || '';
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
    noteEl.classList.add('editing');
    noteEl.focus();
  }

  activeNote = noteEl;

  noteEl.addEventListener('blur', () => {
    item.note = noteEl.value;
    saveToLocalStorage();
    noteEl.remove();
    activeNote = null;
  });
}

// 공유 기능 추가
const shareBtn = document.createElement('button');
shareBtn.classList.add('material-icons', 'share-btn');
shareBtn.innerText = 'share';
document.body.appendChild(shareBtn);

shareBtn.addEventListener('click', shareTodos);

function shareTodos() {
  if (todos.length === 0) {
    alert('공유할 TODO가 없습니다!');
    return;
  }

  const todoData = JSON.stringify(todos, null, 2);

  if (navigator.canShare && navigator.canShare({ text: todoData })) {
    navigator
      .share({
        title: '내 TODO 리스트',
        text: todoData,
      })
      .then(() => alert('TODO 리스트가 공유되었습니다!'))
      .catch((err) => console.error('공유 실패:', err));
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(todoData)
      .then(() => alert('TODO 리스트가 클립보드에 복사되었습니다!'))
      .catch((err) => console.error('클립보드 복사 실패:', err));
  } else {
    alert('공유 기능이 지원되지 않는 환경입니다.');
  }
}

function displayTodos() {
  loadFromLocalStorage();
  list.innerHTML = '';
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  }
  setupTrashModal();
}

window.onload = function () {
  setInitialTheme(localStorage.getItem('theme'));
};
function setInitialTheme(themeKey) {
  if (themeKey === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}

toggleThemeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');

  if (document.documentElement.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  updateThemeIcon();
});

displayTodos();
