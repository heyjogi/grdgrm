// 비디오 데이터를 video.json에서 가져옵니다.
fetch("./video.json")
  .then((response) => response.json())
  .then((data) => {
    const videoContainer = document.getElementById("video-container");
    const shortsContainer = document.getElementById("shorts-container");
    const videoContainer2 = document.getElementById("video-container2");

    const videos = data.videos.slice(0, 8);
    videos.forEach((video) => {
      const videoCard = createVideoCard(video);
      videoContainer.appendChild(videoCard);
    });

    const shorts = data.shorts;
    shorts.forEach((short) => {
      const shortCard = createShortCard(short);
      shortsContainer.appendChild(shortCard);
    });

    const videos2 = data.videos.slice(8, 12);
    videos2.forEach((video) => {
      const videoCard2 = createVideoCard(video);
      videoContainer2.appendChild(videoCard2);
    });
  })
  .catch((error) => console.error("Error loading video data:", error));

function createVideoCard(video) {
  const article = document.createElement("article");
  article.classList.add("video-card");

  const tags = Array.isArray(video.tags) ? video.tags : [video.tags];
  article.setAttribute("data-tags", tags.join(","));

  article.innerHTML = `
    <a href="#" class="video-link">
      <div class="thumbnail">
        <img src="${video.thumbnail}" alt="Video Thumbnail" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
      </div>
      <div class="details">
        <img class="avatar-img" src="${video.avatar}" alt="Channel Icon" />
        <div class="meta">
          <div class="meta-header">
            <h3 class="video-title">${video.title}</h3>
            <button class="kebab-menu-btn">
              <i class="icon-ellipsis-vertical"></i>
            </button>
          </div>
          <p class="channel-name">${video.channel}</p>
          <p class="video-stats">${video.views}</p>
        </div>
      </div>
    </a>
  `;

  return article;
}

function createShortCard(short) {
  const article = document.createElement("article");
  article.classList.add("shorts-card");

  const tags = Array.isArray(short.tags) ? short.tags : [short.tags];
  article.setAttribute("data-tags", tags.join(","));

  article.innerHTML = `
    <a href="#" class="shorts-link">
      <img class="shorts-thumbnail" src="${short.thumbnail}" alt="${short.title}" />
      <div class="shorts-details">
        <div class="s-meta">
          <div class="s-meta-header">
            <h3 class="shorts-title">${short.title}</h3>
            <button class="kebab-menu-btn">
              <i class="icon-ellipsis-vertical"></i>
            </button>
          </div>
          <p class="video-stats">${short.views}</p>
        </div>
      </div>
    </a>
  `;

  return article;
}

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

// 검색창 확장/축소 기능
document
  .querySelector(".mobile-search-btn")
  .addEventListener("click", function () {
    const searchBar = document.querySelector(".search-bar");
    searchBar.classList.toggle("expanded");

    if (searchBar.classList.contains("expanded")) {
      searchBar.querySelector(".search-input").focus();
    }
  });

// 외부 클릭 시 검색창 닫기
document.addEventListener("click", (e) => {
  const searchBar = document.querySelector(".search-bar");
  if (
    !searchBar.contains(e.target) &&
    !e.target.closest(".mobile-search-btn")
  ) {
    searchBar.classList.remove("expanded");
  }
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
