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

  // 🔹 Post 데이터 구조
  const posts = [
    {
      id: 1,
      userInfo: {
        avatar:"../assets/images/profile/프로필1.jpg",
        username: "구르미",
        location: "Seoul, Korea",
      },
      slideImg: [
        "../assets/images/posts/결혼.jpg",
        "../assets/images/posts/결혼3.jpg",
      ],
      likes: 2345,
      caption: "날씨 너무 좋다!! ☀️",
      commentsCount: 120,
      time: "1시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 2,
      userInfo: {
        avatar:"../assets/images/profile/프로필2.jpg",
        username: "starling33",
        location: "Busan, Korea",
      },
      slideImg: [
        "../assets/images/posts/부산.jpg"
      ],
      likes: 1500,
      caption: "Exploring the city vibe!",
      commentsCount: 80,
      time: "2시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 3,
      userInfo: {
        avatar:"../assets/images/profile/프로필3.jpg",
        username: "travel_buddy",
        location: "Jeju Island",
      },
      slideImg: [
        "../assets/images/posts/제주.jpg",
        "../assets/images/posts/제주1.jpg",
        "../assets/images/posts/제주2.jpg"
      ],
      likes: 3102,
      caption: "제주로 여행 오는거 어때? 🌄🌊",
      commentsCount: 64,
      time: "3시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 4,
      userInfo: {
        avatar:"../assets/images/profile/프로필4.jpg",
        username: "coffee_gurumi",
        location: "Seoul, Hongdae",
      },
      slideImg: [
        "../assets/images/posts/카페1.jpg",
        "../assets/images/posts/카페2.jpg",
        "../assets/images/posts/카페3.jpg"
      ],
      likes: 1204,
      caption: "홍대 카페 감성 최고! ☕🍰",
      commentsCount: 45,
      time: "4시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 5,
      userInfo: {
        avatar:"../assets/images/profile/프로필5.jpg",
        username: "fitlife",
        location: "Gangnam, Seoul",
      },
      slideImg: [
        "../assets/images/posts/운동2.jpg",
        "../assets/images/posts/운동3.jpg",
        "../assets/images/posts/운동1.jpg"
      ],
      likes: 2245,
      caption: " No pain, no gain 💪🔥",
      commentsCount: 3,
      time: "6시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 6,
      userInfo: {
        avatar:"../assets/images/profile/프로필6.jpg",
        username: "artsy_me",
        location: "Daegu Art Street",
      },
      slideImg: [
        "../assets/images/posts/그림1.jpg",
        "../assets/images/posts/그림2.jpg"
      ],
      likes: 876,
      caption: "캔바스 드디어 끝났다 🖌️🎨",
      commentsCount: 15,
      time: "8시간 전",
      comments: []    //[{user: "", text:""}]
    },

    {
      id: 7,
      userInfo: {
        avatar:"../assets/images/profile/프로필7.jpg",
        username: "bookworm",
        location: "COEX Library",
      },
      slideImg: [
        "../assets/images/posts/독서3.jpg",
        "../assets/images/posts/독서2.jpg"
      ],
      likes: 1104,
      caption: "Weekend reads 📚",
      commentsCount: 22,
      time: "10시간 전",
      comments: []    //[{user: "", text:""}]
    }
  ]

  // 피드 반복 렌더링
  const feedContainer = document.querySelector(".feed");
  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.setAttribute("id", `post-${post.id}`)

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
        ${post.slideImg.map((img, index) => `<img src="${img}" alt="Slide ${index + 1}">`).join("")}
        </div>
        
        <button class="slider-btn left"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-btn right"><i class="fas fa-chevron-right"></i></button>
        
        </div>

      <div class="post-dots">${post.slideImg.map(() => `<span></span>`).join("")}</div>

      <div class="post-actions">
          <div class="left-actions">
            <i class="far fa-heart"></i><i class="far fa-comment"></i><i class="far fa-paper-plane"></i>
          </div>
          <div class="right-actions"><i class="far fa-bookmark"></i></div>
        </div>
    
        <div class="post-likes"><span>좋아요 ${post.likes.toLocaleString()}개</span></div>
        <div class="post-caption"><span class="username">${post.userInfo.username}</span>${post.caption}</div>
        <div class="post-comments"><a href="#">댓글 ${post.commentsCount.toLocaleString()}개 모두 보기</a></div>
        <div class="post-time">${post.time}</div>
        <div class="post-add-comment">댓글 달기...</div>
        `;

        feedContainer.append(postEl);
  });


  // 🔹 피드 이미지 슬라이더 + dot indicator
  document.querySelectorAll(".post-image-slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const imgs = slider.querySelectorAll("img");
    const btnLeft = slider.querySelector(".slider-btn.left");
    const btnRight = slider.querySelector(".slider-btn.right");
    const dots = slider.parentElement.querySelectorAll(".post-dots span");
    let currentIndex = 0;

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

    // like 버튼 기능
    document.querySelectorAll(".post").forEach((post) => {
      const likeIcon = post.querySelector(".left-actions .fa-heart");
      const likesText = post.querySelector(".post-likes span");

      likeIcon.addEventListener("click", () => {
        const isLiked = likeIcon.classList.toggle("fas");
        likeIcon.classList.toggle("far", !isLiked);
        likeIcon.style.color = isLiked ? "red" : "#333";

        // like 카운트
        let text = likesText.textContent.replace(/[^\d]/g, ""); // 숫자만 추출
        let count = parseInt(text);
        count = isLiked ? count + 1 : count - 1;
        likesText.textContent = `좋아요 ${count.toLocaleString()}개`;
      });
    });

    window.addEventListener("resize", updateSlide);

    updateSlide(); // 초기 상태
  });
});
