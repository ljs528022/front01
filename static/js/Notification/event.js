// Notification 화면 전용 이벤트 스크립트
// - 하단 탭, 알림 탭, 답글 모달, 공유 메뉴, 이모지/위치 선택기를 한 파일에서 관리한다.
// - 서버 라우팅처럼 주소를 바꾸는 로직은 주석 처리하고 DOM 이벤트 기반 UI 토글만 사용한다.

// 페이지 공통 탭 요소
const tabLinks = document.querySelectorAll(".tab-link");
const notifTabs = document.querySelectorAll(".notif-tab");
const bottombarSlide = document.querySelector(".bottombar-slide");
const layersRoot = document.getElementById("layers");

// 답글 모달과 내부 요소
const replyModalOverlay = document.querySelector("[data-reply-modal]");
const replyModal = replyModalOverlay?.querySelector(".tweet-modal");
const replyCloseButton = replyModalOverlay?.querySelector(".tweet-modal__close");
const replyEditor = replyModalOverlay?.querySelector(".tweet-modal__editor");
const replySubmitButton = replyModalOverlay?.querySelector(".tweet-modal__submit");
const replyProgress = replyModalOverlay?.querySelector(".tweet-modal__progress");
const replyProgressBar = replyModalOverlay?.querySelector(".tweet-modal__progress-bar");
const replyContextButton = replyModalOverlay?.querySelector(".tweet-modal__context-button");
const replyFooterMeta = replyModalOverlay?.querySelector(".tweet-modal__footer-meta");
const replySourceAvatar = replyModalOverlay?.querySelector(".tweet-modal__source-avatar");
const replySourceName = replyModalOverlay?.querySelector(".tweet-modal__source-name");
const replySourceHandle = replyModalOverlay?.querySelector(".tweet-modal__source-handle");
const replySourceTime = replyModalOverlay?.querySelector(".tweet-modal__source-time");
const replySourceText = replyModalOverlay?.querySelector(".tweet-modal__source-text");
const replyFormatButtons = replyModalOverlay?.querySelectorAll("[data-format]") ?? [];
const replyEmojiButton = replyModalOverlay?.querySelector("[data-testid='emojiButton']");
const replyEmojiPicker = replyModalOverlay?.querySelector(".tweet-modal__emoji-picker");
const replyEmojiSearchInput = replyModalOverlay?.querySelector("[data-testid='emojiSearchInput']");
const replyEmojiTabs = replyModalOverlay?.querySelectorAll(".tweet-modal__emoji-tab") ?? [];
const replyEmojiContent = replyModalOverlay?.querySelector("[data-testid='emojiPickerContent']");
const replyMediaUploadButton = replyModalOverlay?.querySelector("[data-testid='mediaUploadButton']");
const replyFileInput = replyModalOverlay?.querySelector("[data-testid='fileInput']");
const replyAttachmentPreview = replyModalOverlay?.querySelector("[data-attachment-preview]");
const replyAttachmentMedia = replyModalOverlay?.querySelector("[data-attachment-media]");
const composeView = replyModalOverlay?.querySelector(".tweet-modal__compose-view");
const replyGeoButton = replyModalOverlay?.querySelector("[data-testid='geoButton']");
const replyGeoButtonPath = replyGeoButton?.querySelector("path");
const replyLocationDisplayButton = replyModalOverlay?.querySelector("[data-location-display]");
const replyLocationName = replyModalOverlay?.querySelector("[data-location-name]");
const replyLocationView = replyModalOverlay?.querySelector(".tweet-modal__location-view");
const replyLocationCloseButton = replyModalOverlay?.querySelector(".tweet-modal__location-close");
const replyLocationDeleteButton = replyModalOverlay?.querySelector("[data-location-delete]");
const replyLocationCompleteButton = replyModalOverlay?.querySelector("[data-location-complete]");
const replyLocationSearchInput = replyModalOverlay?.querySelector("[data-location-search]");
const replyLocationList = replyModalOverlay?.querySelector("[data-location-list]");

// 화면 상태값
let lastScrollY = 0;
let activeReplyTrigger = null;
let activeShareDropdown = null;
let activeShareButton = null;
let activeMoreDropdown = null;
let activeMoreButton = null;
let savedReplySelection = null;
let pendingReplyFormats = new Set();
let activeEmojiCategory = "recent";
let selectedLocation = null;
let pendingLocation = null;
let attachedReplyFiles = [];
let attachedReplyFileUrls = [];
let pendingAttachmentEditIndex = null;
const maxReplyImages = 4;

// 이모지/위치 데이터
const emojiRecentsKey = "notification_reply_recent_emojis";
const maxRecentEmojis = 18;
const availableLocations = [
    "대한민국 서초구",
    "대한민국 강남구",
    "대한민국 송파구",
    "대한민국 광진구",
    "대한민국 동작구",
    "대한민국 중구",
    "대한민국 과천시",
    "대한민국 관악구",
    "대한민국 동대문구",
    "대한민국 강동구",
    "대한민국 중랑구",
    "대한민국 성동구",
    "대한민국 용산구",
    "대한민국 마포구",
];

