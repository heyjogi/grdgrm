document.addEventListener("DOMContentLoaded", () => {
  setupProfileUpload();
  setupUsername();
  setupPosts();
  setupTodos();
});

/* 프로필 사진 올리기 */
function setupProfileUpload() {
  const profilePic = document.getElementById("profilePic");
  const uploadProfilePic = document.getElementById("uploadProfilePic");

  uploadProfilePic.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      profilePic.src = "default-profile.jpg";
    }
  });
}

/* 이름 변경하기 */
function setupUsername() {
  const usernameInput = document.getElementById("usernameInput");

  usernameInput.addEventListener("input", function () {
    localStorage.setItem("username", this.value);
  });

  window.onload = function () {
    usernameInput.value = localStorage.getItem("username") || "사용자 이름";
  };
}

/* 게시물/리스트 포스트 */
setupPosts();
setupTodos();
