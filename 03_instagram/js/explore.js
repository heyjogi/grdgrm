import { createModal } from "./modal-post.js";
document.addEventListener("DOMContentLoaded", () => {
  const searchLink = document.querySelector(
    ".left-menu .category-menu li:nth-child(2) a"
  );
  const sidebar = document.querySelector(".left-menu");
  const searchPanel = document.getElementById("searchPanel");

  // 초기 상태에서 검색 패널 숨기기
  searchPanel.classList.add("hidden");

  //  검색 상태를 추적하는 변수 추가
  let isSearchOpen = false;

  //  검색 버튼 클릭 시 토글 기능 구현
  searchLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (!isSearchOpen) {
      // 검색창 열기
      sidebar.classList.add("shrink");
      searchPanel.classList.remove("hidden");
      searchPanel.style.display = "flex";
      isSearchOpen = true;
    } else {
      // 검색창 닫기
      sidebar.classList.remove("shrink");
      searchPanel.classList.add("hidden");
      searchPanel.style.display = "none";
      isSearchOpen = false;
    }
  });
});

const exploreGrid = document.querySelector(".explore-grid");

// SVG 아이콘 정의
const icons = {
  carousel: `<svg aria-label="슬라이드" class="x1lliihq x1n2onr6" color="rgb(255, 255, 255)" fill="rgb(255, 255, 255)" height="22" role="img" viewBox="0 0 48 48" width="22">
    <title>슬라이드</title>
    <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
  </svg>`,
  video: `<img src="../assets/images/icons/video-icon.png" alt="video" width="22" height="22">`,
};

fetch("../assets/data/explore.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("grid-item");

      if (item.size) {
        div.classList.add(item.size);
      }

      // 기본 이미지
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "explore image";

      div.addEventListener("click", () => {
        const postModal = {
          slideImg: [item.src],
          userInfo: {
            avatar: "https://picsum.photos/50",
            username: "random_user",
            location: "Seoul, Korea",
          },
          caption: "이것은 샘플 캡션입니다.",
          likes: 14300,
          time: "1시간 전",
        };
        createModal(postModal);
      });
      // 오버레이 div 생성
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      // 좋아요 통계
      const likesStat = document.createElement("span");
      likesStat.classList.add("stat");
      likesStat.innerHTML = `
        <img src="../assets/images/icons/heart1.png" alt="좋아요">
        14.3천
      `;

      // 댓글 통계
      const commentsStat = document.createElement("span");
      commentsStat.classList.add("stat");
      commentsStat.innerHTML = `
        <img src="../assets/images/icons/comment.png" alt="댓글">
        947
      `;

      // 요소들을 조립
      overlay.appendChild(likesStat);
      overlay.appendChild(commentsStat);
      div.appendChild(img);
      div.appendChild(overlay);

      // 타입 아이콘 추가
      if (item.type !== "image") {
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("post-type-icon");
        iconContainer.innerHTML = icons[item.type];
        div.appendChild(iconContainer);
      }
      exploreGrid.appendChild(div);
    });

    //  filler 정렬 보정 기능 추가
    const columns =
      getComputedStyle(exploreGrid).gridTemplateColumns.split(" ").length;
    let totalSpans = 0;

    data.forEach((item) => {
      if (item.size === "big-both") {
        totalSpans += 4;
      } else if (item.size === "big-row") {
        totalSpans += 2;
      } else {
        totalSpans += 1;
      }
    });

    const remainder = totalSpans % columns;
    if (remainder !== 0) {
      const filler = document.createElement("div");
      filler.className = "grid-item filler";
      filler.style.aspectRatio = "1 / 1";
      filler.style.visibility = "hidden";
      exploreGrid.appendChild(filler);
    }
  });

//  팀원 검색 기능 추가
const searchInput = document.querySelector("#searchInput");
const searchResult = document.querySelector(".search-result");
const recentSearches = document.querySelector(".recent-searches");
const clearBtn = document.querySelector(".clear-btn");

let teamMembers = [];

fetch("../assets/data/team.json")
  .then((res) => res.json())
  .then((data) => {
    teamMembers = data;
    searchResult.innerHTML = ""; // 검색 결과는 처음에 비워둠
  });

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  // 검색어 유무에 따라 최근 검색 항목 섹션 토글
  if (keyword === "") {
    recentSearches.style.display = "block"; // 검색어가 없으면 최근 검색 항목 표시
    searchResult.innerHTML = "";
  } else {
    recentSearches.style.display = "none"; // 검색어가 있으면 최근 검색 항목 숨김

    const filtered = teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(keyword) ||
        member.username.toLowerCase().includes(keyword)
    );

    renderSearchResults(filtered);
  }
});

function renderSearchResults(list) {
  searchResult.innerHTML = "";

  list.forEach((member) => {
    const item = document.createElement("div");
    item.classList.add("search-item");
    item.innerHTML = `
      <img src="${member.image}" alt="${member.name}" class="profile-img" />
      <div class="profile-info">
        <div class="username">${member.username}</div>
        <div class="name">${member.name}</div>
        ${
          member.desc
            ? `<div class="desc">${member.desc}</div>`
            : `<div class="desc"> </div>`
        }
      </div>
    `;
    searchResult.appendChild(item);
  });
  // X 버튼 클릭 시 검색어 지우기
  clearBtn.addEventListener("click", () => {
    searchInput.value = ""; // 입력 텍스트 초기화
    searchInput.focus(); // 검색창에 포커스 유지

    // 검색 결과 초기화 및 최근 검색 항목 표시
    searchResult.innerHTML = "";
    recentSearches.style.display = "block";
  });
}
