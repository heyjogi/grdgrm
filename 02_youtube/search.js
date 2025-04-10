document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-menu button");
  const collapsedNav = document.querySelector(".collapsed-nav");
  const mainSidebar = document.querySelector(".sidebar");
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button button");
  const mainContent = document.querySelector(".v-container"); // ← 콘텐츠 영역

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

    // ✅ 검색 결과 리스트 위치 조정
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
            <div class="channel-name">${video.channelName}</div>
          </div>
        </div>
      `;
      list.appendChild(card);
    });

    section.appendChild(list);
    resultsContainer.appendChild(section);
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
