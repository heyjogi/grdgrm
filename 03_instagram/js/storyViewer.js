document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById("story-viewer");
  const viewerImage = viewer.querySelector(".story-image");
  const viewerUsername = viewer.querySelector(".story-username-text");
  const viewerAvatar = viewer.querySelector(".story-avatar");
  const closeBtn = viewer.querySelector(".story-close");

  // 스토리 썸네일 클릭 이벤트
  document.querySelectorAll(".story-item").forEach((item) => {
    item.addEventListener("click", () => {
      const imgUrl = item.querySelector(".-story").style.backgroundImage;
      const cleanUrl = imgUrl.slice(5, -2); // url("...") → "..."
      const username = item.querySelector(".story-username").innerText;

      viewerImage.src = cleanUrl;
      viewerUsername.innerText = username;
      viewerAvatar.src = cleanUrl; // 프로필 이미지와 같다고 가정

      viewer.classList.remove("hidden");
    });
  });

  // 닫기 버튼
  closeBtn.addEventListener("click", () => {
    viewer.classList.add("hidden");
  });

  // 오버레이 클릭 시 닫기
  viewer.querySelector(".story-overlay").addEventListener("click", () => {
    viewer.classList.add("hidden");
  });
});
