import { createModal } from "./modal.js";
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
          .map((img, index) => `<img src="${img}" alt="Slide ${index + 1}">`)
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
  }

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
      renderPosts(data);
      initSliders();
      initModalButtons(data);
    })
    .catch((err) => console.error("Error loading post data.", err));
});
