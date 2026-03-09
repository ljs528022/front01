// 하단 네비게이션 탭들 (홈, 탐색, grok, 알림, 쪽지)
const tabLinks = document.querySelectorAll(".tab-link");

// 상단 탭들 (전체, 멘션)
const notifTabs = document.querySelectorAll(".notif-tab");

// 스크롤할 때 숨겨지는 하단바
const bottombarSlide = document.querySelector(".bottombar-slide");

// 클릭한 탭만 아이콘을 채워진 모양으로 바꾸고 나머지는 외곽선으로 되돌림
function setActiveTab(tabName) {
    tabLinks.forEach((link) => {
        const path = link.querySelector("path");
        if (!path) return;

        const isActive = link.dataset.tab === tabName;
        path.setAttribute(
            "d",
            isActive ? path.dataset.active : path.dataset.inactive,
        );
        link.classList.toggle("tab-link--active", isActive);
    });
}

// 알림 페이지니까 처음 들어왔을 때 알림 탭이 활성화되어 있어야 함
setActiveTab("notifications");

// 하단 탭 클릭하면 해당 탭 아이콘 활성화
tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveTab(link.dataset.tab);
    });
});

// 스크롤 내리면 하단바 숨기고, 올리면 다시 보여줌
let lastScrollY = 0;

window.addEventListener(
    "scroll",
    (e) => {
        if (!bottombarSlide) return;

        const currentY = window.scrollY;

        if (currentY > lastScrollY && currentY > 100) {
            bottombarSlide.style.transform = "translateY(100%)";
        } else {
            bottombarSlide.style.transform = "translateY(0)";
        }

        lastScrollY = currentY;
    },
    { passive: true },
);

// 전체 / 멘션 탭 클릭하면 파란 밑줄이 해당 탭으로 이동
notifTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();

        // 일단 전부 비활성화
        notifTabs.forEach((t) => {
            t.classList.remove("notif-tab--active");
            t.setAttribute("aria-selected", "false");
        });

        // 클릭한 탭만 활성화
        tab.classList.add("notif-tab--active");
        tab.setAttribute("aria-selected", "true");
    });
});