const emojiCategoryMeta = {
    recent: {
        label: "최근",
        sectionTitle: "최근",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 1.75A10.25 10.25 0 112.75 12 10.26 10.26 0 0112 1.75zm0 1.5A8.75 8.75 0 1020.75 12 8.76 8.76 0 0012 3.25zm.75 3.5v5.19l3.03 1.75-.75 1.3-3.78-2.18V6.75h1.5z"></path></g></svg>',
    },
    smileys: {
        label: "스마일리 및 사람",
        sectionTitle: "스마일리 및 사람",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20c-5.109 0-9.25 4.141-9.25 9.25s4.141 9.25 9.25 9.25 9.25-4.141 9.25-9.25S17.109 2.75 12 2.75zM9 11.75c-.69 0-1.25-.56-1.25-1.25S8.31 9.25 9 9.25s1.25.56 1.25 1.25S9.69 11.75 9 11.75zm6 0c-.69 0-1.25-.56-1.25-1.25S14.31 9.25 15 9.25s1.25.56 1.25 1.25S15.69 11.75 15 11.75zm-8.071 3.971c.307-.298.771-.397 1.188-.253.953.386 2.403.982 3.883.982s2.93-.596 3.883-.982c.417-.144.88-.044 1.188.253a.846.846 0 01-.149 1.34c-1.254.715-3.059 1.139-4.922 1.139s-3.668-.424-4.922-1.139a.847.847 0 01-.149-1.39z"></path></g></svg>',
    },
    animals: {
        label: "동물 및 자연",
        sectionTitle: "동물 및 자연",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 3.5c3.77 0 6.75 2.86 6.75 6.41 0 3.17-1.88 4.94-4.15 6.28-.74.44-1.54.9-1.6 1.86-.02.38-.33.68-.71.68h-.6a.71.71 0 01-.71-.67c-.07-.95-.86-1.42-1.6-1.85C7.13 14.85 5.25 13.08 5.25 9.91 5.25 6.36 8.23 3.5 12 3.5zm-4.79-.97c.61 0 1.1.49 1.1 1.1 0 .32-.14.63-.39.84-.4.34-.78.78-1.08 1.3-.18.3-.49.48-.84.48-.61 0-1.1-.49-1.1-1.1 0-.14.03-.29.09-.42.47-1.04 1.17-1.93 2.02-2.63.19-.15.43-.24.7-.24zm9.58 0c.27 0 .51.09.7.24.85.7 1.55 1.6 2.02 2.63.06.13.09.28.09.42 0 .61-.49 1.1-1.1 1.1-.35 0-.66-.18-.84-.48-.3-.52-.68-.96-1.08-1.3a1.1 1.1 0 01-.39-.84c0-.61.49-1.1 1.1-1.1z"></path></g></svg>',
    },
    food: {
        label: "음식 및 음료",
        sectionTitle: "음식 및 음료",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M5 10.5c0-3.59 3.36-6.5 7.5-6.5s7.5 2.91 7.5 6.5v.58a5.42 5.42 0 01-2.08 4.26L16.5 21H8.5l-1.42-5.66A5.42 5.42 0 015 11.08v-.58zm2 0v.58c0 1.08.5 2.08 1.36 2.76l.3.24.95 3.92h5.78l.95-3.92.3-.24a3.42 3.42 0 001.36-2.76v-.58c0-2.48-2.47-4.5-5.5-4.5S7 8.02 7 10.5z"></path></g></svg>',
    },
    activities: {
        label: "활동",
        sectionTitle: "활동",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 1.5A8.25 8.25 0 103.75 12 8.26 8.26 0 0012 3.75zm-4.1 4.5c.27 0 .53.12.71.33l1.94 2.55 3.12-2.29c.36-.27.87-.22 1.18.12l2.83 3.12a.88.88 0 01-.07 1.24.88.88 0 01-1.24-.07l-2.3-2.54-3.16 2.33a.88.88 0 01-1.23-.16L7.2 9.64a.88.88 0 01.7-1.39z"></path></g></svg>',
    },
    travel: {
        label: "여행 및 장소",
        sectionTitle: "여행 및 장소",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2.25c-4.142 0-7.5 3.245-7.5 7.248 0 5.207 6.46 11.611 6.735 11.881a1.08 1.08 0 001.53 0c.275-.27 6.735-6.674 6.735-11.881 0-4.003-3.358-7.248-7.5-7.248zm0 17.493c-1.758-1.878-6-6.838-6-10.245 0-3.172 2.686-5.748 6-5.748s6 2.576 6 5.748c0 3.407-4.242 8.367-6 10.245zm0-13.243a3 3 0 100 6 3 3 0 000-6z"></path></g></svg>',
    },
    objects: {
        label: "사물",
        sectionTitle: "사물",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2.5c2.07 0 3.75 1.68 3.75 3.75 0 1.45-.83 2.71-2.04 3.33l-.21.11V11h.5A2.5 2.5 0 0116.5 13.5v1.38c0 1.27-.7 2.43-1.82 3.03l-.93.5V21.5h-3.5v-3.09l-.93-.5A3.44 3.44 0 017.5 14.88V13.5A2.5 2.5 0 0110 11h.5V9.69l-.21-.11A3.75 3.75 0 018.25 6.25 3.75 3.75 0 0112 2.5zm0 1.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-2 8.5a1 1 0 00-1 1v1.38c0 .72.4 1.39 1.04 1.73l1.71.92v1.47h.5v-1.47l1.71-.92A1.97 1.97 0 0015 14.88V13.5a1 1 0 00-1-1h-4z"></path></g></svg>',
    },
    symbols: {
        label: "기호",
        sectionTitle: "기호",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M5 4h14v4.5h-2V6H7v2.5H5V4zm2 6h4v4H7v-4zm6 0h4v4h-4v-4zM5 16h6v4H5v-4zm8 0h6v4h-6v-4z"></path></g></svg>',
    },
    flags: {
        label: "깃발",
        sectionTitle: "깃발",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M6 2.75A.75.75 0 016.75 2h.5a.75.75 0 01.75.75V3h9.38c.97 0 1.45 1.17.76 1.85L16.1 6.9l2.05 2.05c.69.68.21 1.85-.76 1.85H8v10.45a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75V2.75z"></path></g></svg>',
    },
};

