// 하단 네비게이션 탭들 (홈, 탐색, grok, 알림, 쪽지)
const tabLinks = document.querySelectorAll(".tab-link");

// 상단 탭들 (전체, 멘션)
const notifTabs = document.querySelectorAll(".notif-tab");

// 스크롤할 때 숨겨지는 하단바
const bottombarSlide = document.querySelector(".bottombar-slide");

// 액션 버튼들
const likeBtn = document.querySelector(".tweet-action-btn--like");
const bookmarkBtn = document.querySelector(".tweet-action-btn--bookmark");
const replyBtn = document.querySelector("[data-testid='reply']");
const shareBtn = document.querySelector(".tweet-action-btn--share");


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

window.addEventListener("scroll", () => {
    if (!bottombarSlide) return;

    const currentY = window.scrollY;

    if (currentY > lastScrollY && currentY > 100) {
        bottombarSlide.style.transform = "translateY(100%)";
    } else {
        bottombarSlide.style.transform = "translateY(0)";
    }

    lastScrollY = currentY;
}, { passive: true });


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


// 하트 버튼 - 클릭하면 색 바뀌고 path도 채워진 모양으로 교체, 한 번 더 누르면 원래대로
if (likeBtn) {
    const likePath = likeBtn.querySelector("path");
    const likeCount = likeBtn.querySelector(".tweet-action-count");

    likeBtn.addEventListener("click", () => {
        const isActive = likeBtn.classList.contains("active");

        if (isActive) {
            // 좋아요 취소
            likeBtn.classList.remove("active");
            likeBtn.setAttribute("data-testid", "like");
            likePath.setAttribute("d", likePath.dataset.pathInactive);
            likeCount.textContent = "";
        } else {
            // 좋아요
            likeBtn.classList.add("active");
            likeBtn.setAttribute("data-testid", "unlike");
            likePath.setAttribute("d", likePath.dataset.pathActive);
            likeCount.textContent = "1";
        }
    });
}


// 북마크 버튼 - 클릭하면 파란색으로 바뀌고 채워진 아이콘으로 교체
if (bookmarkBtn) {
    const bookmarkPath = bookmarkBtn.querySelector("path");

    bookmarkBtn.addEventListener("click", () => {
        const isActive = bookmarkBtn.classList.contains("active");

        if (isActive) {
            // 북마크 취소
            bookmarkBtn.classList.remove("active");
            bookmarkBtn.setAttribute("data-testid", "bookmark");
            bookmarkBtn.setAttribute("aria-label", "북마크");
            bookmarkPath.setAttribute("d", bookmarkPath.dataset.pathInactive);
        } else {
            // 북마크 추가
            bookmarkBtn.classList.add("active");
            bookmarkBtn.setAttribute("data-testid", "removeBookmark");
            bookmarkBtn.setAttribute("aria-label", "북마크에 추가됨");
            bookmarkPath.setAttribute("d", bookmarkPath.dataset.pathActive);
        }
    });
}


