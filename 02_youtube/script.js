document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-menu button"); // 여기를 수정
  const collapsedNav = document.querySelector(".collapsed-nav");
  const mainSidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".v-container"); // ← 콘텐츠 영역
  const chipsBar = document.querySelector(".chips-bar");

  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button button");
  // 초기에는 축소된 네비게이션 숨기기
  // 모바일 환경 체크 함수
  function isMobile() {
    return window.innerWidth <= 768; // 모바일 기준 너비
  }

  // 네비게이션 상태 설정 함수
  function setNavigationState() {
    if (isMobile()) {
      // 모바일일 때
      collapsedNav.style.display = "flex";
      mainSidebar.style.display = "none";
      mainContent.classList.add("collapsed");
      chipsBar.classList.add("collapsed");
    } else {
      // 데스크톱일 때
      collapsedNav.style.display = "none";
      mainSidebar.style.display = "block";
      mainContent.classList.remove("collapsed");
      chipsBar.classList.remove("collapsed");
    }
  }

  // 초기 실행
  setNavigationState();

  // 화면 크기 변경 시 실행
  window.addEventListener("resize", setNavigationState);
  menuButton.addEventListener("click", () => {
    const isCollapsed = collapsedNav.style.display === "none";

    if (isCollapsed) {
      collapsedNav.style.display = "flex";
      mainSidebar.style.display = "none";
      mainContent.classList.add("collapsed");
      chipsBar.classList.add("collapsed");
    } else {
      collapsedNav.style.display = "none";
      mainSidebar.style.display = "block";
      mainContent.classList.remove("collapsed");
      chipsBar.classList.remove("collapsed");
    }
  });

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }

  // 엔터 키 입력 시 검색
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // 검색 버튼 클릭 시 검색
  searchButton.addEventListener("click", () => {
    performSearch();
  });
});

// 여기까지 축소 네비이게이션

// 쇼츠
function updateVisibleShortsCards() {
  const container = document.querySelector(".shorts-container");
  const cards = container.querySelectorAll(".shorts-card");

  const containerWidth = container.offsetWidth;
  const gap = 16;
  const cardMinWidth = 200;

  const visibleCount = Math.max(
    1,
    Math.floor((containerWidth + gap) / (cardMinWidth + gap))
  );
  const cardWidth = (containerWidth - gap * (visibleCount - 1)) / visibleCount;

  cards.forEach((card, index) => {
    if (index < visibleCount) {
      card.style.display = "block";
      card.style.width = `${cardWidth}px`;
    } else {
      card.style.display = "none";
    }
  });
}

window.addEventListener("resize", updateVisibleShortsCards);
window.addEventListener("DOMContentLoaded", updateVisibleShortsCards);
