const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');

let todos = [];
let deletedTodos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: '',
    complete: false,
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

  // 드래그 앤 드롭
  dragBtnEl.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', item.id);
    itemEl.classList.add('dragging');
    itemEl.style.opacity = '0.7';
  });

  dragBtnEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingEl = document.querySelector('.dragging');
    if (!draggingEl || draggingEl === itemEl) return;

    const bounding = itemEl.getBoundingClientRect();
    const offset = e.clientY - bounding.top - bounding.height / 2;
    if (offset > 0) {
      list.insertBefore(draggingEl, itemEl.nextSibling);
    } else {
      list.insertBefore(draggingEl, itemEl);
    }
  });

  itemEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedIndex = todos.findIndex((t) => t.id == draggedId);
    const targetIndex = todos.findIndex((t) => t.id == item.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = todos.splice(draggedIndex, 1);
      todos.splice(targetIndex, 0, draggedItem);
      saveToLocalStorage();
    }

    itemEl.classList.remove('dragging');
  });

  dragBtnEl.addEventListener('dragend', () => {
    itemEl.classList.remove('dragging');
    itemEl.style.opacity = '1';

    list.innerHTML = '';
    displayTodos();
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
      todos = todos.filter((t) => t.id !== item.id);
      itemEl.remove();
      return;
    }

    inputEl.setAttribute('disabled', '');
    saveToLocalStorage();
  });

  inputEl.addEventListener('input', () => {
    item.text = inputEl.value;
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
  noteEl.value = item.note;
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
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  }
  setupTrashModal();
}

displayTodos();
