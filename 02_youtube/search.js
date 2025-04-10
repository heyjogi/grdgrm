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

  const videos = [
    ...videoData.videos.map((video) => ({ ...video, type: "video" })),
    ...videoData.shorts.map((short) => ({ ...short, type: "shorts" })),
  ];

  const filtered = videos.filter((v) => {
    const title = v.title || "";
    const channel = v.channelName || "";
    const tags = typeof v.tags === "string" ? v.tags : "";

    const searchableText = `${title} ${channel} ${tags}`.toLowerCase();
    return searchableText.includes(query.toLowerCase());
  });

  const filteredVideos = filtered.filter((v) => v.type === "video");
  const filteredShorts = filtered.filter((s) => s.type === "shorts");

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p style="margin-left:240px;">검색 결과가 없습니다.</p>`;
  }

  // 비디오 결과 필터링 및 표시
  if (filteredVideos.length > 0) {
    const videoResults = document.createElement("div");
    videoResults.className = "video-results";

    filteredVideos.forEach((video) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.innerHTML = `
        <div class="thumbnail">
        <img src="${video.thumbnail}" alt="썸네일" />
      </div>
      <div class="details">
        <div class="meta">
          <div class="meta-header">
            <div class="video-title">${video.title}</div>
            <button class="kebab-menu-btn">
              <i class="icon-ellipsis-vertical"></i>
            </button>
          </div>
          <div class="video-stats">${video.stats}</div></div>
          <div class="channel-info">
            <div class="avatar-container" style="background-image: url('${video.channelAvatar}')"></div>
            <div class="channel-name">${video.channelName}</div>
          </div>
          </div>
      </div>
          `;
      videoResults.appendChild(card);
    });

    resultsContainer.appendChild(videoResults);
  }

  // Shorts 결과 필터링 및 표시
  if (filteredShorts.length > 0) {
    const shortsResults = document.createElement("div");
    shortsResults.className = "shorts-results";
    shortsResults.innerHTML = `<div class="shorts-header">
          <h2 class="shorts-logo">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>YouTube Shorts</title>
            <path
              fill="currentColor"
              d="m18.931 9.99-1.441-.601 1.717-.913a4.48 4.48 0 0 0 1.874-6.078 4.506 4.506 0 0 0-6.09-1.874L4.792 
            5.929a4.504 4.504 0 0 0-2.402 4.193 4.521 4.521 0 0 0 2.666 3.904c.036.012 1.442.6 1.442.6l-1.706.901a4.51 
            4.51 0 0 0-2.369 3.967A4.528 4.528 0 0 0 6.93 24c.725 0 1.437-.174 2.08-.508l10.21-5.406a4.494 4.494 0 0 0 
            2.39-4.192 4.525 4.525 0 0 0-2.678-3.904ZM9.597 15.19V8.824l6.007 3.184z"
            />
          </svg>
          <span class="shorts-text">Shorts</span>
        </h2>`;

    const shortsCard = document.createElement("article");
    shortsCard.className = "shorts-list";

    filteredShorts.forEach((short) => {
      const card = document.createElement("article");
      card.className = "shorts-card";
      shortsCard.appendChild(card);

      card.innerHTML = `
        <div class="thumbnail">
        <img src="${short.thumbnail}" alt="썸네일" />
      </div>
      <div class="details">
        <div class="meta">
          <div class="meta-header">
            <div class="shorts-title">${short.title}</div>
            <button class="kebab-menu-btn">
              <i class="icon-ellipsis-vertical"></i>
            </button>
          </div>
          <div class="shorts-stats">${short.views}</div>
        </div>
      </div>
          `;
      shortsCard.appendChild(card);
    });
    shortsResults.appendChild(shortsCard);
    resultsContainer.appendChild(shortsResults);
  }
});
