document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-menu button"); // 여기를 수정
  const collapsedNav = document.querySelector(".collapsed-nav");
  const mainSidebar = document.querySelector(".sidebar");

  // 초기에는 축소된 네비게이션 숨기기
  collapsedNav.style.display = "none";

  menuButton.addEventListener("click", () => {
    const isCollapsed = collapsedNav.style.display === "none";

    if (isCollapsed) {
      collapsedNav.style.display = "flex";
      mainSidebar.style.display = "none";
    } else {
      collapsedNav.style.display = "none";
      mainSidebar.style.display = "block";
    }
  });
});
// 여기까지 축소 네비이게이션

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button button");

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
