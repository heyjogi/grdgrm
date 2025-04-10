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
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const title = document.getElementById("search-query-title");
  const resultsContainer = document.getElementById("search-results");

  title.textContent = `"${query}" 검색 결과`;

  const videos = [];

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
            <div class="thumbnail">
              <img src="${video.thumbnail}" alt="썸네일" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
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
