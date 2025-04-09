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
  // 여기까지 축소 네비이게이션

  // 검색 기능
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

  // 검색 결과 페이지 로드 시
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const title = document.querySelector(".search-query-title");
  const resultsContainer = document.querySelector(".search-results");

  if (!query) {
    title.textContent = "검색어가 없습니다.";
    resultsContainer.innerHTML = `<p style="margin-left:240px;">검색 결과가 없습니다.</p>`;
    return;
  }

  title.textContent = `"${query}" 검색 결과`;

  const videos = [...videoData.videos, ...videoData.shorts];

  const filtered = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.tags.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p style="margin-left:240px;">검색 결과가 없습니다.</p>`;
  } else {
    filtered.forEach((video) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.innerHTML = `
        <div class="thumbnail" style="position: relative;">
        <img src="${
          video.thumbnail
        }" alt="썸네일" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
        <span class="badge" style="
          position: absolute;
          top: 8px;
          left: 8px;
          background-color: ${video.type === "shorts" ? "#ff4d4f" : "#1890ff"};
          color: white;
          padding: 2px 6px;
          font-size: 12px;
          border-radius: 4px;
          font-weight: bold;
        ">
          ${video.type === "shorts" ? "SHORTS" : "VIDEO"}
        </span>
      </div>
      <div class="details">
        <div class="avatar-container" style="background-image: url('https://via.placeholder.com/36x36.png?text=U');"></div>
        <div class="meta">
          <div class="meta-header">
            <div class="video-title">${video.title}</div>
          </div>
          <div class="channel-name">${video.channel}</div>
          <div class="video-stats">${video.views}</div>
        </div>
      </div>
          `;
      resultsContainer.appendChild(card);
    });
  }
});