// 댓글 버튼 - 클릭하면 답글 작성 모달이 뜸
if (replyBtn) {
    replyBtn.addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.className = "tweet-modal-overlay";

        overlay.innerHTML = `
            <div class="tweet-modal" role="dialog" aria-modal="true" aria-label="답글 작성">
                <div class="tweet-modal__header">
                    <button class="tweet-modal__close" aria-label="닫기" data-testid="app-bar-close">
                        <svg viewBox="0 0 24 24" width="20" height="20"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/></g></svg>
                    </button>
                    <button class="tweet-modal__draft" data-testid="unsentButton">초안</button>
                </div>

                <div class="tweet-modal__body">
                    <div class="tweet-modal__avatar">K</div>
                    <div class="tweet-modal__input-wrap">
                        <button class="tweet-modal__audience" aria-label="오디언스 선택">모든 사람 ∨</button>
                        <div class="tweet-modal__editor"
                             contenteditable="true"
                             role="textbox"
                             aria-label="게시물 본문"
                             aria-multiline="true"
                             tabindex="0"
                             data-testid="tweetTextarea_0"></div>
                    </div>
                </div>

                <div class="tweet-modal__reply-setting">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></g></svg>
                    <span>모든 사람이 답글을 달 수 있습니다</span>
                </div>

                <div class="tweet-modal__footer">
                    <div class="tweet-modal__toolbar" data-testid="toolBar">
                        <button class="tweet-modal__tool-btn" aria-label="사진 또는 동영상 추가">
                            <svg viewBox="0 0 24 24" width="20" height="20"><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"/></g></svg>
                        </button>
                        <button class="tweet-modal__tool-btn" aria-label="GIF 추가" data-testid="gifSearchButton">
                            <svg viewBox="0 0 24 24" width="20" height="20"><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13zm2.5 8h1v-2h2V9.5h-2v-1H8v5h1v-2zm5.5 2v-5h-1.5v5H13zm3-3v1h-2.5v2h3.5v1H13v-5h3.5v1H14z"/></g></svg>
                        </button>
                        <button class="tweet-modal__tool-btn" aria-label="이모티콘 추가하기">
                            <svg viewBox="0 0 24 24" width="20" height="20"><g><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20c-5.109 0-9.25 4.141-9.25 9.25s4.141 9.25 9.25 9.25 9.25-4.141 9.25-9.25S17.109 2.75 12 2.75zM9 11.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm6 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm-8.071 3.971c.307-.298.771-.397 1.188-.253C9.07 16.154 10.52 16.75 12 16.75s2.93-.596 3.883-.982c.417-.144.88-.044 1.188.253a.846.846 0 01-.149 1.34c-1.254.715-3.059 1.139-4.922 1.139s-3.668-.424-4.922-1.139a.847.847 0 01-.149-1.39z"/></g></svg>
                        </button>
                    </div>
                    <button class="tweet-modal__submit" data-testid="tweetButton" disabled>게시하기</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector(".tweet-modal__close");
        const editor = overlay.querySelector(".tweet-modal__editor");
        const submitBtn = overlay.querySelector(".tweet-modal__submit");

        // 닫기 버튼 클릭하면 모달 제거
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });

        // 모달 바깥 클릭해도 닫힘
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // 텍스트 입력하면 게시 버튼 활성화, 비우면 다시 비활성화
        editor.addEventListener("input", () => {
            const hasText = editor.textContent.trim().length > 0;
            submitBtn.disabled = !hasText;
        });

        // 모달 열리면 바로 입력창에 포커스
        editor.focus();
    });
}


// 공유 버튼 - 클릭하면 드롭다운 메뉴가 뜸
if (shareBtn) {
    shareBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 이미 열려있으면 닫기
        const existing = document.querySelector(".tweet-dropdown");
        if (existing) {
            existing.remove();
            return;
        }

        // 드롭다운 생성
        const dropdown = document.createElement("div");
        dropdown.className = "tweet-dropdown";

        dropdown.innerHTML = `
            <div class="tweet-dropdown__item">
                <svg class="tweet-dropdown__icon" viewBox="0 0 24 24"><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"/></g></svg>
                링크 복사하기
            </div>
            <div class="tweet-dropdown__item">
                <svg class="tweet-dropdown__icon" viewBox="0 0 24 24"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></g></svg>
                게시물 공유하기
            </div>
            <div class="tweet-dropdown__item">
                <svg class="tweet-dropdown__icon" viewBox="0 0 24 24"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/></g></svg>
                Chat으로 전송하기
            </div>
            <div class="tweet-dropdown__item">
                <svg class="tweet-dropdown__icon" viewBox="0 0 24 24"><g><path d="M18 3V0h2v3h3v2h-3v3h-2V5h-3V3zm-7.5 1H2v18h18v-8.5h-2V20H4V6h6.5V4zM8 14h8v2H8v-2zm0-4h8v2H8v-2z"/></g></svg>
                폴더에 북마크 추가하기
            </div>
        `;

        // 공유 버튼 위치 기준으로 드롭다운 위치 잡기
        const rect = shareBtn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 4) + "px";
        dropdown.style.right = (window.innerWidth - rect.right) + "px";

        document.body.appendChild(dropdown);

        // 바깥 클릭하면 드롭다운 닫기
        document.addEventListener("click", () => {
            dropdown.remove();
        }, { once: true });
    });
}