const emojiCategoryData = {
    smileys: ["😀", "😃", "😄", "😁", "😆", "🥹", "😂", "🤣", "😊", "😉", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "😐", "😑", "😌", "🙃", "😏", "🥳", "😭", "😤", "😴", "😵", "🤯", "😎", "🤓", "🫠", "😇", "🤠"],
    animals: ["🐶", "🐱", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐧", "🐦", "🦄", "🐝", "🦋", "🌸", "🌻", "🍀", "🌿", "🌈", "🌞", "⭐", "🌙"],
    food: ["🍔", "🍟", "🍕", "🌭", "🍗", "🍜", "🍣", "🍩", "🍪", "🍫", "🍿", "🥐", "🍎", "🍓", "🍉", "🍇", "☕", "🍵", "🧃", "🥤", "🍺", "🍷"],
    activities: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎮", "🎲", "🎯", "🎳", "🎸", "🎧", "🎬", "📚", "🧩", "🏆", "🥇", "🏃", "🚴", "🏊"],
    travel: ["🚗", "🚕", "🚌", "🚎", "🚓", "🚑", "✈️", "🚀", "🛸", "🚲", "⛵", "🚉", "🏠", "🏙️", "🌋", "🏝️", "🗼", "🗽", "🎡", "🌁"],
    objects: ["💡", "📱", "💻", "⌚", "📷", "🎥", "🕹️", "💰", "💎", "🔑", "🪄", "🎁", "📌", "🧸", "🛒", "🧴", "💊", "🧯", "📢", "🧠"],
    symbols: ["❤️", "💙", "💚", "💛", "💜", "🖤", "✨", "💫", "💥", "💯", "✔️", "❌", "⚠️", "🔔", "♻️", "➕", "➖", "➗", "✖️", "🔣"],
    flags: ["🏳️", "🏴", "🏁", "🚩", "🎌", "🏳️‍🌈", "🇰🇷", "🇺🇸", "🇯🇵", "🇫🇷", "🇬🇧", "🇩🇪", "🇨🇦", "🇦🇺"],
};

const formatButtonLabels = {
    bold: {
        inactive: "굵게, (CTRL+B) 님",
        active: "굵게, 활성 상태, (CTRL+B) 님 님",
    },
    italic: {
        inactive: "기울임꼴, (CTRL+I) 님",
        active: "기울임꼴, 활성 상태, (CTRL+I) 님 님",
    },
};

function getTextContent(element) {
    return element?.textContent.trim() ?? "";
}

// Twemoji CDN이 로드되어 있으면 현재 영역의 유니코드 이모지를 SVG로 치환한다.
function parseTwemoji(scope) {
    if (!scope || !window.twemoji) {
        return;
    }

    window.twemoji.parse(scope, {
        folder: "svg",
        ext: ".svg",
    });
}

function getRecentEmojis() {
    try {
        const saved = window.localStorage.getItem(emojiRecentsKey);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveRecentEmoji(emoji) {
    const recent = getRecentEmojis().filter((item) => item !== emoji);
    recent.unshift(emoji);

    try {
        window.localStorage.setItem(
            emojiRecentsKey,
            JSON.stringify(recent.slice(0, maxRecentEmojis)),
        );
    } catch {
        return;
    }
}

function clearRecentEmojis() {
    try {
        window.localStorage.removeItem(emojiRecentsKey);
    } catch {
        return;
    }
}

function getEmojiSearchTerm() {
    return replyEmojiSearchInput?.value.trim().toLowerCase() ?? "";
}

function getEmojiEntriesForCategory(category) {
    if (category === "recent") {
        return getRecentEmojis().map((emoji) => ({ emoji, keywords: [emoji] }));
    }

    return (emojiCategoryData[category] ?? []).map((emoji) => ({
        emoji,
        keywords: [emoji, emojiCategoryMeta[category]?.label ?? ""],
    }));
}

function getFilteredEmojiEntries(category) {
    const entries = getEmojiEntriesForCategory(category);
    const searchTerm = getEmojiSearchTerm();

    if (!searchTerm) {
        return entries;
    }

    return entries.filter((entry) =>
        entry.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm)),
    );
}

function buildEmojiSection(title, emojis, { clearable = false, emptyText = "" } = {}) {
    const headerAction = clearable
        ? '<button type="button" class="tweet-modal__emoji-clear" data-action="clear-recent">모두 지우기</button>'
        : "";

    const body = emojis.length
        ? `
            <div class="tweet-modal__emoji-grid">
                ${emojis
                    .map(
                        (emoji) => `
                            <button type="button" class="tweet-modal__emoji-option" data-emoji="${emoji}" role="menuitem">${emoji}</button>
                        `,
                    )
                    .join("")}
            </div>
        `
        : `<p class="tweet-modal__emoji-empty">${emptyText}</p>`;

    return `
        <section class="tweet-modal__emoji-section">
            <div class="tweet-modal__emoji-section-header">
                <h3 class="tweet-modal__emoji-section-title">${title}</h3>
                ${headerAction}
            </div>
            ${body}
        </section>
    `;
}

function renderEmojiTabs() {
    replyEmojiTabs.forEach((tab) => {
        const category = tab.getAttribute("data-emoji-category");
        const meta = category ? emojiCategoryMeta[category] : null;
        const isActive = category === activeEmojiCategory;

        tab.classList.toggle("tweet-modal__emoji-tab--active", isActive);
        tab.setAttribute("aria-selected", String(isActive));

        if (meta) {
            tab.innerHTML = meta.icon;
        }
    });

    parseTwemoji(replyEmojiPicker);
}

function renderEmojiPickerContent() {
    if (!replyEmojiContent) {
        return;
    }

    const searchTerm = getEmojiSearchTerm();

    if (searchTerm) {
        const sections = Object.keys(emojiCategoryData)
            .map((category) => {
                const entries = getFilteredEmojiEntries(category);

                if (entries.length === 0) {
                    return "";
                }

                return buildEmojiSection(
                    emojiCategoryMeta[category].sectionTitle,
                    entries.map((entry) => entry.emoji),
                );
            })
            .join("");

        replyEmojiContent.innerHTML =
            sections ||
            buildEmojiSection("검색 결과", [], {
                emptyText: "일치하는 이모티콘이 없습니다.",
            });
        parseTwemoji(replyEmojiContent);
        return;
    }

    if (activeEmojiCategory === "recent") {
        const recent = getRecentEmojis();
        const recentSection = buildEmojiSection("최근", recent, {
            clearable: recent.length > 0,
            emptyText: "최근 사용한 이모티콘이 없습니다.",
        });
        const smileys = buildEmojiSection(
            emojiCategoryMeta.smileys.sectionTitle,
            getEmojiEntriesForCategory("smileys").map((entry) => entry.emoji),
        );

        replyEmojiContent.innerHTML = recentSection + smileys;
        parseTwemoji(replyEmojiContent);
        return;
    }

    const entries = getEmojiEntriesForCategory(activeEmojiCategory).map((entry) => entry.emoji);
    replyEmojiContent.innerHTML = buildEmojiSection(
        emojiCategoryMeta[activeEmojiCategory].sectionTitle,
        entries,
    );
    parseTwemoji(replyEmojiContent);
}

function renderEmojiPicker() {
    renderEmojiTabs();
    renderEmojiPickerContent();
}

function isLocationModalOpen() {
    return Boolean(replyLocationView && !replyLocationView.hidden);
}

function getLocationSearchTerm() {
    return replyLocationSearchInput?.value.trim() ?? "";
}

function getFilteredLocations() {
    const searchTerm = getLocationSearchTerm();

    if (!searchTerm) {
        return availableLocations;
    }

    return availableLocations.filter((location) => location.includes(searchTerm));
}

// 위치 선택 상태에 따라 위치 pill / 삭제 버튼 / 툴바 라벨을 갱신한다.
function syncLocationUI() {
    const hasLocation = Boolean(selectedLocation);

    if (replyFooterMeta) {
        replyFooterMeta.hidden = !hasLocation;
    }

    if (replyLocationName) {
        replyLocationName.textContent = selectedLocation ?? "";
    }

    if (replyLocationDisplayButton) {
        replyLocationDisplayButton.hidden = !hasLocation;
        replyLocationDisplayButton.setAttribute(
            "aria-label",
            hasLocation ? `위치 ${selectedLocation}` : "위치 태그하기",
        );
    }

    if (replyGeoButton) {
        replyGeoButton.hidden = false;
        replyGeoButton.setAttribute(
            "aria-label",
            hasLocation ? `위치 태그하기, ${selectedLocation}` : "위치 태그하기",
        );
    }

    if (replyGeoButtonPath) {
        const nextPath = hasLocation
            ? replyGeoButtonPath.dataset.pathActive
            : replyGeoButtonPath.dataset.pathInactive;

        if (nextPath) {
            replyGeoButtonPath.setAttribute("d", nextPath);
        }
    }

    if (replyLocationDeleteButton) {
        replyLocationDeleteButton.hidden = !hasLocation;
    }

    if (replyLocationCompleteButton) {
        replyLocationCompleteButton.disabled = !pendingLocation;
    }
}

function renderLocationList() {
    if (!replyLocationList) {
        return;
    }

    const locations = getFilteredLocations();

    if (locations.length === 0) {
        replyLocationList.innerHTML =
            '<p class="tweet-modal__location-empty">일치하는 위치를 찾지 못했습니다.</p>';
        return;
    }

    replyLocationList.innerHTML = locations
        .map((location) => {
            const isSelected = pendingLocation === location;

            return `
                <button type="button" class="tweet-modal__location-item" role="menuitem" data-location-value="${location}">
                    <span class="tweet-modal__location-item-label">${location}</span>
                    <span class="tweet-modal__location-item-check">
                        ${
                            isSelected
                                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>'
                                : ""
                        }
                    </span>
                </button>
            `;
        })
        .join("");
}

// 위치 태그 화면은 초안 화면처럼 같은 모달 내부 뷰 전환으로 처리한다.
function openLocationPanel() {
    if (!composeView || !replyLocationView) {
        return;
    }

    closeEmojiPicker();
    pendingLocation = selectedLocation;
    composeView.hidden = true;
    replyLocationView.hidden = false;

    if (replyLocationSearchInput) {
        replyLocationSearchInput.value = "";
    }

    renderLocationList();
    syncLocationUI();

    window.requestAnimationFrame(() => {
        replyLocationSearchInput?.focus();
    });
}

function closeLocationPanel({ restoreFocus = true } = {}) {
    if (!composeView || !replyLocationView || replyLocationView.hidden) {
        return;
    }

    replyLocationView.hidden = true;
    composeView.hidden = false;

    if (replyLocationSearchInput) {
        replyLocationSearchInput.value = "";
    }

    pendingLocation = selectedLocation;
    renderLocationList();
    syncLocationUI();

    if (restoreFocus) {
        window.requestAnimationFrame(() => {
            replyEditor?.focus();
        });
    }
}

function applyLocation(location) {
    selectedLocation = location;
    pendingLocation = location;
    syncLocationUI();
}

function resetLocationState() {
    selectedLocation = null;
    pendingLocation = null;

    if (replyLocationSearchInput) {
        replyLocationSearchInput.value = "";
    }

    renderLocationList();
    syncLocationUI();
}

function hasReplyAttachment() {
    return attachedReplyFiles.length > 0;
}

function clearAttachedReplyFileUrls() {
    if (attachedReplyFileUrls.length === 0) {
        return;
    }

    attachedReplyFileUrls.forEach((fileUrl) => URL.revokeObjectURL(fileUrl));
    attachedReplyFileUrls = [];
}

function isReplyImageSet() {
    return (
        attachedReplyFiles.length > 0 &&
        attachedReplyFiles.every((file) => file.type.startsWith("image/"))
    );
}

function isReplyVideoSet() {
    return (
        attachedReplyFiles.length === 1 &&
        attachedReplyFiles[0].type.startsWith("video/")
    );
}

function resetReplyAttachment() {
    clearAttachedReplyFileUrls();
    attachedReplyFiles = [];
    pendingAttachmentEditIndex = null;

    if (replyFileInput) {
        replyFileInput.value = "";
    }

    if (replyAttachmentMedia) {
        replyAttachmentMedia.innerHTML = "";
    }

    if (replyAttachmentPreview) {
        replyAttachmentPreview.hidden = true;
    }
}

function createReplyAttachmentUrls() {
    clearAttachedReplyFileUrls();
    attachedReplyFileUrls = attachedReplyFiles.map((file) => URL.createObjectURL(file));
}

function getReplyImageCell(index, imageUrl, cellClass) {
    return `
        <div class="media-cell ${cellClass}">
            <div class="media-cell-inner">
                <div class="media-img-container" aria-label="미디어" role="group">
                    <div class="media-bg" style="background-image: url('${imageUrl}');"></div>
                    <img alt="" draggable="false" src="${imageUrl}" class="media-img">
                </div>
                <div class="media-btn-row">
                    <button type="button" class="media-btn" data-attachment-edit-index="${index}">
                        <span>수정</span>
                    </button>
                </div>
                <button type="button" class="media-btn-delete" aria-label="미디어 삭제하기" data-attachment-remove-index="${index}">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function renderReplyImageGrid() {
    const imageCount = attachedReplyFiles.length;
    const imageUrls = attachedReplyFileUrls;

    if (!replyAttachmentMedia || imageCount === 0) {
        return;
    }

    if (imageCount === 1) {
        replyAttachmentMedia.innerHTML = `
            <div class="media-aspect-ratio media-aspect-ratio--single"></div>
            <div class="media-absolute-layer">
                ${getReplyImageCell(0, imageUrls[0], "media-cell--single")}
            </div>
        `;
        return;
    }

    if (imageCount === 2) {
        replyAttachmentMedia.innerHTML = `
            <div class="media-aspect-ratio"></div>
            <div class="media-absolute-layer">
                <div class="media-row">
                    <div class="media-col">
                        ${getReplyImageCell(0, imageUrls[0], "media-cell--left")}
                    </div>
                    <div class="media-col">
                        ${getReplyImageCell(1, imageUrls[1], "media-cell--right")}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    if (imageCount === 3) {
        replyAttachmentMedia.innerHTML = `
            <div class="media-aspect-ratio"></div>
            <div class="media-absolute-layer">
                <div class="media-row">
                    <div class="media-col">
                        ${getReplyImageCell(0, imageUrls[0], "media-cell--left-tall")}
                    </div>
                    <div class="media-col">
                        ${getReplyImageCell(1, imageUrls[1], "media-cell--right-top")}
                        ${getReplyImageCell(2, imageUrls[2], "media-cell--right-bottom")}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    replyAttachmentMedia.innerHTML = `
        <div class="media-aspect-ratio"></div>
        <div class="media-absolute-layer">
            <div class="media-row">
                <div class="media-col">
                    ${getReplyImageCell(0, imageUrls[0], "media-cell--top-left")}
                    ${getReplyImageCell(2, imageUrls[2], "media-cell--bottom-left")}
                </div>
                <div class="media-col">
                    ${getReplyImageCell(1, imageUrls[1], "media-cell--top-right")}
                    ${getReplyImageCell(3, imageUrls[3], "media-cell--bottom-right")}
                </div>
            </div>
        </div>
    `;
}

function renderReplyVideoAttachment() {
    if (!replyAttachmentMedia || attachedReplyFiles.length === 0) {
        return;
    }

    const [file] = attachedReplyFiles;
    const [fileUrl] = attachedReplyFileUrls;

    replyAttachmentMedia.innerHTML = `
        <div class="media-aspect-ratio media-aspect-ratio--single"></div>
        <div class="media-absolute-layer">
            <div class="media-cell media-cell--single">
                <div class="media-cell-inner">
                    <div class="media-img-container" aria-label="미디어" role="group">
                        <video class="tweet-modal__attachment-video" controls preload="metadata">
                            <source src="${fileUrl}" type="${file.type}">
                        </video>
                    </div>
                    <div class="media-btn-row">
                        <button type="button" class="media-btn" data-attachment-edit-index="0">
                            <span>수정</span>
                        </button>
                    </div>
                    <button type="button" class="media-btn-delete" aria-label="미디어 삭제하기" data-attachment-remove-index="0">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderReplyAttachment() {
    if (!replyAttachmentPreview || !replyAttachmentMedia) {
        return;
    }

    if (attachedReplyFiles.length === 0) {
        replyAttachmentMedia.innerHTML = "";
        replyAttachmentPreview.hidden = true;
        return;
    }

    replyAttachmentPreview.hidden = false;
    createReplyAttachmentUrls();

    if (isReplyImageSet()) {
        renderReplyImageGrid();
        return;
    }

    if (isReplyVideoSet()) {
        renderReplyVideoAttachment();
        return;
    }

    replyAttachmentMedia.innerHTML = "";
    const filePreview = document.createElement("div");
    const fileIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const fileGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const filePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const fileName = document.createElement("span");

    filePreview.className = "tweet-modal__attachment-file";
    fileIcon.setAttribute("viewBox", "0 0 24 24");
    fileIcon.setAttribute("width", "22");
    fileIcon.setAttribute("height", "22");
    fileIcon.setAttribute("aria-hidden", "true");
    filePath.setAttribute(
        "d",
        "M14 2H7.75C5.68 2 4 3.68 4 5.75v12.5C4 20.32 5.68 22 7.75 22h8.5C18.32 22 20 20.32 20 18.25V8l-6-6zm0 2.12L17.88 8H14V4.12zm2.25 15.88h-8.5c-.97 0-1.75-.78-1.75-1.75V5.75C6 4.78 6.78 4 7.75 4H12v5.25c0 .41.34.75.75.75H18v8.25c0 .97-.78 1.75-1.75 1.75z",
    );
    fileName.className = "tweet-modal__attachment-file-name";
    fileName.textContent = attachedReplyFiles[0]?.name ?? "";

    fileGroup.appendChild(filePath);
    fileIcon.appendChild(fileGroup);
    filePreview.appendChild(fileIcon);
    filePreview.appendChild(fileName);
    replyAttachmentMedia.appendChild(filePreview);
}

function removeReplyAttachment(index) {
    attachedReplyFiles = attachedReplyFiles.filter((_, fileIndex) => fileIndex !== index);
    pendingAttachmentEditIndex = null;
    renderReplyAttachment();
}

function handleReplyFileChange(event) {
    const nextFiles = Array.from(event.target.files ?? []);

    if (nextFiles.length === 0) {
        pendingAttachmentEditIndex = null;
        syncReplySubmitState();
        return;
    }

    const replacementFile = nextFiles[0];
    const pickedVideo = nextFiles.find((file) => file.type.startsWith("video/"));
    const pickedImages = nextFiles.filter((file) => file.type.startsWith("image/"));

    if (pendingAttachmentEditIndex !== null) {
        if (!replacementFile) {
            pendingAttachmentEditIndex = null;
            return;
        }

        if (replacementFile.type.startsWith("video/")) {
            attachedReplyFiles = [replacementFile];
        } else {
            const editableFiles = isReplyVideoSet() ? [] : [...attachedReplyFiles];

            if (editableFiles.length === 0) {
                attachedReplyFiles = [replacementFile];
            } else {
                editableFiles[pendingAttachmentEditIndex] = replacementFile;
                attachedReplyFiles = editableFiles.slice(0, maxReplyImages);
            }
        }

        pendingAttachmentEditIndex = null;
        renderReplyAttachment();
        syncReplySubmitState();
        return;
    }

    if (pickedVideo) {
        attachedReplyFiles = [pickedVideo];
        renderReplyAttachment();
        syncReplySubmitState();
        return;
    }

    if (pickedImages.length > 0) {
        const baseImages = isReplyImageSet() ? [...attachedReplyFiles] : [];
        attachedReplyFiles = [...baseImages, ...pickedImages].slice(0, maxReplyImages);
        renderReplyAttachment();
        syncReplySubmitState();
        return;
    }

    attachedReplyFiles = [replacementFile];
    renderReplyAttachment();
    syncReplySubmitState();
}

// contenteditable 내부에 실제 입력된 텍스트가 있는지 검사한다.
function hasReplyEditorText() {
    if (!replyEditor) {
        return false;
    }

    return replyEditor.textContent.replace(/\u00a0/g, " ").trim().length > 0;
}

function togglePendingReplyFormat(format) {
    if (pendingReplyFormats.has(format)) {
        pendingReplyFormats.delete(format);
    } else {
        pendingReplyFormats.add(format);
    }
}

function applyPendingReplyFormatsToContent() {
    if (!replyEditor || pendingReplyFormats.size === 0 || !hasReplyEditorText()) {
        return;
    }

    let span = null;

    if (
        replyEditor.childNodes.length === 1 &&
        replyEditor.firstElementChild &&
        replyEditor.firstElementChild.tagName === "SPAN"
    ) {
        span = replyEditor.firstElementChild;
    } else {
        span = document.createElement("span");

        while (replyEditor.firstChild) {
            span.appendChild(replyEditor.firstChild);
        }

        replyEditor.appendChild(span);
    }

    span.style.fontWeight = pendingReplyFormats.has("bold") ? "bold" : "";
    span.style.fontStyle = pendingReplyFormats.has("italic") ? "italic" : "";

    const range = document.createRange();
    range.selectNodeContents(span);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    saveReplySelection();
}

function saveReplySelection() {
    if (!replyEditor) {
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (replyEditor.contains(range.commonAncestorContainer)) {
        savedReplySelection = range.cloneRange();
    }
}

function restoreReplySelection() {
    if (!replyEditor || !savedReplySelection) {
        return false;
    }

    const selection = window.getSelection();

    if (!selection) {
        return false;
    }

    selection.removeAllRanges();
    selection.addRange(savedReplySelection);
    return true;
}

function applyReplyFormat(format) {
    if (!replyEditor) {
        return;
    }

    replyEditor.focus();

    if (!hasReplyEditorText()) {
        togglePendingReplyFormat(format);
        syncReplyFormatButtons();
        return;
    }

    if (!restoreReplySelection()) {
        const range = document.createRange();
        range.selectNodeContents(replyEditor);
        range.collapse(false);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    document.execCommand(format, false);
    saveReplySelection();
    syncReplySubmitState();
    syncReplyFormatButtons();
}

function syncReplyFormatButtons() {
    if (!replyEditor) {
        return;
    }

    replyFormatButtons.forEach((button) => {
        const format = button.getAttribute("data-format");

        if (!format) {
            return;
        }

        const isActive = hasReplyEditorText()
            ? document.queryCommandState(format)
            : pendingReplyFormats.has(format);
        const labels = formatButtonLabels[format];

        button.classList.toggle("tweet-modal__tool-btn--active", isActive);

        if (labels) {
            button.setAttribute("aria-label", isActive ? labels.active : labels.inactive);
        }
    });
}

function closeEmojiPicker() {
    if (!replyEmojiPicker || !replyEmojiButton) {
        return;
    }

    replyEmojiPicker.hidden = true;
    replyEmojiButton.setAttribute("aria-expanded", "false");
}

function updateEmojiPickerPosition() {
    if (!replyEmojiPicker || !replyEmojiButton) {
        return;
    }

    const rect = replyEmojiButton.getBoundingClientRect();
    const pickerWidth = Math.min(565, window.innerWidth - 32);
    const maxLeft = Math.max(16, window.innerWidth - pickerWidth - 16);
    const left = Math.min(Math.max(16, rect.left), maxLeft);
    const top = Math.min(rect.bottom + 8, window.innerHeight - 24);
    const maxHeight = Math.max(220, window.innerHeight - top - 16);

    replyEmojiPicker.style.left = `${left}px`;
    replyEmojiPicker.style.top = `${top}px`;
    replyEmojiPicker.style.maxHeight = `${maxHeight}px`;
}

function openEmojiPicker() {
    if (!replyEmojiPicker || !replyEmojiButton) {
        return;
    }

    renderEmojiPicker();
    replyEmojiPicker.hidden = false;
    replyEmojiButton.setAttribute("aria-expanded", "true");
    updateEmojiPickerPosition();
    parseTwemoji(replyEmojiPicker);
}

function toggleEmojiPicker() {
    if (!replyEmojiPicker) {
        return;
    }

    if (replyEmojiPicker.hidden) {
        openEmojiPicker();
    } else {
        closeEmojiPicker();
    }
}

function insertReplyEmoji(emoji) {
    if (!replyEditor) {
        return;
    }

    replyEditor.focus();

    if (!restoreReplySelection()) {
        const range = document.createRange();
        range.selectNodeContents(replyEditor);
        range.collapse(false);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    if (!document.execCommand("insertText", false, emoji)) {
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    applyPendingReplyFormatsToContent();
    saveRecentEmoji(emoji);
    saveReplySelection();
    syncReplySubmitState();
    syncReplyFormatButtons();
    renderEmojiPicker();
}

function setActiveTab(tabName) {
    tabLinks.forEach((link) => {
        const path = link.querySelector("path");

        if (!path) {
            return;
        }

        const isActive = link.dataset.tab === tabName;

        path.setAttribute("d", isActive ? path.dataset.active : path.dataset.inactive);
        link.classList.toggle("tab-link--active", isActive);
    });
}

function syncReplySubmitState() {
    if (!replyEditor || !replySubmitButton || !replyProgressBar || !replyProgress) {
        return;
    }

    const text = replyEditor.textContent.replace(/\u00a0/g, " ").trim();
    const hasText = text.length > 0;
    const canSubmit = hasText || hasReplyAttachment();
    const progressValue = Math.min((text.length / 280) * 100, 100);

    replySubmitButton.disabled = !canSubmit;
    replyProgressBar.style.width = `${progressValue}%`;
    replyProgress.setAttribute("aria-valuenow", String(Math.round(progressValue)));
}

function getReplyContextText(tweetItem) {
    const replyTo = tweetItem?.querySelector(".tweet-reply-to");

    return getTextContent(replyTo) || "답글을 보낼 게시물을 찾지 못했습니다.";
}

function populateReplyModal(button) {
    const tweetItem = button.closest(".notif-tweet-item");

    if (!tweetItem) {
        return;
    }

    if (replyContextButton) {
        replyContextButton.textContent = getReplyContextText(tweetItem);
    }

    if (replySourceAvatar) {
        replySourceAvatar.src =
            tweetItem.querySelector(".tweet-avatar")?.getAttribute("src") ?? replySourceAvatar.src;
    }

    if (replySourceName) {
        replySourceName.textContent = getTextContent(tweetItem.querySelector(".tweet-displayname"));
    }

    if (replySourceHandle) {
        replySourceHandle.textContent = getTextContent(tweetItem.querySelector(".tweet-handle"));
    }

    if (replySourceTime) {
        replySourceTime.textContent = getTextContent(tweetItem.querySelector(".tweet-time"));
    }

    if (replySourceText) {
        replySourceText.textContent = getTextContent(tweetItem.querySelector(".tweet-text"));
    }
}

// 답글 모달을 열 때마다 입력 상태와 선택 상태를 초기화한다.
function openReplyModal(button) {
    if (!replyModalOverlay || !replyEditor) {
        return;
    }

    activeReplyTrigger = button;
    document.body.classList.add("modal-open");
    replyModalOverlay.hidden = false;
    populateReplyModal(button);

    // 서버/주소 연동 로직은 비활성화하고 이벤트 기반 UI 토글만 사용한다.
    // modalOriginUrl = location.href;
    // history.pushState({ modal: "compose" }, "", "/compose/post");
    closeEmojiPicker();

    replyEditor.textContent = "";
    savedReplySelection = null;
    pendingReplyFormats = new Set();
    activeEmojiCategory = "recent";
    selectedLocation = null;
    pendingLocation = null;
    resetReplyAttachment();
    if (replyEmojiSearchInput) {
        replyEmojiSearchInput.value = "";
    }
    if (replyLocationSearchInput) {
        replyLocationSearchInput.value = "";
    }
    if (composeView) {
        composeView.hidden = false;
    }
    if (replyLocationView) {
        replyLocationView.hidden = true;
    }
    renderLocationList();
    syncLocationUI();
    syncReplySubmitState();
    syncReplyFormatButtons();

    window.requestAnimationFrame(() => {
        replyEditor.focus();
    });
}

function canCloseReplyModal() {
    if (!replyEditor) {
        return !hasReplyAttachment() || window.confirm("게시물을 삭제하시겠어요?");
    }

    const hasDraft = replyEditor.textContent.replace(/\u00a0/g, " ").trim().length > 0;

    return (!hasDraft && !hasReplyAttachment()) || window.confirm("게시물을 삭제하시겠어요?");
}

function closeReplyModal(options = {}) {
    const { skipConfirm = false, restoreFocus = true } = options;

    if (!replyModalOverlay || replyModalOverlay.hidden) {
        return;
    }

    if (!skipConfirm && !canCloseReplyModal()) {
        return;
    }

    replyModalOverlay.hidden = true;
    document.body.classList.remove("modal-open");
    closeEmojiPicker();
    closeLocationPanel({ restoreFocus: false });

    if (replyEditor) {
        replyEditor.textContent = "";
    }

    savedReplySelection = null;
    pendingReplyFormats = new Set();
    selectedLocation = null;
    pendingLocation = null;
    resetReplyAttachment();
    renderLocationList();
    syncLocationUI();
    syncReplySubmitState();
    syncReplyFormatButtons();
    if (restoreFocus) {
        activeReplyTrigger?.focus();
    }
    activeReplyTrigger = null;
}

// 모달 내부에서만 Tab 이동이 돌도록 포커스를 가둔다.
function trapFocus(event) {
    if (!replyModal || event.key !== "Tab") {
        return;
    }

    const focusableElements = Array.from(
        replyModal.querySelectorAll(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((element) => !element.hasAttribute("hidden"));

    if (focusableElements.length === 0) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

// 답글 제출은 서버 전송 대신 화면의 답글 수만 증가시키는 데모 로직이다.
function updateReplyCount(button) {
    const countElement = button.querySelector(".tweet-action-count");

    if (!countElement) {
        return;
    }

    const currentCount = Number.parseInt(countElement.textContent || "0", 10) || 0;
    const nextCount = currentCount + 1;

    countElement.textContent = String(nextCount);
    button.setAttribute("aria-label", `${nextCount} 답글`);
}

// 공유 메뉴는 버튼 좌표를 기준으로 임시 DOM을 만들어서 표시한다.
function closeShareDropdown() {
    if (!activeShareDropdown) {
        return;
    }

    activeShareDropdown.remove();
    activeShareDropdown = null;

    if (activeShareButton) {
        activeShareButton.setAttribute("aria-expanded", "false");
        activeShareButton = null;
    }
}

function openShareDropdown(button) {
    closeShareDropdown();

    const dropdown = document.createElement("div");
    const rect = button.getBoundingClientRect();
    const dropdownWidth = 220;
    const top = rect.bottom + window.scrollY + 8;
    const left = Math.min(
        window.scrollX + window.innerWidth - dropdownWidth - 16,
        Math.max(16, rect.right + window.scrollX - dropdownWidth),
    );

    dropdown.className = "tweet-dropdown";
    dropdown.setAttribute("role", "menu");
    dropdown.innerHTML = `
        <button type="button" class="tweet-dropdown__item" role="menuitem">
            <svg class="tweet-dropdown__icon" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>
            링크 복사하기
        </button>
        <button type="button" class="tweet-dropdown__item" role="menuitem">
            <svg class="tweet-dropdown__icon" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
            게시물 공유하기
        </button>
        <button type="button" class="tweet-dropdown__item" role="menuitem">
            <svg class="tweet-dropdown__icon" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg>
            Chat으로 전송하기
        </button>
        <button type="button" class="tweet-dropdown__item" role="menuitem">
            <svg class="tweet-dropdown__icon" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 3V0h2v3h3v2h-3v3h-2V5h-3V3zm-7.5 1H2v18h18v-8.5h-2V20H4V6h6.5V4zM8 14h8v2H8v-2zm0-4h8v2H8v-2z"></path></g></svg>
            폴더에 북마크 추가하기
        </button>
    `;

    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;

    dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
        closeShareDropdown();
    });

    document.body.appendChild(dropdown);

    activeShareDropdown = dropdown;
    activeShareButton = button;
    activeShareButton.setAttribute("aria-expanded", "true");
}

function getNotificationDropdownItems(button) {
    const tweetItem = button.closest(".notif-tweet-item");
    const handle = getTextContent(tweetItem?.querySelector(".tweet-handle")) || "@sokkomann";
    const handleId = handle.replace("@", "") || "sokkomann";

    return [
        {
            label: `이 커뮤니티에서 ${handleId} 님의 게시물 찾기`,
            href: `/i/communities/2029485144793395219/search/?q=(from%3A${handleId})`,
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05S18 12.93 18 11c0-3.87-3.13-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.41 1.42-3.68-3.68C15.08 19.26 13.13 20 11 20c-4.97 0-9-4.03-9-9zm11.5-2.5c0 1.38-1.12 2.5-2.5 2.5S8.5 9.88 8.5 8.5 9.62 6 11 6s2.5 1.12 2.5 2.5zm-6.76 5.97C7.58 12.89 9.07 12 11 12s3.42.89 4.26 2.47c-1 1.24-2.54 2.03-4.26 2.03s-3.26-.79-4.26-2.03z"></path></g></svg>',
        },
        {
            label: "게시물 숨기기",
            href: `/i/report/hide_community_tweet/2029785009826189583`,
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path></g></svg>',
        },
        {
            label: "커뮤니티에서 작성자 차단",
            href: `/i/report/remove_community_member/2029093121464930304?community_id=2029485144793395219`,
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zm8.84 0l-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29z"></path></g></svg>',
        },
        {
            label: `${handle} 님 언팔로우하기`,
            href: "",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z"></path></g></svg>',
        },
        {
            label: "리스트에서 추가/제거하기",
            href: "/i/lists/add_member",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path></g></svg>',
        },
        {
            label: "뮤트",
            href: "",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g></svg>',
        },
        {
            label: "이 대화 뮤트하기",
            href: "",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g></svg>',
        },
        {
            label: "이 대화에서 나가기",
            href: "",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M21.503 6.745c.475 1.032.748 2.176.748 3.385 0 2.955-1.608 5.68-4.196 7.11l-8.054 4.459v-3.452l2-2v2.06l5.086-2.816c1.952-1.079 3.164-3.133 3.164-5.36 0-.644-.101-1.264-.286-1.847l1.538-1.538zM3.71 21.71l-1.414-1.414 3.401-3.401C3.34 15.5 1.751 12.935 1.751 10c0-4.411 3.591-8 8.005-8h4.366c1.818 0 3.494.608 4.849 1.62l1.325-1.325 1.414 1.414-18 18.001zm3.462-6.29L17.545 5.047C16.567 4.386 15.389 4 14.123 4H9.757c-3.311 0-6.005 2.691-6.005 6 0 2.389 1.401 4.451 3.421 5.42z"></path></g></svg>',
        },
        {
            label: `${handle} 님 차단하기`,
            href: "",
            testid: "block",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>',
        },
        {
            label: "활동 게시물개 보기",
            href: `/${handleId}/status/2029785009826189583/quotes`,
            testid: "tweetEngagements",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M4 19h16v2H4v-2zm1-2V8h3v9H5zm5 0V3h3v14h-3zm5 0v-6h3v6h-3z"></path></g></svg>',
        },
        {
            label: "게시물 담기",
            href: "",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M15.24 4.31l-4.55 15.93-1.93-.55 4.55-15.93 1.93.55zm-8.33 3.6L3.33 12l3.58 4.09-1.5 1.32L.67 12l4.74-5.41 1.5 1.32zm11.68-1.32L23.33 12l-4.74 5.41-1.5-1.32L20.67 12l-3.58-4.09 1.5-1.32z"></path></g></svg>',
        },
        {
            label: "게시물 신고하기",
            href: "",
            testid: "report",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path></g></svg>',
        },
        {
            label: "그룹 노트 요청하기",
            href: "/i/communitynotes/noterequest/2029785009826189583",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M22 2.63v17.74l-7.05-2.27c-.29 1.65-1.72 2.9-3.45 2.9C9.57 21 8 19.43 8 17.5v-1.63l-1.15-.37H4.5C3.12 15.5 2 14.38 2 13v-3c0-1.38 1.12-2.5 2.5-2.5h2.35L22 2.63zM6 9.5H4.5c-.27 0-.5.22-.5.5v3c0 .28.23.5.5.5H6v-4zm2 4.27l12 3.86V5.37L8 9.23v4.54zm2 2.74v.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.02l-3-.97z"></path></g></svg>',
        },
    ];
}

function closeNotificationDropdown() {
    if (!activeMoreDropdown) {
        return;
    }

    activeMoreDropdown.remove();
    activeMoreDropdown = null;

    if (activeMoreButton) {
        activeMoreButton.setAttribute("aria-expanded", "false");
        activeMoreButton = null;
    }
}

function openNotificationDropdown(button) {
    if (!layersRoot) {
        return;
    }

    closeShareDropdown();
    closeNotificationDropdown();

    const rect = button.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const items = getNotificationDropdownItems(button);
    const right = Math.max(16, window.innerWidth - rect.right);
    const layerContainer = document.createElement("div");

    layerContainer.className = "layers-dropdown-container";
    layerContainer.innerHTML = `
        <div class="layers-overlay"></div>
        <div class="layers-dropdown-inner">
            <div role="menu" class="dropdown-menu" style="top: ${top}px; right: ${right}px;">
                <div>
                    <div class="dropdown-inner" data-testid="Dropdown">
                        ${items
                            .map((item) => {
                                const tagName = item.href ? "a" : "div";
                                const hrefAttr = item.href ? ` href="${item.href}"` : "";
                                const tabindexAttr = item.href ? "" : ' tabindex="0"';
                                const testidAttr = item.testid ? ` data-testid="${item.testid}"` : "";

                                return `
                                    <${tagName}${hrefAttr} role="menuitem"${tabindexAttr} class="menu-item"${testidAttr}>
                                        <div class="menu-item__icon">${item.icon}</div>
                                        <div class="menu-item__text">
                                            <div dir="ltr" class="menu-item__text-inner">
                                                <span>${item.label}</span>
                                            </div>
                                        </div>
                                    </${tagName}>
                                `;
                            })
                            .join("")}
                    </div>
                </div>
            </div>
        </div>
    `;

    layerContainer.addEventListener("click", (event) => {
        const item = event.target.closest(".menu-item");

        if (item) {
            event.preventDefault();
            event.stopPropagation();
            closeNotificationDropdown();
            return;
        }

        event.stopPropagation();
    });

    layersRoot.appendChild(layerContainer);
    activeMoreDropdown = layerContainer;
    activeMoreButton = button;
    activeMoreButton.setAttribute("aria-expanded", "true");
}

// 초기 렌더링: 위치/탭 상태를 한 번 맞춰 둔다.
renderLocationList();
syncLocationUI();
setActiveTab("notifications");

// 하단 탭 아이콘 상태 변경
tabLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveTab(link.dataset.tab);
    });
});

// 모바일 하단 바는 스크롤 방향에 따라 숨김/표시만 제어한다.
window.addEventListener(
    "scroll",
    () => {
        if (!bottombarSlide) {
            return;
        }

        const currentY = window.scrollY;

        bottombarSlide.style.transform =
            currentY > lastScrollY && currentY > 100 ? "translateY(100%)" : "translateY(0)";

        lastScrollY = currentY;
    },
    { passive: true },
);

// 알림 탭(전체 / 멘션 등) 활성 상태 전환
notifTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
        event.preventDefault();

        notifTabs.forEach((currentTab) => {
            currentTab.classList.remove("notif-tab--active");
            currentTab.setAttribute("aria-selected", "false");
        });

        tab.classList.add("notif-tab--active");
        tab.setAttribute("aria-selected", "true");
    });
});

