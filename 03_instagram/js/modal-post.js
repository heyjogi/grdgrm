import { initButtons } from "./feed.js";
import { initShareModal } from "./modal-share.js";

export function createModal(postModal) {
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.innerHTML = `
        <div class="post-modal-btn">
            <button class="modal-close">X</button>
        </div>`;

  const modal = document.createElement("div");
  modal.classList.add("post-modal");

  modal.innerHTML = `
            <div class="modal-left">
                <div class="modal-image-slider">
                    <div class="slider-track">
                        ${postModal.slideImg
                          .map(
                            (img, index) =>
                              `<img src="${img}" alt="Slide ${index + 1}">`
                          )
                          .join("")}
                    </div>    
                    <button class="slider-btn left"><i class="fas fa-chevron-left"></i></button>
                    <button class="slider-btn right"><i class="fas fa-chevron-right"></i></button>    
                    <div class="modal-dots">${postModal.slideImg
                      .map(() => `<span></span>`)
                      .join("")}</div>
            </div>
            </div>
        <div class="modal-right">
            <div class="modal-header">
                <img class="avatar" src="${
                  postModal.userInfo.avatar
                }" alt="User Avatar">
                <div class="user-info">
                    <span class="username">${postModal.userInfo.username}</span>
                    <span class="location">${postModal.userInfo.location}</span>
                </div>
                <div class="post-more"><i class="fas fa-ellipsis-h"></i></div>
            </div>
            <div class="modal-body">
                <div class="modal-caption"><strong>${
                  postModal.userInfo.username
                }</strong>${postModal.caption}</div>
                <div class="post-likes"><span>좋아요 ${postModal.likes.toLocaleString()}개</span></div>
                <div class="modal-time">${postModal.time}</div>
            </div>
            <div class="modal-actions">
                <div class="left-actions">
                    <i class="far fa-heart"></i><i class="far fa-comment"></i><i class="far fa-paper-plane"></i>
                </div>
                <div class="right-actions"><i class="far fa-bookmark"></i></div>
            </div>
            <div class="modal-add-comment">
              <input type="text" class="comment-input" placeholder="댓글 달기..." />
              <button class="post-btn">게시</button></div>
        </div>
        `;

  modalBackground.appendChild(modal);
  document.body.appendChild(modalBackground);

  modalBackground
    .querySelector(".modal-close")
    .addEventListener("click", () => {
      modalBackground.remove();
    });

  modalBackground.addEventListener("click", (e) => {
    if (e.target === modalBackground) modalBackground.remove();
  });

  const commentIcon = modal.querySelector(".fa-comment");
  const commentBox = modal.querySelector(".modal-add-comment");
  const commentInput = modal.querySelector(".comment-input");
  const postBtn = modal.querySelector(".post-btn");

  if (commentIcon && commentInput) {
    commentIcon.addEventListener("click", () => {
      commentInput.focus();
    });
  }

  if (commentBox && commentInput) {
    commentBox.addEventListener("click", () => {
      commentInput.focus();
    });
  }

  if (commentInput && postBtn) {
    commentInput.addEventListener("input", () => {
      if (commentInput.value.trim()) {
        postBtn.classList.add("active");
      } else {
        postBtn.classList.remove("active");
      }
    });
  }
  const shareIcon = modal.querySelector(".fa-paper-plane");
  shareIcon.style.cursor = "pointer";
  shareIcon.addEventListener("click", () => {
    // 1) 이미 생성된 모달이 있나 검사
    let shareModalEl = document.querySelector(".share-modal");

    if (!shareModalEl) {
      // 없으면 생성
      initShareModal();
      shareModalEl = document.querySelector(".share-modal");
    }

    // 2) 숨김 클래스 제거해서 보여 주기
    shareModalEl.classList.remove("hidden");
  });

  // 슬라이더 초기화 함수 정의
  function initSliders(modal) {
    const slider = modal.querySelector(".modal-image-slider");
    if (!slider) return;

    const sliderTrack = slider.querySelector(".slider-track");
    const slides = Array.from(sliderTrack.querySelectorAll("img"));
    const prevBtn = slider.querySelector(".slider-btn.left");
    const nextBtn = slider.querySelector(".slider-btn.right");
    const dots = Array.from(slider.querySelectorAll(".modal-dots span"));

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[currentIndex].classList.add("active");
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });
    });

    updateSlider(); // 초기 설정
  }

  initButtons(modal, postModal);
  initSliders(modal);
}
