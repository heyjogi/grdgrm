import { createModal } from "./modal-post.js";
import { initShareModal } from "./modal-share.js";


export function initButtons(postEl, postData) {
  const likeIcon = postEl.querySelector(".left-actions .fa-heart");
  const likesText = postEl.querySelector(".post-likes span");
  const saveIcon = postEl.querySelector(".right-actions .fa-bookmark");

  let likeCount = postData.likes;
  let isLiked = false;

  likeIcon?.addEventListener("click", () => {
    isLiked = !isLiked;

    likeIcon.classList.toggle("fas", isLiked);
    likeIcon.classList.toggle("far", !isLiked);
    likeIcon.style.color = isLiked ? "red" : "#333";

    likeCount += isLiked ? 1 : -1;
    likesText.textContent = `좋아요 ${likeCount.toLocaleString()}개`;
  });

  saveIcon?.addEventListener("click", () => {
    const isSaved = saveIcon.classList.toggle("fas");
    saveIcon.classList.toggle("far", !isSaved);
  });
}

// 검색창
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


document.addEventListener("DOMContentLoaded", () => {
  // 🔹 STORIES 슬라이더 버튼 & 표시 토글
  const storiesList = document.querySelector(".stories-list");
  const leftArrow = document.querySelector(".story-nav.left");
  const rightArrow = document.querySelector(".story-nav.right");

  function updateArrowVisibility() {
    const scrollLeft = storiesList.scrollLeft;
    const scrollWidth = storiesList.scrollWidth;
    const clientWidth = storiesList.clientWidth;

    leftArrow.style.display = scrollLeft > 5 ? "flex" : "none";
    rightArrow.style.display =
      scrollLeft + clientWidth < scrollWidth - 5 ? "flex" : "none";
  }

  leftArrow.addEventListener("click", () => {
    storiesList.scrollLeft -= 200;
    setTimeout(updateArrowVisibility, 200);
  });

  rightArrow.addEventListener("click", () => {
    storiesList.scrollLeft += 200;
    setTimeout(updateArrowVisibility, 200);
  });

  storiesList.addEventListener("scroll", updateArrowVisibility);
  window.addEventListener("load", updateArrowVisibility);

  // 🔹 검색 패널 열고 닫기 토글
  const searchBtn = document
    .querySelector('a[href="#"] img[src="search.png"]')
    ?.closest("a");
  const searchPanel = document.querySelector(".search-panel");
  const closeBtn = document.querySelector(".close-search");

  if (searchBtn && searchPanel && closeBtn) {
    searchBtn.addEventListener("click", () => {
      const isActive = searchPanel.classList.contains("active");
      if (isActive) {
        searchPanel.classList.remove("active");
        document.body.classList.remove("searching");
      } else {
        searchPanel.classList.add("active");
        document.body.classList.add("searching");
      }
    });

    closeBtn.addEventListener("click", () => {
      searchPanel.classList.remove("active");
      document.body.classList.remove("searching");
    });
  }

  const feedContainer = document.querySelector(".feed");
  const endTrigger = document.querySelector(".end");

  let posts = [];
  let postIndex = 0;
  const initialCount=3;
  const additionalCount = 2;

  function renderPosts(posts) {
    posts.forEach((post) => {
      const postEl = document.createElement("div");
      postEl.classList.add("post");
      postEl.setAttribute("id", `post-${post.id}`);

      postEl.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <img class="avatar" src="${post.userInfo.avatar}" alt="User Avatar">
          <div class="user-info">
            <span class="username">${post.userInfo.username}</span>
            <span class="location">${post.userInfo.location}</span>
          </div>
        </div>
        <div class="post-more"><i class="fas fa-ellipsis-h"></i></div>
      </div>
    
      <div class="post-image-slider">
        <div class="slider-track">
        ${post.slideImg
          .map((img, index) => `<img src="${img}" alt="Slide ${index + 1}" onerror = "handleImageError(this,  '${img}')">`)
          .join("")}
        </div>
        
        <button class="slider-btn left"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-btn right"><i class="fas fa-chevron-right"></i></button>
        
        </div>

      <div class="post-dots">${post.slideImg
        .map(() => `<span></span>`)
        .join("")}</div>

      <div class="post-actions">
          <div class="left-actions">
            <i class="far fa-heart"></i><i class="far fa-comment"></i><i class="far fa-paper-plane"></i>
          </div>
          <div class="right-actions"><i class="far fa-bookmark"></i></div>
        </div>
    
        <div class="post-likes"><span>좋아요 ${post.likes.toLocaleString()}개</span></div>
        <div class="post-caption"><span class="username">${
          post.userInfo.username
        }</span>${post.caption}</div>
        <div class="post-comments"><a href="#">댓글 ${post.commentsCount.toLocaleString()}개 모두 보기</a></div>
        <div class="post-time">${post.time}</div>
        <div class="post-add-comment">댓글 달기...</div>
        `;

      feedContainer.append(postEl);

      initButtons(postEl, post);
    });

    feedContainer.append(endTrigger);
  };

  // 🔹 무한 스크롤: 초기 3개 -> 2개 -> 2개 순으로 로드 (+중복 렌더링 방지)
let isLoading = false;

function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && postIndex < posts.length && !isLoading) {
        isLoading = true;

        const nextPosts = posts.slice(postIndex, postIndex + additionalCount);
        renderPosts(nextPosts);
        postIndex += additionalCount;

        setTimeout(() => {
          isLoading = false;
        }, 1500); // 로딩 효과를 위한 지연 시간 (무한 스크롤 느낌 연출용)
      };
    });
  }, { threshold: 0.1 });

  observer.observe(endTrigger);
}

  // 🔹 이미지 오류 화면 
  window.handleImageError = function(imgEl) {
    const wrapper = imgEl.parentElement?.parentElement;

    if (wrapper) {
      wrapper.innerHTML = `
      <div class="image-error">
        <button class="retry-btn">
          <i class="fas fa-redo-alt"></i>
        </button>
        <p>이미지를 로드할 수 없음. 다시 시도하려면 누르세요.</p>
      </div>
      `;

    const parent = imgEl.parentElement;
    parent.replaceChild(fallbackDiv, imgEl);

    // 🔹 retry-btn 이벤트
    const retryBtn = wrapper.querySelector(".retry-btn");
    retryBtn?.addEventListener("click", () => {
      const retryImg = document.createElement("img");
      retryImg.src = imgEl.src;
      retryImg.alt = imgEl.alt;
      retryImg.onerror = () => handleImageError(retryImg);

      //다시 슬라이더에 원래 이미지로 교체
      if (parent) {
        parent.replaceChild(retryImg, fallbackDiv);
      }
    });
  }
};

  // 🔹 피드 이미지 슬라이더 + dot indicator
  function initSliders() {
    document.querySelectorAll(".post-image-slider").forEach((slider) => {
      const track = slider.querySelector(".slider-track");
      const imgs = slider.querySelectorAll("img");
      const btnLeft = slider.querySelector(".slider-btn.left");
      const btnRight = slider.querySelector(".slider-btn.right");
      const dots = slider.parentElement.querySelectorAll(".post-dots span");
      let currentIndex = 0;


      // 이미지가 한 장일 때는 버튼과 닷 인디케이터 숨기기
      if (imgs.length <= 1) {
        btnLeft.style.display = "none";
        btnRight.style.display = "none";
        slider.parentElement.querySelector(".post-dots").style.display = "none";
        return; // 더 이상의 실행을 멈춤
      }


      const updateSlide = () => {
        const offset = -currentIndex * slider.offsetWidth;
        track.style.transform = `translateX(${offset}px)`;

        // 🔸 Dot indicator 업데이트
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
        });
      };

      btnLeft.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlide();
        }
      });

      btnRight.addEventListener("click", () => {
        if (currentIndex < imgs.length - 1) {
          currentIndex++;
          updateSlide();
        }
      });

      window.addEventListener("resize", updateSlide);

      updateSlide(); // 초기 상태
    });
  }

  // comment 버튼 기능 구현
  function initModalButtons(posts) {
    document.querySelectorAll(".post").forEach((postEl, index) => {
      const commentIcon = postEl.querySelector(".fa-comment");
      if (!commentIcon) return;

      commentIcon.addEventListener("click", () => {
        const postData = posts[index];
        createModal(postData);
      });
    });
  }

  // post 데이터 불러오기
  fetch("../assets/data/post.json")
    .then((res) => res.json())
    .then((data) => {
      posts = data;
      renderPosts(posts.slice(postIndex, postIndex + initialCount));
      postIndex += initialCount;
      initObserver();
      initSliders();
      initModalButtons(data);
      initShareModal();
    })
    .catch((err) => console.error("Error loading post data.", err));
});