// 트윗 액션 버튼은 서버 요청 없이 아이콘/개수만 즉시 반영한다.
document.querySelectorAll(".tweet-action-btn--like").forEach((button) => {
    const path = button.querySelector("path");
    const count = button.querySelector(".tweet-action-count");

    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isActive = button.classList.toggle("active");

        if (!path || !count) {
            return;
        }

        button.setAttribute("data-testid", isActive ? "unlike" : "like");
        button.setAttribute("aria-label", isActive ? "1 마음에 들어요" : "0 마음에 들어요");
        path.setAttribute("d", isActive ? path.dataset.pathActive : path.dataset.pathInactive);
        count.textContent = isActive ? "1" : "";
    });
});

document.querySelectorAll(".tweet-action-btn--bookmark").forEach((button) => {
    const path = button.querySelector("path");

    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isActive = button.classList.toggle("active");

        if (!path) {
            return;
        }

        button.setAttribute("data-testid", isActive ? "removeBookmark" : "bookmark");
        button.setAttribute("aria-label", isActive ? "북마크에 추가됨" : "북마크");
        path.setAttribute("d", isActive ? path.dataset.pathActive : path.dataset.pathInactive);
    });
});

document.querySelectorAll("[data-testid='reply']").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeShareDropdown();
        closeNotificationDropdown();
        openReplyModal(button);
    });
});

