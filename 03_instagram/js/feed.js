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
