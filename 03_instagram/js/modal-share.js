//post.json의 userInfo 추출
async function fetchUserData() {
  try {
    const response = await fetch("../assets/data/post.json");
    if (!response.ok) {
      throw new Error("데이터를 불러오는 데 실패했습니다.");
    }
    const posts = await response.json();

    const users = posts.map((post) => post.userInfo);
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function createShareModal() {
  const modal = document.createElement("div");
  modal.classList.add("share-modal", "hidden");

  const content = document.createElement("div");
  content.classList.add("share-modal-content");

  const header = document.createElement("div");
  header.classList.add("share-header");
  header.innerHTML = `
      <h2 class="share-title">공유</h2>
      <button type="button" class="share-close">&times;</button>
    `;

  const searchInput = document.createElement("input");
  searchInput.classList.add("share-search");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "검색");

  const userList = document.createElement("div");
  userList.classList.add("share-user-list");

  const options = document.createElement("div");
  options.classList.add("share-options");

  content.append(header, searchInput, userList, options);
  modal.appendChild(content);
  document.body.appendChild(modal);

  return modal;
}

/**
 * 유저 정보를 모달에 추가하는 함수
 * @param {HTMLElement} modal
 * @param {Array<{avatar: string, username: string}>} users
 */
function populateShareModal(modal, users) {
  const userListEl = modal.querySelector(".share-user-list");
  users.forEach(({ avatar, username }) => {
    const userEl = document.createElement("div");
    userEl.classList.add("share-user");
    userEl.innerHTML = `
        <img src="${avatar}" alt="${username}" class="share-user-avatar">
        <span class="share-user-name">${username}</span>
      `;
    userListEl.appendChild(userEl);
  });

  // 레이블 ↔ FontAwesome 아이콘 클래스 매핑
  const iconMap = {
    "링크 복사": "fas fa-link",
    Facebook: "fab fa-facebook-f",
    Messenger: "fab fa-facebook-messenger",
    WhatsApp: "fab fa-whatsapp",
    Email: "fas fa-envelope",
    Threads: "fab fa-threads",
    X: "fab fa-x",
  };

  const labels = Object.keys(iconMap);
  const optionsEl = modal.querySelector(".share-options");
  optionsEl.innerHTML = "";

  Object.entries(iconMap).forEach(([label, iconClass]) => {
    // 1) wrapper
    const wrap = document.createElement("div");
    wrap.classList.add("share-option-wrapper");

    // 2) circle button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("share-option");
    btn.setAttribute("aria-label", label);

    const i = document.createElement("i");
    i.className = iconClass;
    btn.appendChild(i);

    // 3) text label
    const span = document.createElement("span");
    span.classList.add("share-option-label");
    span.textContent = label;

    // assemble
    wrap.append(btn, span);
    optionsEl.append(wrap);

    if (label === "링크 복사") {
      btn.addEventListener("click", () => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => alert("링크가 복사되었습니다!"));
      });
    } else {
      btn.addEventListener("click", () => {
        alert(`${label} 공유 기능은 아직 구현되지 않았습니다.`);
      });
    }
  });
}

export async function initShareModal() {
  const users = await fetchUserData();

  // 이미 모달이 있으면 재생성 방지
  if (document.querySelector(".share-modal")) return;

  const modal = createShareModal();
  populateShareModal(modal, users);

  // paper-plane 아이콘 클릭 시 모달 열기
  document.querySelectorAll(".fa-paper-plane").forEach((icon) => {
    icon.style.cursor = "pointer";
    icon.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  });

  // 닫기 버튼
  modal.querySelector(".share-close").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
