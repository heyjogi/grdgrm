document.addEventListener("DOMContentLoaded", () => {
  setupProfileUpload();
  setupUsername();
  setupPosts();
  setupTodos();
});

/* Profile Picture Upload */
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

/* Fixing Todo & Posts Functionality */
function setupTodos() {
  const addTodoButton = document.getElementById("addTodoButton");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");

  addTodoButton.addEventListener("click", () => {
    const todoContent = todoInput.value.trim();
    if (todoContent) {
      const listItem = document.createElement("li");
      listItem.textContent = todoContent;
      todoList.appendChild(listItem);
      todoInput.value = "";
    }
  });
}

function setupPosts() {
  const postButton = document.getElementById("postButton");
  const newPostText = document.getElementById("newPostText");
  const postsList = document.getElementById("postsList");

  postButton.addEventListener("click", () => {
    const postContent = newPostText.value.trim();
    if (postContent) {
      const postItem = document.createElement("div");
      postItem.textContent = postContent;
      postsList.appendChild(postItem);
      newPostText.value = "";
    }
  });
}
