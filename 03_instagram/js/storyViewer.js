class StoryViewer {
  constructor() {
    this.stories = [];
    this.currentStoryIndex = 0;
    this.currentItemIndex = 0;
    this.timer = null;
    this.viewer = document.getElementById("story-viewer");
    this.mediaContainer = this.viewer.querySelector(".story-media");
    this.progressContainer = this.viewer.querySelector(".story-progress");
    this.avatar = this.viewer.querySelector(".story-avatar");
    this.username = this.viewer.querySelector(".story-username-text");
    this.isPaused = false;
    this.pauseBtn = this.viewer.querySelector(".story-pause");
    this.likeButton = this.viewer.querySelector(".story-like");
    this.init();
  }

  async init() {
    try {
      const response = await fetch("../data/story_data.json");
      const data = await response.json();
      this.stories = data.stories;

      this.setupEventListeners();
    } catch (error) {
      console.error("스토리 데이터를 불러오는데 실패했습니다:", error);
    }
  }

  setupEventListeners() {
    const storyItems = document.querySelectorAll(".story-item");
    storyItems.forEach((item, index) => {
      item.addEventListener("click", () => this.showStory(index));
    });

    this.viewer
      .querySelector(".story-close")
      .addEventListener("click", () => this.closeViewer());

    this.mediaContainer.addEventListener("click", (e) => {
      const rect = this.mediaContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x < rect.width / 2) {
        this.prevStory();
      } else {
        this.nextStory();
      }
    });

    this.pauseBtn.addEventListener("click", () => {
      if (this.isPaused) {
        this.resumeTimer();
        this.isPaused = false;
        this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        this.pauseTimer();
        this.isPaused = true;
        this.pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });

    this.likeButton.addEventListener("click", () => {
      const story = this.stories[this.currentStoryIndex];
      story.liked = !story.liked;
      this.updateLikeButton();
    });
  }

  showStory(index) {
    this.currentStoryIndex = index;
    this.currentItemIndex = 0;
    this.viewer.classList.remove("hidden");
    this.updateStoryContent();
  }

  updateStoryContent() {
    const story = this.stories[this.currentStoryIndex];
    const item = story.items[this.currentItemIndex];

    // 사용자 정보 업데이트
    this.avatar.src = story.user.avatar;
    this.username.textContent = story.user.username;

    // 미디어 콘텐츠 업데이트
    if (item.type === "image") {
      this.mediaContainer.innerHTML = `<img src="${item.url}" alt="Story">`;
    } else if (item.type === "video") {
      this.mediaContainer.innerHTML = `<video src="${item.url}" autoplay muted playsinline></video>`;
    }

    if (item.caption) {
      this.mediaContainer.innerHTML += `<div class="story-caption">${item.caption}</div>`;
    }

    this.updateProgress();
    this.updateLikeButton();
    this.startTimer();
  }

  updateProgress() {
    this.progressContainer.innerHTML = "";
    const story = this.stories[this.currentStoryIndex];

    story.items.forEach((_, index) => {
      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";

      if (index < this.currentItemIndex) {
        progressBar.classList.add("completed");
      } else if (index === this.currentItemIndex) {
        progressBar.classList.add("active");
        if (this.isPaused) {
          progressBar.classList.add("paused");
        }
      }

      this.progressContainer.appendChild(progressBar);
    });
  }

  startTimer() {
    if (this.timer) clearTimeout(this.timer);

    const story = this.stories[this.currentStoryIndex];
    const item = story.items[this.currentItemIndex];

    this.timer = setTimeout(() => this.nextStory(), item.duration || 5000);
  }

  pauseTimer() {
    if (this.timer) clearTimeout(this.timer);
    const activeBar = this.progressContainer.querySelector(
      ".progress-bar.active"
    );
    if (activeBar) activeBar.classList.add("paused");
  }

  resumeTimer() {
    const activeBar = this.progressContainer.querySelector(
      ".progress-bar.active"
    );
    if (activeBar) activeBar.classList.remove("paused");
    this.startTimer();
  }

  nextStory() {
    const story = this.stories[this.currentStoryIndex];

    if (this.currentItemIndex < story.items.length - 1) {
      this.currentItemIndex++;
    } else if (this.currentStoryIndex < this.stories.length - 1) {
      this.currentStoryIndex++;
      this.currentItemIndex = 0;
    } else {
      // 모든 스토리 종료
      this.closeViewer();
      return;
    }

    this.updateStoryContent();
  }

  prevStory() {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
    } else if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      const story = this.stories[this.currentStoryIndex];
      this.currentItemIndex = story.items.length - 1;
    }

    this.updateStoryContent();
  }

  closeViewer() {
    this.viewer.classList.add("hidden");
    if (this.timer) clearTimeout(this.timer);
  }

  updateLikeButton() {
    const story = this.stories[this.currentStoryIndex];
    const icon = this.likeButton.querySelector("i");

    if (story.liked) {
      this.likeButton.classList.add("liked");
      icon.classList.remove("far");
      icon.classList.add("fas");
    } else {
      this.likeButton.classList.remove("liked");
      icon.classList.remove("fas");
      icon.classList.add("far");
    }
  }
}

// 스토리 뷰어 초기화
document.addEventListener("DOMContentLoaded", () => {
  new StoryViewer();
});
