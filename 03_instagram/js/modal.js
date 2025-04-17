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
                <div class="modal-likes"><span>좋아요 ${postModal.likes.toLocaleString()}개</span></div>
                <div class="modal-time">${postModal.time}</div>
            </div>
            <div class="modal-actions">
                <div class="left-actions">
                    <i class="far fa-heart"></i><i class="far fa-comment"></i><i class="far fa-paper-plane"></i>
                </div>
                <div class="right-actions"><i class="far fa-bookmark"></i></div>
            </div>
            <div class="modal-add-comment">댓글 달기...</div>
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
}