document.querySelectorAll("[data-testid='caret']").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (activeMoreButton === button) {
            closeNotificationDropdown();
            return;
        }

        openNotificationDropdown(button);
    });
});

document.querySelectorAll(".tweet-action-btn--share").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeNotificationDropdown();

        if (activeShareButton === button) {
            closeShareDropdown();
            return;
        }

        openShareDropdown(button);
    });
});

// 답글 모달 닫기, 포커스, 서식 버튼 이벤트
replyCloseButton?.addEventListener("click", closeReplyModal);

replyModalOverlay?.addEventListener("click", (event) => {
    if (event.target === replyModalOverlay) {
        closeReplyModal();
    }
});

replyModalOverlay?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        if (isLocationModalOpen()) {
            closeLocationPanel();
            return;
        }

        closeReplyModal();
        return;
    }

    trapFocus(event);
});

replyEditor?.addEventListener("input", () => {
    applyPendingReplyFormatsToContent();

    if (!hasReplyEditorText()) {
        pendingReplyFormats = new Set();
    }

    syncReplySubmitState();
    syncReplyFormatButtons();
});
replyEditor?.addEventListener("keyup", saveReplySelection);
replyEditor?.addEventListener("keyup", syncReplyFormatButtons);
replyEditor?.addEventListener("mouseup", saveReplySelection);
replyEditor?.addEventListener("mouseup", syncReplyFormatButtons);
replyEditor?.addEventListener("focus", saveReplySelection);
replyEditor?.addEventListener("focus", syncReplyFormatButtons);
replyEditor?.addEventListener("click", syncReplyFormatButtons);
replyEditor?.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) {
        return;
    }

    const key = event.key.toLowerCase();

    if (key !== "b" && key !== "i") {
        return;
    }

    event.preventDefault();
    applyReplyFormat(key === "b" ? "bold" : "italic");
});

