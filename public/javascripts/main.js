console.log('js');

const fadeEls = document.querySelectorAll('.fade-in');
fadeEls.forEach(function (fadeEl, index) {
  gsap.to(fadeEl, 1, {
    delay: (index + 1) *.7,
    opacity: 1
  });
});


// 알림을 지원하는지 확인
if ("Notification" in window) {
  // 사용자에게 알림 허용 여부를 요청
  Notification.requestPermission()
    .then(function (permission) {
      if (permission === "granted") {
        // 알림 생성
        var notification = new Notification("알림 제목", {
          body: "알림 내용",
          icon: "알림 아이콘 URL",
        });

        // 알림 클릭 시 동작 설정
        notification.onclick = function () {
          // 알림을 클릭했을 때 수행할 동작
        };
      }
    })
    .catch(function (error) {
      console.error("알림 허용 요청 실패:", error);
    });
}