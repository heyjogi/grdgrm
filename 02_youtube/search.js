document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-menu button");
  const collapsedNav = document.querySelector(".collapsed-nav");
  const mainSidebar = document.querySelector(".sidebar");
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button button");
  const mainContent = document.querySelector(".v-container"); // ← 콘텐츠 영역
  const chipsBar = document.querySelector(".chips-bar");

  collapsedNav.style.display = "none";

  // 여기에 전역 변수 추가
  let isSidebarCollapsed = false;

  menuButton.addEventListener("click", () => {
    const isCollapsed = collapsedNav.style.display === "none";
    collapsedNav.style.display = isCollapsed ? "flex" : "none";
    mainSidebar.style.display = isCollapsed ? "none" : "block";

    // 상태 저장
    isSidebarCollapsed = isCollapsed;

    //  콘텐츠 위치 조정
    if (mainContent) {
      mainContent.classList.toggle("collapsed", isCollapsed);
    }

    if (chipsBar) {
      chipsBar.classList.toggle("collapsed", isCollapsed);
    }

    //✅ 검색 결과 리스트 위치 조정
    document.querySelectorAll(".video-list, .shorts-list").forEach((list) => {
      list.classList.toggle("collapsed", isCollapsed);
    });
  });

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });
  searchButton.addEventListener("click", performSearch);

  // 외부 API로 검색 결과 가져오기
  const API_KEY = ""; // API KEY
  const BASE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
  const BASE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

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

  // 🔄 Shorts 판단용 ISO 8601 파서
  function parseDuration(isoDuration) {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  async function fetchSearchResults(query) {
    const url = `${BASE_SEARCH_URL}?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
      query
    )}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.items;
  }

  async function fetchVideoDetails(videoIds) {
    const url = `${BASE_VIDEOS_URL}?part=contentDetails,statistics&id=${videoIds.join(
      ","
    )}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const detailMap = {};
    data.items.forEach((item) => {
      detailMap[item.id] = {
        duration: parseDuration(item.contentDetails.duration),
        views: item.statistics.viewCount,
      };
    });
    return detailMap;
  }

  function renderSection(titleText, className, videos) {
    const section = document.createElement("div");
    section.className = className;
    // section.innerHTML = `<h2 style="margin-left:20px;">${titleText}</h2>`;
    const list = document.createElement("div");
    list.className = className + "-list";

    // 사이드바가 축소되어 있다면 collapsed 클래스 추가
    if (isSidebarCollapsed) {
      list.classList.add("collapsed");
    }

    videos.forEach((video) => {
      const card = document.createElement("article");
      card.className = className + "-card";
      card.innerHTML = `
        <div class="thumbnail">
          <img src="${video.thumbnail}" alt="썸네일" />
        </div>
        <div class="details">
          <div class="meta">
            <div class="meta-header">
              <div class="${className}-title">${video.title}</div>
              <button class="kebab-menu-btn">
                <i class="icon-ellipsis-vertical"></i>
              </button>
            </div>
            <div class="${className}-stats">조회수: ${video.views}</div>
          </div>
          <div class="channel-info">
          <div class="avatar-img"></div>
            <div class="channel-name">${video.channelName}</div>
          </div>
        </div>
      `;
      list.appendChild(card);
    });

    if (className === "shorts") {
      const logo = document.createElement("h2");
      logo.className = "shorts-logo";
      logo.innerHTML = `
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  `;
      section.appendChild(logo);

      const leftBtn = document.createElement("button");
      leftBtn.className = "shorts-scroll-left";
      leftBtn.innerHTML = "<";
      leftBtn.style.display = "none"; // 시작 시 숨김

      const rightBtn = document.createElement("button");
      rightBtn.className = "shorts-scroll-right";
      rightBtn.innerHTML = ">"; // 시작 시 보이도록
      rightBtn.style.display = "block";

      section.appendChild(leftBtn);
      section.appendChild(list);
      section.appendChild(rightBtn);
      resultsContainer.appendChild(section);

      // 스크롤 동작
      const scrollAmount = 400;
      rightBtn.addEventListener("click", () => {
        list.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });

      leftBtn.addEventListener("click", () => {
        list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      // 버튼 표시 로직
      list.addEventListener("scroll", () => {
        const maxScrollLeft = list.scrollWidth - list.clientWidth - 5;
        leftBtn.style.display = list.scrollLeft > 0 ? "block" : "none";
        rightBtn.style.display =
          list.scrollLeft < maxScrollLeft ? "block" : "none";
      });

      // 렌더 후 스크롤 상태 체크
      requestAnimationFrame(() => {
        const maxScrollLeft = list.scrollWidth - list.clientWidth - 5;
        if (maxScrollLeft > 0) {
          rightBtn.style.display = "block";
        } else {
          rightBtn.style.display = "none";
        }
      });
    } else {
      section.appendChild(list);
      resultsContainer.appendChild(section);
    }
  }

  //  최종 실행
  fetchSearchResults(query)
    .then(async (items) => {
      const videoIds = items.map((item) => item.id.videoId);
      const detailMap = await fetchVideoDetails(videoIds);

      const normalVideos = [];
      const shortsVideos = [];

      items.forEach((item) => {
        const id = item.id.videoId;
        const { title, channelTitle, thumbnails } = item.snippet;
        const detail = detailMap[id];

        const video = {
          title,
          thumbnail: thumbnails.medium.url,
          channelName: channelTitle,
          views: detail?.views || "N/A",
          duration: detail?.duration || 0,
        };

        if (video.duration <= 60) {
          shortsVideos.push(video);
        } else {
          normalVideos.push(video);
        }
      });

      if (normalVideos.length > 0) {
        renderSection("Videos", "video", normalVideos);
      }

      if (shortsVideos.length > 0) {
        renderSection("Shorts", "shorts", shortsVideos);
      }

      if (normalVideos.length === 0 && shortsVideos.length === 0) {
        resultsContainer.innerHTML = `<p style="margin-left:240px;">검색 결과가 없습니다.</p>`;
      }
    })
    .catch((err) => {
      console.error("검색 오류:", err);
      resultsContainer.innerHTML = `<p style="margin-left:240px;">검색 중 오류가 발생했습니다.</p>`;
    });
});