replyMediaUploadButton?.addEventListener("click", (event) => {
    event.preventDefault();
    pendingAttachmentEditIndex = null;
    if (replyFileInput) {
        replyFileInput.value = "";
    }
    replyFileInput?.click();
});

replyFileInput?.addEventListener("change", handleReplyFileChange);
replyAttachmentMedia?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-attachment-remove-index]");

    if (removeButton) {
        const removeIndex = Number.parseInt(
            removeButton.getAttribute("data-attachment-remove-index") ?? "-1",
            10,
        );

        if (removeIndex >= 0) {
            removeReplyAttachment(removeIndex);
        }

        syncReplySubmitState();
        return;
    }

    const editButton = event.target.closest("[data-attachment-edit-index]");

    if (editButton) {
        pendingAttachmentEditIndex = Number.parseInt(
            editButton.getAttribute("data-attachment-edit-index") ?? "-1",
            10,
        );

        if (replyFileInput) {
            replyFileInput.value = "";
        }

        replyFileInput?.click();
    }
});

document.addEventListener("selectionchange", () => {
    if (replyModalOverlay?.hidden || !replyEditor) {
        return;
    }

    saveReplySelection();
    syncReplyFormatButtons();
});

replyFormatButtons.forEach((button) => {
    button.addEventListener("mousedown", (event) => {
        event.preventDefault();
    });

    button.addEventListener("click", (event) => {
        event.preventDefault();
        const format = button.getAttribute("data-format");

        if (!format) {
            return;
        }

        applyReplyFormat(format);
        syncReplyFormatButtons();
    });
});

