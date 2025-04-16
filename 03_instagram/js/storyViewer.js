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

    this.init();
  }

  async init() {
    try {
      // story_data.json 불러오기
      const response = await fetch("../data/story_data.json");
      const data = await response.json();
      this.stories = data.stories;

      // 스토리 아이템 클릭 이벤트 설정
      this.setupEventListeners();
    } catch (error) {
      console.error("스토리 데이터를 불러오는데 실패했습니다:", error);
    }
  }

  setupEventListeners() {
    // 스토리 아이템 클릭 이벤트
    const storyItems = document.querySelectorAll(".story-item");
    storyItems.forEach((item, index) => {
      item.addEventListener("click", () => this.showStory(index));
    });

    // 닫기 버튼
    this.viewer
      .querySelector(".story-close")
      .addEventListener("click", () => this.closeViewer());

    // 이전/다음 스토리 네비게이션
    this.mediaContainer.addEventListener("click", (e) => {
      const rect = this.mediaContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x < rect.width / 2) {
        this.prevStory();
      } else {
        this.nextStory();
      }
    });

    // 마우스 호버 시 일시정지
    this.mediaContainer.addEventListener("mouseenter", () => this.pauseTimer());
    this.mediaContainer.addEventListener("mouseleave", () =>
      this.resumeTimer()
    );
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
    this.mediaContainer.innerHTML = `<img src="${item.url}" alt="Story">`;
    if (item.caption) {
      this.mediaContainer.innerHTML += `<div class="story-caption">${item.caption}</div>`;
    }

    // 프로그레스 바 업데이트
    this.updateProgress();

    // 타이머 시작
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
  }

  resumeTimer() {
    this.startTimer();
  }

  nextStory() {
    const story = this.stories[this.currentStoryIndex];

    if (this.currentItemIndex < story.items.length - 1) {
      // 다음 아이템으로
      this.currentItemIndex++;
    } else if (this.currentStoryIndex < this.stories.length - 1) {
      // 다음 스토리로
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
      // 이전 아이템으로
      this.currentItemIndex--;
    } else if (this.currentStoryIndex > 0) {
      // 이전 스토리로
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
}

// 스토리 뷰어 초기화
document.addEventListener("DOMContentLoaded", () => {
  new StoryViewer();
});
