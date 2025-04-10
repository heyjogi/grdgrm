const videoData = {
  videos: [
    {
      title: "[ENG SUB] 백종원이 알려주는 김치밥의 진수",
      tags: "요리,김치,한식,백종원,레시피",
      thumbnail: "https://i.ytimg.com/vi/R6IT_f0XPT8/maxresdefault.jpg",
      channelName: "백종원의 요리비책",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=A",
      stats: "조회수 123만회 · 1개월 전",
    },
    {
      title: "[VLOG] 서울 한복판에서 하루 살아보기! 🇰🇷",
      tags: "브이로그,서울,여행,관광,한국,vlog,korea,seoul",
      thumbnail:
        "https://www.korea.kr/newsWeb/resources/attaches/2023.09/03/KakaoTalk_20230903_192919296_09.jpg",
      channelName: "민지의 브이로그",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=B",
      stats: "조회수 98만회 · 3주 전",
    },
    {
      title: "혼자 공부하는 JavaScript 기초 🧠",
      tags: "프로그래밍,코딩,자바스크립트,개발,javascript,programming,coding",
      thumbnail:
        "https://cdn-prod.hanbit.co.kr/thumbnails/d4e92715-e676-4639-8938-85917ab50fd6.jpg",
      channelName: "코딩하는 고양이",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=C",
      stats: "조회수 45만회 · 5일 전",
    },
    {
      title: "아이폰15 vs 갤럭시S24 솔직 리뷰 📱",
      tags: "테크,리뷰,스마트폰,아이폰,갤럭시,tech,review,smartphone",
      thumbnail: "https://i.ytimg.com/vi/2_O_kAJpXxg/maxresdefault.jpg",
      channelName: "테크몽",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=D",
      stats: "조회수 200만회 · 1주 전",
    },
    {
      title: "부산 돼지국밥 맛집 TOP 5 🍜",
      tags: "맛집,부산,음식,돼지국밥,맛집리뷰,food,busan",
      thumbnail: "https://i.ytimg.com/vi/3G2XYuP0Zz4/sddefault.jpg",
      channelName: "푸드파이터짱",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=E",
      stats: "조회수 77만회 · 2주 전",
    },
    {
      title: "💡 하루 만에 방 꾸미기! 셀프 인테리어 도전기",
      tags: "인테리어,홈데코,셀프인테리어,집꾸미기,interior,homedeco",
      thumbnail:
        "https://images.homify.com/v1440731403/p/photo/image/657937/universe_chest_7.jpg",
      channelName: "홈카페의 모든 것",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=F",
      stats: "조회수 65만회 · 4일 전",
    },
    {
      title: "요즘 핫한 제주도 카페 BEST 31 투어 ☕",
      tags: "제주도,카페,여행,커피,jeju,cafe,travel",
      thumbnail: "https://i.ytimg.com/vi/M3nijojdm0o/maxresdefault.jpg",
      channelName: "트래블러 일상로그",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=G",
      stats: "조회수 362만회 · 2달 전",
    },
    {
      title: "React로 쇼핑몰 만들기 💻 풀 강의",
      tags: "프로그래밍,코딩,리액트,개발,웹개발,react,programming",
      thumbnail:
        "https://blog.kakaocdn.net/dn/bdis28/btsm9gthBHm/JxYQa7dOzseMrBnIyMhyH0/img.png",
      channelName: "코딩의신",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=H",
      stats: "조회수 120만회 · 3개월 전",
    },
    {
      title: "공부할 때 듣기 좋은 빗소리 🌧️",
      tags: "ASMR,힐링,공부,빗소리,백색소음,study,healing",
      thumbnail: "https://i.ytimg.com/vi/t_p7vXS9ULs/maxresdefault.jpg",
      channelName: "힐링사운드",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=I",
      stats: "조회수 56만회 · 1주 전",
    },
    {
      title: "[ENG SUB] 한국 전통시장 투어 🇰🇷",
      tags: "전통시장,한국,여행,관광,시장,market,korea,travel",
      thumbnail:
        "https://www.vviptravel.com/wp-content/uploads/2019/06/gwangjang-market-seoul.jpg",
      channelName: "한국여행로그",
      channelAvatar: "https://via.placeholder.com/36x36.png?text=J",
      stats: "조회수 89만회 · 2주 전",
    },
  ],
  shorts: [
    {
      title: "피자헛 치즈 크러스트 소송",
      tags: "음식,피자,치즈,소송,음식리뷰",
      thumbnail:
        "https://i.ytimg.com/vi/lPF6RwWyzTw/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLDRFfR5DbA0xTuwz0ixXEZT7-tMrw",
      views: "조회수 154만회",
    },
    {
      title: "인도 음식을 먹은 유튜버의 최후",
      tags: "음식,인도,음식리뷰,유튜버",
      thumbnail:
        "https://i.ytimg.com/vi/1asKWWsJdKA/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLCuL7O1sYf10SBPWM2omUbTG2aI9g",
      views: "조회수 306만회",
    },
    {
      title: "중국 공포의 공중다리 #여행",
      tags: "여행,중국,관광,스릴,공포",
      thumbnail:
        "https://i.ytimg.com/vi/CzWoRmk7HiE/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLBA5uOP3SOaFtP1rhGr_TjRs108Wg",
      views: "조회수 150만회",
    },
    {
      title: "일부러 검은색이 될 때까지 쓰는 거라는데?",
      tags: "파키스탄,음식,위생,기름,해외,충격",
      thumbnail:
        "https://i.ytimg.com/vi/-3pMaq8Vka8/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLBVil2Tlj46Jw2_-oD1FrT34RFyQw",
      views: "조회수 165만회",
    },
    {
      title: "골절된 말을 안락사 시키는 이유",
      tags: "동물,말,의료,안락사",
      thumbnail:
        "https://i.ytimg.com/vi/izWBMptqL68/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLC3j2sP2PKGrcmugOUo15YXHpKbuA",
      views: "조회수 315만회",
    },
    {
      title: "호수에 이게 대체 왜 있을까?",
      tags: "자연,호수,미스터리",
      thumbnail:
        "https://i.ytimg.com/vi/akdd0ny6i8w/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLDa1AXCKtH-iYio8Uio4Kyk8qMyHQ",
      views: "조회수 7.1만회",
    },
    {
      title: "낫토와 청국장의 차이",
      tags: "음식,낫토,청국장,한식,일식,비교",
      thumbnail:
        "https://i.ytimg.com/vi/bxemLsZVlVE/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&rs=AOn4CLA3A6CXlVcy_HcARMNkuWb41P8PfQ",
      views: "조회수 10만회",
    },
  ],
};