// 이모지/위치 선택기 열기
replyEmojiButton?.addEventListener("mousedown", (event) => {
    event.preventDefault();
});

replyEmojiButton?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleEmojiPicker();
});

replyGeoButton?.addEventListener("click", (event) => {
    event.preventDefault();
    openLocationPanel();
});

replyLocationDisplayButton?.addEventListener("click", (event) => {
    event.preventDefault();
    openLocationPanel();
});

replyEmojiPicker?.addEventListener("click", (event) => {
    event.stopPropagation();
});

replyEmojiSearchInput?.addEventListener("input", () => {
    renderEmojiPickerContent();
});

replyLocationSearchInput?.addEventListener("input", () => {
    renderLocationList();
});

replyEmojiTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const category = tab.getAttribute("data-emoji-category");

        if (!category) {
            return;
        }

        activeEmojiCategory = category;
        renderEmojiPicker();
    });
});

replyEmojiContent?.addEventListener("mousedown", (event) => {
    const target = event.target.closest(".tweet-modal__emoji-option, .tweet-modal__emoji-clear");

    if (target) {
        event.preventDefault();
    }
});

replyEmojiContent?.addEventListener("click", (event) => {
    const clearButton = event.target.closest("[data-action='clear-recent']");

    if (clearButton) {
        clearRecentEmojis();
        activeEmojiCategory = "recent";
        renderEmojiPicker();
        return;
    }

    const emojiButton = event.target.closest(".tweet-modal__emoji-option");

    if (!emojiButton) {
        return;
    }

    const emoji = emojiButton.getAttribute("data-emoji");

    if (!emoji) {
        return;
    }

    insertReplyEmoji(emoji);
    closeEmojiPicker();
});

