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

      // 타입 아이콘 추가
      if (item.type !== "image") {
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("post-type-icon");
        iconContainer.innerHTML = icons[item.type];
        div.appendChild(iconContainer);
      }

      // 요소들을 조립
      overlay.appendChild(likesStat);
      overlay.appendChild(commentsStat);
      div.appendChild(img);
      div.appendChild(overlay);
      exploreGrid.appendChild(div);
    });
  });