replyLocationCloseButton?.addEventListener("click", () => {
    closeLocationPanel();
});

replyLocationDeleteButton?.addEventListener("click", () => {
    resetLocationState();
    closeLocationPanel();
});

replyLocationCompleteButton?.addEventListener("click", () => {
    if (!pendingLocation) {
        return;
    }

    applyLocation(pendingLocation);
    closeLocationPanel();
});

replyLocationList?.addEventListener("click", (event) => {
    const locationButton = event.target.closest("[data-location-value]");

    if (!locationButton) {
        return;
    }

    const location = locationButton.getAttribute("data-location-value");

    if (!location) {
        return;
    }

    applyLocation(location);
    closeLocationPanel();
});

// 답글 제출은 데모용으로 count만 갱신하고 모달을 닫는다.
replySubmitButton?.addEventListener("click", () => {
    if (!activeReplyTrigger || replySubmitButton.disabled) {
        return;
    }

    updateReplyCount(activeReplyTrigger);
    closeReplyModal({ skipConfirm: true });
});

// 바깥 클릭과 ESC는 임시 레이어를 닫는 공통 규칙으로 사용한다.
document.addEventListener("click", (event) => {
    if (
        replyEmojiPicker &&
        !replyEmojiPicker.hidden &&
        !replyEmojiPicker.contains(event.target) &&
        !replyEmojiButton?.contains(event.target)
    ) {
        closeEmojiPicker();
    }

    if (activeShareDropdown && !activeShareDropdown.contains(event.target)) {
        closeShareDropdown();
    }

    if (activeMoreDropdown && !activeMoreDropdown.contains(event.target) && !activeMoreButton?.contains(event.target)) {
        closeNotificationDropdown();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeShareDropdown();
        closeNotificationDropdown();
    }
});

window.addEventListener(
    "resize",
    () => {
        if (replyEmojiPicker && !replyEmojiPicker.hidden) {
            updateEmojiPickerPosition();
        }
    },
    { passive: true },
);

window.addEventListener(
    "scroll",
    () => {
        if (replyEmojiPicker && !replyEmojiPicker.hidden) {
            updateEmojiPickerPosition();
        }
    },
    { passive: true },
);

// 초안 패널 요소
const draftBtn = replyModalOverlay?.querySelector("[data-testid='unsentButton']");

// 초안 뷰 / 작성 뷰 (같은 .tweet-modal 안에서 hidden 토글)
const draftView = replyModalOverlay?.querySelector(".tweet-modal__draft-view");
const draftBackBtn = draftView?.querySelector("[data-testid='app-bar-back']");
const draftTabs = draftView?.querySelectorAll("[data-draft-tab]") ?? [];

// 초안 목록을 열 때도 주소를 바꾸지 않고 화면 전환만 수행한다.
function openDraftPanel() {
    if (!composeView || !draftView) {
        return;
    }

    composeView.hidden = true;
    draftView.hidden = false;

    // 서버/주소 연동 로직은 비활성화한다.
    // history.pushState({ modal: "drafts" }, "", "/compose/post/unsent/drafts");
}

function closeDraftPanel() {
    if (!composeView || !draftView) {
        return;
    }

    draftView.hidden = true;
    composeView.hidden = false;

    // 서버/주소 연동 로직은 비활성화한다.
    // history.pushState({ modal: "compose" }, "", "/compose/post");
}

// 초안 버튼 클릭 → 초안 패널 표시
draftBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openDraftPanel();
});

// 돌아가기 버튼 → 작성 뷰 복귀
draftBackBtn?.addEventListener("click", () => {
    closeDraftPanel();
});

// 탭 전환 (전송하지 않은 게시물 / 예약됨)
draftTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const tabKey = tab.dataset.draftTab;

        draftTabs.forEach((t) => {
            t.classList.remove("draft-panel__tab--active");
            t.setAttribute("aria-selected", "false");
        });

        tab.classList.add("draft-panel__tab--active");
        tab.setAttribute("aria-selected", "true");

        // 탭 상태는 클래스와 aria만 바꾸고 주소는 건드리지 않는다.
        // const path = tabKey === "scheduled"
        //     ? "/compose/post/unsent/scheduled"
        //     : "/compose/post/unsent/drafts";
        // history.replaceState({ modal: "drafts", tab: tabKey }, "", path);
    });
});

// 브라우저 주소/뒤로가기 연동은 데모 범위 밖이라 비활성화한다.
// window.addEventListener("popstate", (e) => {
//     const state = e.state;
//     if (state?.modal === "drafts") {
//         openDraftPanel();
//     } else if (state?.modal === "compose") {
//         closeDraftPanel();
//     } else {
//         closeReplyModal({ skipConfirm: true });
//     }
// });
