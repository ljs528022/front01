(function () {
    "use strict";

    const headerTitle = document.getElementById("headerTitle");
    const defaultHeaderTitle =
        headerTitle?.dataset.defaultTitle || "모든 북마크";
    const backButton = document.getElementById("headerBack");
    const modalOpenButton = document.getElementById("modalOpenButton");
    const detailMoreButton = document.getElementById("detailMoreButton");
    const listView = document.getElementById("bookmarkListView");
    const detailView = document.getElementById("bookmarkDetailView");
    const bookmarkPosts = document.getElementById("bookmarkPosts");
    const searchInput = document.getElementById("bookmarkSearch");
    const searchBox = document.getElementById("searchBox");
    const bookmarkFolderButtons = document.querySelectorAll("[data-bookmark-folder]");
    const bookmarkFolderButton = document.getElementById("bookmarkFolderButton");
    const bookmarkFolderLabel = document.getElementById("bookmarkFolderLabel");
    const bookmarkList = document.querySelector(".bookmark-list");
    const layersRoot = document.getElementById("bookmarkLayers");
    const detailFolderMenu = document.getElementById("detailFolderMenu");
    const detailFolderEditButton = document.getElementById(
        "detailFolderEditButton",
    );

    const bookmarkModal = document.getElementById("bookmarkModal");
    const modalCloseButton = document.getElementById("modalCloseButton");
    const modalSubmitButton = document.getElementById("modalSubmitButton");
    const folderNameInput = document.getElementById("folderNameInput");
    const folderNameCount = document.getElementById("folderNameCount");
    const bookmarkEditModal = document.getElementById("bookmarkEditModal");
    const editModalCloseButton = document.getElementById("editModalCloseButton");
    const editModalSubmitButton = document.getElementById(
        "editModalSubmitButton",
    );
    const editModalDeleteButton = document.getElementById(
        "editModalDeleteButton",
    );
    const editFolderNameInput = document.getElementById("editFolderNameInput");
    const editFolderNameCount = document.getElementById("editFolderNameCount");
    const bookmarkDeleteModal = document.getElementById("bookmarkDeleteModal");
    const deleteModalSubmitButton = document.getElementById(
        "deleteModalSubmitButton",
    );
    const deleteModalCancelButton = document.getElementById(
        "deleteModalCancelButton",
    );

    const mediaPreviewOverlay = document.getElementById("mediaPreviewOverlay");
    const mediaPreviewImage = document.getElementById("mediaPreviewImage");
    const mediaPreviewClose = document.getElementById("mediaPreviewClose");

    const replyModalOverlay = document.getElementById("replyModalOverlay");
    const replyModalClose = document.getElementById("replyModalClose");
    const replyModalSubmit = document.getElementById("replyModalSubmit");
    const replyModalTarget = document.getElementById("replyModalTarget");
    const replyModalEditor = document.getElementById("replyModalEditor");
    const replySourceAvatar = document.getElementById("replySourceAvatar");
    const replySourceName = document.getElementById("replySourceName");
    const replySourceHandle = document.getElementById("replySourceHandle");
    const replySourceTime = document.getElementById("replySourceTime");
    const replySourceText = document.getElementById("replySourceText");
    const replyComposerAvatar = document.getElementById("replyComposerAvatar");
    const replyDraftButton = document.getElementById("replyDraftButton");
    const replyComposeView = document.querySelector(".tweet-modal__compose-view");
    const replyGauge = document.getElementById("replyGauge");
    const replyGaugeText = document.getElementById("replyGaugeText");
    const replyAttachmentPreview = document.getElementById("replyAttachmentPreview");
    const replyAttachmentMedia = document.getElementById("replyAttachmentMedia");
    const replyMediaUploadButton = document.getElementById("replyMediaUploadButton");
    const replyFileInput = document.getElementById("replyFileInput");
    const replyEmojiButton = document.getElementById("replyEmojiButton");
    const replyEmojiPicker = document.getElementById("replyEmojiPicker");
    const replyEmojiSearchInput = document.getElementById("replyEmojiSearchInput");
    const replyEmojiContent = document.getElementById("replyEmojiContent");
    const replyEmojiTabs = Array.from(
        document.querySelectorAll(".tweet-modal__emoji-tab"),
    );
    const replyGeoButton = document.getElementById("replyGeoButton");
    const replyGeoButtonPath = document.getElementById("replyGeoButtonPath");
    const replyLocationDisplayButton = document.getElementById(
        "replyLocationDisplayButton",
    );
    const replyLocationName = document.getElementById("replyLocationName");
    const replyLocationView = document.getElementById("replyLocationView");
    const replyLocationCloseButton = document.getElementById(
        "replyLocationCloseButton",
    );
    const replyLocationDeleteButton = document.getElementById(
        "replyLocationDeleteButton",
    );
    const replyLocationCompleteButton = document.getElementById(
        "replyLocationCompleteButton",
    );
    const replyLocationSearchInput = document.getElementById(
        "replyLocationSearchInput",
    );
    const replyLocationList = document.getElementById("replyLocationList");
    const replyUserTagTrigger = document.getElementById("replyUserTagTrigger");
    const replyUserTagLabel = document.getElementById("replyUserTagLabel");
    const replyTagView = document.getElementById("replyTagView");
    const replyTagCloseButton = document.getElementById("replyTagCloseButton");
    const replyTagCompleteButton = document.getElementById(
        "replyTagCompleteButton",
    );
    const replyTagSearchForm = document.getElementById("replyTagSearchForm");
    const replyTagSearchInput = document.getElementById("replyTagSearchInput");
    const replyTagChipList = document.getElementById("replyTagChipList");
    const replyTagResults = document.getElementById("replyTagResults");
    const replyMediaAltTrigger = document.getElementById("replyMediaAltTrigger");
    const replyMediaAltLabel = document.getElementById("replyMediaAltLabel");
    const replyMediaView = document.getElementById("replyMediaView");
    const replyMediaBackButton = document.getElementById("replyMediaBackButton");
    const replyMediaPrevButton = document.getElementById("replyMediaPrevButton");
    const replyMediaNextButton = document.getElementById("replyMediaNextButton");
    const replyMediaSaveButton = document.getElementById("replyMediaSaveButton");
    const replyMediaTitle = document.getElementById("replyMediaTitle");
    const replyMediaPreviewImage = document.getElementById(
        "replyMediaPreviewImage",
    );
    const replyMediaAltInput = document.getElementById("replyMediaAltInput");
    const replyMediaAltCount = document.getElementById("replyMediaAltCount");
    const replyDraftView = document.getElementById("replyDraftView");
    const replyDraftBackButton = document.getElementById("replyDraftBackButton");
    const replyDraftActionButton = document.getElementById(
        "replyDraftActionButton",
    );
    const replyDraftList = document.getElementById("replyDraftList");
    const replyDraftEmpty = document.getElementById("replyDraftEmpty");
    const replyDraftFooter = document.getElementById("replyDraftFooter");
    const replyDraftSelectAllButton = document.getElementById(
        "replyDraftSelectAllButton",
    );
    const replyDraftDeleteButton = document.getElementById(
        "replyDraftDeleteButton",
    );
    const replyDraftConfirmOverlay = document.getElementById(
        "replyDraftConfirmOverlay",
    );
    const replyDraftConfirmDeleteButton = document.getElementById(
        "replyDraftConfirmDeleteButton",
    );
    const replyDraftConfirmCancelButton = document.getElementById(
        "replyDraftConfirmCancelButton",
    );

    const paths = {
        reply:
            "M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z",
        likeInactive:
            "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",
        likeActive:
            "M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",
        views:
            "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z",
        bookmarkInactive:
            "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z",
        bookmarkActive:
            "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z",
        share:
            "M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z",
        moreFollow:
            "M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm4 7c-3.053 0-5.563 1.193-7.443 3.596l1.548 1.207C5.573 15.922 7.541 15 10 15s4.427.922 5.895 2.803l1.548-1.207C15.563 14.193 13.053 13 10 13zm8-6V5h-3V3h-2v2h-3v2h3v3h2V7h3z",
        moreBlock:
            "M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z",
        moreReport:
            "M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z",
    };

    const bookmarkPostsData = [
        {
            id: "101",
            avatarText: "T",
            name: "TradeHub Official",
            handle: "@TradeHub_KR",
            time: "2시간",
            text: "2026년 무역 흐름 요약과 함께 이번 주 글로벌 관세 변동 사항을 정리했습니다.",
            media: {
                type: "single",
                images: [
                    {
                        src: "/static/images/main/KakaoTalk_20260310_145435590.jpg",
                        alt: "무역 데이터 리포트 미리보기 이미지",
                    },
                ],
            },
            counts: { reply: 24, like: 187, views: "32" },
        },
        {
            id: "202",
            avatarImage: "/static/images/main/ad.png",
            name: "홍성호",
            handle: "@codingTest0120",
            time: "지금",
            text: "요즘 글로벌 공급망 흐름이 꽤 빠르게 바뀌고 있는 것 같습니다. 특히 동남아와 인도 쪽 제조 허브가 확대되면서 기존 중국 중심 물류 구조가 조금씩 분산되는 느낌이에요. 수출입 데이터를 보면 해상 물동량 패턴도 미묘하게 변하고 있는데, 환율과 운임, 통관 리드타임까지 같이 보지 않으면 체감이 안 되는 구간이 많습니다. 현업에서는 생산기지 이전 이슈와 항만 적체, 재고 전략 변화가 동시에 엮여서 판단이 더 어려워진 것 같네요.",
            media: {
                type: "grid-2",
                images: [
                    { src: "/static/images/main/ad.png", alt: "게시물 이미지 1" },
                    { src: "/static/images/main/ad.png", alt: "게시물 이미지 2" },
                ],
            },
            counts: { reply: 12, like: 208, views: "18만" },
        },
    ];

    const composerEmojiCategoryMeta = {
        recent: { label: "최근", sectionTitle: "최근", icon: "🕘" },
        smileys: { label: "스마일리 및 사람", sectionTitle: "스마일리 및 사람", icon: "😀" },
        animals: { label: "동물 및 자연", sectionTitle: "동물 및 자연", icon: "🌿" },
        food: { label: "음식 및 음료", sectionTitle: "음식 및 음료", icon: "🍔" },
        activities: { label: "활동", sectionTitle: "활동", icon: "⚽" },
        travel: { label: "여행 및 장소", sectionTitle: "여행 및 장소", icon: "✈️" },
        objects: { label: "사물", sectionTitle: "사물", icon: "💡" },
        symbols: { label: "기호", sectionTitle: "기호", icon: "✨" },
        flags: { label: "깃발", sectionTitle: "깃발", icon: "🏳️" },
    };

    const composerEmojiCategoryData = {
        smileys: ["😀", "😃", "😄", "😁", "😂", "😊", "😉", "😍", "🥰", "😎", "🤔", "😭", "🥳", "🤩", "😴", "😤", "🤯", "🫠"],
        animals: ["🐶", "🐱", "🐻", "🐼", "🦊", "🐯", "🦁", "🐸", "🐵", "🐧", "🐦", "🦄", "🐝", "🦋", "🌸", "🌿", "🌙", "⭐"],
        food: ["🍔", "🍕", "🍜", "🍣", "🍩", "🍪", "🍫", "🍿", "🥐", "🍎", "🍓", "🍉", "🍇", "☕", "🍵", "🥤"],
        activities: ["⚽", "🏀", "🎮", "🎯", "🎳", "🎸", "🎧", "🎬", "📚", "🧩", "🏆", "🥇", "🏃", "🚴"],
        travel: ["🚗", "🚌", "✈️", "🚀", "🚲", "⛵", "🏠", "🏙️", "🏝️", "🌁", "🗼", "🗽", "📍"],
        objects: ["💡", "📱", "💻", "⌚", "📷", "🎥", "💰", "💎", "🔑", "🎁", "📌", "🧸", "🛒", "🧠"],
        symbols: ["❤️", "💙", "💚", "💛", "💜", "🖤", "✨", "💫", "💥", "💯", "✔️", "❌", "⚠️", "🔔"],
        flags: ["🏳️", "🏴", "🏁", "🚩", "🎌", "🏳️‍🌈", "🇰🇷", "🇺🇸", "🇯🇵", "🇫🇷", "🇬🇧"],
    };

    const composerFormatButtonLabels = {
        bold: {
            inactive: "굵게, (CTRL+B) 님",
            active: "굵게, 활성 상태, (CTRL+B) 님 님",
        },
        italic: {
            inactive: "기울임꼴, (CTRL+I) 님",
            active: "기울임꼴, 활성 상태, (CTRL+I) 님 님",
        },
    };

    let isDetailViewOpen = false;
    let activeShareDropdown = null;
    let activeShareButton = null;
    let activeShareToast = null;
    let activeShareModal = null;
    let activeReplyButton = null;
    let currentFolderDeleted = false;
    let currentFolderName =
        bookmarkFolderButton?.dataset.bookmarkFolder ||
        getTextContent(bookmarkFolderLabel) ||
        "test";
    let savedReplySelection = null;
    let pendingReplyFormats = new Set();
    let activeEmojiCategory = "recent";
    let selectedLocation = null;
    let pendingLocation = null;
    let selectedTaggedUsers = [];
    let pendingTaggedUsers = [];
    let currentTagResults = [];
    let attachedReplyFiles = [];
    let attachedReplyFileUrls = [];
    let replyMediaEdits = [];
    let pendingReplyMediaEdits = [];
    let activeReplyMediaIndex = 0;
    const emojiRecentsKey = "bookmark_reply_recent_emojis";
    const maxRecentEmojis = 18;
    const replyMaxLength = 500;
    const maxReplyImages = 4;
    const maxReplyMediaAltLength = 1000;
    const locationOptions = [
        "대한민국 서초구",
        "대한민국 강남구",
        "대한민국 송파구",
        "대한민국 광진구",
        "대한민국 동작구",
        "대한민국 중구",
    ];
    const draftPanelState = {
        isEditMode: false,
        confirmOpen: false,
        selectedItems: new Set(),
    };

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function buildShareAvatarDataUri(label) {
        const safeLabel = escapeHtml((label || "?").slice(0, 2));
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="#1d9bf0"></rect><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${safeLabel}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function setHeaderTitle(title) {
        if (headerTitle) {
            headerTitle.textContent = title;
        }
    }

    function getTextContent(element) {
        return element?.textContent?.replace(/\s+/g, " ").trim() || "";
    }

    function syncFolderNameUI() {
        if (bookmarkFolderLabel) {
            bookmarkFolderLabel.textContent = currentFolderName;
        }
        if (bookmarkFolderButton) {
            bookmarkFolderButton.dataset.bookmarkFolder = currentFolderName;
            bookmarkFolderButton.setAttribute(
                "aria-label",
                `${currentFolderName} 북마크 열기`,
            );
            bookmarkFolderButton.hidden = currentFolderDeleted;
        }
        if (bookmarkList) {
            bookmarkList.hidden = currentFolderDeleted;
        }
        if (isDetailViewOpen) {
            setHeaderTitle(currentFolderName);
        }
    }

    function parseTwemoji(scope) {
        if (!scope || !window.twemoji) {
            return;
        }
        window.twemoji.parse(scope, { folder: "svg", ext: ".svg" });
    }

    function placeCaretAtEnd(element) {
        const selection = window.getSelection();
        if (!selection || !element) {
            return;
        }
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function getCurrentAccountAvatar() {
        return buildShareAvatarDataUri("나");
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
        const next = getRecentEmojis().filter((item) => item !== emoji);
        next.unshift(emoji);
        try {
            window.localStorage.setItem(
                emojiRecentsKey,
                JSON.stringify(next.slice(0, maxRecentEmojis)),
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

    function getEmojiEntriesForCategory(category) {
        if (category === "recent") {
            return getRecentEmojis().map((emoji) => ({ emoji, keywords: [emoji] }));
        }
        return (composerEmojiCategoryData[category] ?? []).map((emoji) => ({
            emoji,
            keywords: [emoji, composerEmojiCategoryMeta[category]?.label ?? ""],
        }));
    }

    function buildEmojiSection(title, emojis, { clearable = false, emptyText = "" } = {}) {
        const headerAction = clearable
            ? '<button type="button" class="tweet-modal__emoji-clear" data-action="clear-recent">모두 지우기</button>'
            : "";
        const body = emojis.length
            ? `<div class="tweet-modal__emoji-grid">${emojis
                  .map(
                      (emoji) =>
                          `<button type="button" class="tweet-modal__emoji-option" data-emoji="${emoji}" role="menuitem">${emoji}</button>`,
                  )
                  .join("")}</div>`
            : `<p class="tweet-modal__emoji-empty">${emptyText}</p>`;
        return `<section class="tweet-modal__emoji-section"><div class="tweet-modal__emoji-section-header"><h3 class="tweet-modal__emoji-section-title">${title}</h3>${headerAction}</div>${body}</section>`;
    }

    function renderEmojiTabs() {
        replyEmojiTabs.forEach((tab) => {
            const category = tab.dataset.emojiCategory;
            const meta = category ? composerEmojiCategoryMeta[category] : null;
            const isActive = category === activeEmojiCategory;
            tab.classList.toggle("tweet-modal__emoji-tab--active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            tab.textContent = meta?.icon || "";
        });
        parseTwemoji(replyEmojiPicker);
    }

    function renderEmojiPicker() {
        if (!replyEmojiContent) {
            return;
        }
        const searchTerm = replyEmojiSearchInput?.value.trim().toLowerCase() ?? "";
        if (searchTerm) {
            const sections = Object.keys(composerEmojiCategoryData)
                .map((category) => {
                    const entries = getEmojiEntriesForCategory(category).filter((entry) =>
                        entry.keywords.some((keyword) =>
                            keyword.toLowerCase().includes(searchTerm),
                        ),
                    );
                    if (entries.length === 0) {
                        return "";
                    }
                    return buildEmojiSection(
                        composerEmojiCategoryMeta[category].sectionTitle,
                        entries.map((entry) => entry.emoji),
                    );
                })
                .join("");
            replyEmojiContent.innerHTML =
                sections ||
                buildEmojiSection("검색 결과", [], {
                    emptyText: "일치하는 이모티콘이 없습니다.",
                });
            renderEmojiTabs();
            parseTwemoji(replyEmojiContent);
            return;
        }

        if (activeEmojiCategory === "recent") {
            const recent = getRecentEmojis();
            replyEmojiContent.innerHTML =
                buildEmojiSection("최근", recent, {
                    clearable: recent.length > 0,
                    emptyText: "최근 사용한 이모티콘이 없습니다.",
                }) +
                buildEmojiSection(
                    composerEmojiCategoryMeta.smileys.sectionTitle,
                    getEmojiEntriesForCategory("smileys").map((entry) => entry.emoji),
                );
        } else {
            replyEmojiContent.innerHTML = buildEmojiSection(
                composerEmojiCategoryMeta[activeEmojiCategory].sectionTitle,
                getEmojiEntriesForCategory(activeEmojiCategory).map(
                    (entry) => entry.emoji,
                ),
            );
        }
        renderEmojiTabs();
        parseTwemoji(replyEmojiContent);
    }

    function updateEmojiPickerPosition() {
        if (!replyEmojiPicker || !replyEmojiButton) {
            return;
        }
        const rect = replyEmojiButton.getBoundingClientRect();
        const pickerWidth = Math.min(565, window.innerWidth - 32);
        const maxLeft = Math.max(16, window.innerWidth - pickerWidth - 16);
        const left = Math.min(Math.max(16, rect.left), maxLeft);
        const top = rect.bottom + 8;
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
    }

    function closeEmojiPicker() {
        if (!replyEmojiPicker || !replyEmojiButton) {
            return;
        }
        replyEmojiPicker.hidden = true;
        replyEmojiButton.setAttribute("aria-expanded", "false");
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

    function saveReplySelection() {
        if (!replyModalEditor) {
            return;
        }
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const range = selection.getRangeAt(0);
        if (replyModalEditor.contains(range.commonAncestorContainer)) {
            savedReplySelection = range.cloneRange();
        }
    }

    function restoreReplySelection() {
        if (!savedReplySelection) {
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

    function hasReplyEditorText() {
        return getTextContent(replyModalEditor).length > 0;
    }

    function applyPendingReplyFormatsToContent() {
        if (!replyModalEditor || pendingReplyFormats.size === 0 || !hasReplyEditorText()) {
            return;
        }
        let span = null;
        if (
            replyModalEditor.childNodes.length === 1 &&
            replyModalEditor.firstElementChild?.tagName === "SPAN"
        ) {
            span = replyModalEditor.firstElementChild;
        } else {
            span = document.createElement("span");
            while (replyModalEditor.firstChild) {
                span.appendChild(replyModalEditor.firstChild);
            }
            replyModalEditor.appendChild(span);
        }
        span.style.fontWeight = pendingReplyFormats.has("bold") ? "bold" : "";
        span.style.fontStyle = pendingReplyFormats.has("italic") ? "italic" : "";
        placeCaretAtEnd(span);
        saveReplySelection();
    }

    function syncReplyFormatButtons() {
        document.querySelectorAll("[data-format]").forEach((button) => {
            const format = button.getAttribute("data-format");
            if (!format) {
                return;
            }
            let isActive = false;
            try {
                isActive = hasReplyEditorText()
                    ? document.queryCommandState(format)
                    : pendingReplyFormats.has(format);
            } catch {
                isActive = pendingReplyFormats.has(format);
            }
            const labels = composerFormatButtonLabels[format];
            button.classList.toggle("tweet-modal__tool-btn--active", isActive);
            if (labels) {
                button.setAttribute("aria-label", isActive ? labels.active : labels.inactive);
            }
        });
    }

    function applyReplyFormat(format) {
        if (!replyModalEditor) {
            return;
        }
        replyModalEditor.focus();
        if (!hasReplyEditorText()) {
            if (pendingReplyFormats.has(format)) {
                pendingReplyFormats.delete(format);
            } else {
                pendingReplyFormats.add(format);
            }
            syncReplyFormatButtons();
            return;
        }
        if (!restoreReplySelection()) {
            placeCaretAtEnd(replyModalEditor);
        }
        document.execCommand(format, false);
        saveReplySelection();
        syncReplySubmitState();
        syncReplyFormatButtons();
    }

    function insertReplyEmoji(emoji) {
        if (!replyModalEditor) {
            return;
        }
        replyModalEditor.focus();
        if (!restoreReplySelection()) {
            placeCaretAtEnd(replyModalEditor);
        }
        if (!document.execCommand("insertText", false, emoji)) {
            replyModalEditor.textContent += emoji;
            placeCaretAtEnd(replyModalEditor);
        }
        applyPendingReplyFormatsToContent();
        saveRecentEmoji(emoji);
        saveReplySelection();
        syncReplySubmitState();
        syncReplyFormatButtons();
        renderEmojiPicker();
    }

    function showToast(message) {
        activeShareToast?.remove();
        const toast = document.createElement("div");
        toast.className = "bookmark-toast";
        toast.textContent = message;
        document.body.appendChild(toast);
        activeShareToast = toast;
        window.setTimeout(() => {
            if (activeShareToast === toast) {
                activeShareToast = null;
            }
            toast.remove();
        }, 3000);
    }

    function closeShareModal() {
        if (!activeShareModal) {
            return;
        }
        activeShareModal.remove();
        activeShareModal = null;
        updateBodyScrollLock();
    }

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

    function closeDetailFolderMenu() {
        if (!detailFolderMenu) {
            return;
        }
        detailFolderMenu.hidden = true;
        detailFolderMenu.style.removeProperty("top");
        detailFolderMenu.style.removeProperty("left");
        detailMoreButton?.setAttribute("aria-expanded", "false");
    }

    function closePostMenus() {
        closeShareModal();
        closeShareDropdown();
        closeDetailFolderMenu();
        document.querySelectorAll(".bookmark-post-more-menu").forEach((menu) => {
            menu.hidden = true;
        });
        document.querySelectorAll("[data-post-more]").forEach((button) => {
            button.setAttribute("aria-expanded", "false");
        });
    }

    function setBookmarkButtonState(button, isActive) {
        const path = button?.querySelector("path");
        if (!button || !path) {
            return;
        }
        button.classList.toggle("active", isActive);
        button.setAttribute(
            "aria-label",
            isActive ? "북마크에 추가됨" : "북마크",
        );
        path.setAttribute(
            "d",
            isActive
                ? path.dataset.pathActive || path.getAttribute("d")
                : path.dataset.pathInactive || path.getAttribute("d"),
        );
    }

    function getShareUsers() {
        return bookmarkPostsData.map((post) => ({
            id: `post-${post.id}`,
            name: post.name,
            handle: post.handle,
            avatar:
                post.avatarImage ||
                buildShareAvatarDataUri(post.avatarText || post.name.charAt(0)),
        }));
    }

    function getSharePostMeta(button) {
        const postCard = button.closest(".bookmark-post");
        const handle =
            postCard?.querySelector(".bookmark-post-handle")?.textContent?.trim() ||
            "@user";
        const postId = postCard?.dataset.postId || "1";
        const bookmarkButton =
            postCard?.querySelector("[data-action='bookmark']") ?? null;
        const url = new URL(window.location.href);
        url.pathname = `/${handle.replace("@", "")}/status/${postId}`;
        url.hash = "";
        url.search = "";
        return { permalink: url.toString(), bookmarkButton, postId };
    }

    function copyShareLink(button) {
        const { permalink } = getSharePostMeta(button);
        closeShareDropdown();
        if (!navigator.clipboard?.writeText) {
            showToast("링크를 복사하지 못했습니다");
            return;
        }
        navigator.clipboard
            .writeText(permalink)
            .then(() => showToast("클립보드로 복사함"))
            .catch(() => showToast("링크를 복사하지 못했습니다"));
    }

    function getShareUserRows(users) {
        if (users.length === 0) {
            return '<div class="bookmark-share-sheet-empty"><p>전송할 수 있는 사용자가 없습니다.</p></div>';
        }

        return users
            .map(
                (user) => `
                    <button type="button" class="bookmark-share-sheet-user" data-share-user-name="${escapeHtml(user.name)}">
                        <span class="bookmark-share-sheet-user-avatar">
                            <img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" />
                        </span>
                        <span class="bookmark-share-sheet-user-body">
                            <span class="bookmark-share-sheet-user-name">${escapeHtml(user.name)}</span>
                            <span class="bookmark-share-sheet-user-handle">${escapeHtml(user.handle)}</span>
                        </span>
                    </button>
                `,
            )
            .join("");
    }

    function openShareChatModal(button) {
        closeShareDropdown();
        closeShareModal();

        const users = getShareUsers();
        const modal = document.createElement("div");
        modal.className = "bookmark-share-sheet";
        modal.innerHTML = `
            <div class="bookmark-share-sheet-backdrop" data-share-close="true"></div>
            <div class="bookmark-share-sheet-card" role="dialog" aria-modal="true" aria-labelledby="shareChatTitle">
                <div class="bookmark-share-sheet-header">
                    <button type="button" class="bookmark-share-sheet-icon-btn" data-share-close="true" aria-label="돌아가기">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                    </button>
                    <h2 id="shareChatTitle" class="bookmark-share-sheet-title">공유하기</h2>
                    <span class="bookmark-share-sheet-header-spacer"></span>
                </div>
                <div class="bookmark-share-sheet-search">
                    <input type="text" class="bookmark-share-sheet-search-input" placeholder="검색" aria-label="검색" />
                </div>
                <div class="bookmark-share-sheet-list">${getShareUserRows(users)}</div>
            </div>
        `;

        const search = modal.querySelector(".bookmark-share-sheet-search-input");
        const list = modal.querySelector(".bookmark-share-sheet-list");
        search?.addEventListener("input", () => {
            const query = search.value.trim().toLowerCase();
            const filtered = users.filter((user) => {
                return (
                    user.name.toLowerCase().includes(query) ||
                    user.handle.toLowerCase().includes(query)
                );
            });
            if (list) {
                list.innerHTML = getShareUserRows(filtered);
            }
        });

        modal.addEventListener("click", (event) => {
            const userButton = event.target.closest(".bookmark-share-sheet-user");
            if (
                event.target.closest("[data-share-close='true']") ||
                event.target.classList.contains("bookmark-share-sheet-backdrop")
            ) {
                closeShareModal();
                return;
            }
            if (userButton) {
                closeShareModal();
                showToast(`${userButton.dataset.shareUserName || "선택한 사용자"}에게 전송함`);
            }
        });

        document.body.appendChild(modal);
        activeShareModal = modal;
        updateBodyScrollLock();
    }

    function openShareBookmarkModal(button) {
        const { bookmarkButton, postId } = getSharePostMeta(button);
        closeShareDropdown();
        closeShareModal();

        const isBookmarked = bookmarkButton?.classList.contains("active") ?? false;
        const modal = document.createElement("div");
        modal.className = "bookmark-share-sheet";
        modal.innerHTML = `
            <div class="bookmark-share-sheet-backdrop" data-share-close="true"></div>
            <div class="bookmark-share-sheet-card bookmark-share-sheet-card--bookmark" role="dialog" aria-modal="true" aria-labelledby="shareBookmarkTitle">
                <div class="bookmark-share-sheet-header">
                    <button type="button" class="bookmark-share-sheet-icon-btn" data-share-close="true" aria-label="닫기">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                    </button>
                    <h2 id="shareBookmarkTitle" class="bookmark-share-sheet-title">폴더에 추가</h2>
                    <span class="bookmark-share-sheet-header-spacer"></span>
                </div>
                <button type="button" class="bookmark-share-sheet-create-folder">새 북마크 폴더 만들기</button>
                <button type="button" class="bookmark-share-sheet-folder" data-share-folder="all-bookmarks">
                    <span class="bookmark-share-sheet-folder-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"></path></svg>
                    </span>
                    <span class="bookmark-share-sheet-folder-name">모든 북마크</span>
                    <span class="bookmark-share-sheet-folder-check${isBookmarked ? " bookmark-share-sheet-folder-check--active" : ""}">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></svg>
                    </span>
                </button>
            </div>
        `;

        modal.addEventListener("click", (event) => {
            if (
                event.target.closest("[data-share-close='true']") ||
                event.target.classList.contains("bookmark-share-sheet-backdrop")
            ) {
                closeShareModal();
                return;
            }
            if (event.target.closest(".bookmark-share-sheet-create-folder")) {
                closeShareModal();
                modalOpenButton?.click();
                return;
            }
            if (event.target.closest("[data-share-folder='all-bookmarks']")) {
                if (isBookmarked) {
                    removeBookmarkedPost(postId);
                } else {
                    setBookmarkButtonState(bookmarkButton, true);
                }
                closeShareModal();
            }
        });

        document.body.appendChild(modal);
        activeShareModal = modal;
        updateBodyScrollLock();
    }

    function positionDropdownLayer(layer, anchorRect) {
        const menu = layer.querySelector(".bookmark-dropdown-menu");
        if (!menu) {
            return;
        }
        const spacing = 8;
        const viewportPadding = 8;
        const menuRect = menu.getBoundingClientRect();
        const top = Math.min(
            Math.max(viewportPadding, anchorRect.bottom + spacing),
            Math.max(
                viewportPadding,
                window.innerHeight - menuRect.height - viewportPadding,
            ),
        );
        const left = Math.min(
            Math.max(viewportPadding, anchorRect.right - menuRect.width),
            Math.max(
                viewportPadding,
                window.innerWidth - menuRect.width - viewportPadding,
            ),
        );
        layer.style.top = `${top}px`;
        layer.style.left = `${left}px`;
    }

    function positionDetailFolderMenu() {
        if (!detailFolderMenu || !detailMoreButton) {
            return;
        }
        const rect = detailMoreButton.getBoundingClientRect();
        const spacing = 8;
        const viewportPadding = 8;
        const menuRect = detailFolderMenu.getBoundingClientRect();
        const top = Math.min(
            Math.max(viewportPadding, rect.bottom + spacing),
            Math.max(
                viewportPadding,
                window.innerHeight - menuRect.height - viewportPadding,
            ),
        );
        const left = Math.min(
            Math.max(viewportPadding, rect.right - menuRect.width),
            Math.max(
                viewportPadding,
                window.innerWidth - menuRect.width - viewportPadding,
            ),
        );
        detailFolderMenu.style.top = `${top}px`;
        detailFolderMenu.style.left = `${left}px`;
    }

    function openDetailFolderMenu() {
        if (!detailFolderMenu || !detailMoreButton || detailMoreButton.hidden) {
            return;
        }
        closePostMenus();
        detailFolderMenu.hidden = false;
        detailMoreButton.setAttribute("aria-expanded", "true");
        positionDetailFolderMenu();
    }

    function closeDeleteModal() {
        if (!bookmarkDeleteModal) {
            return;
        }
        bookmarkDeleteModal.classList.remove("is-open");
        bookmarkDeleteModal.setAttribute("aria-hidden", "true");
        updateBodyScrollLock();
    }

    function openDeleteModal() {
        if (!bookmarkDeleteModal) {
            return;
        }
        closeDetailFolderMenu();
        bookmarkDeleteModal.classList.add("is-open");
        bookmarkDeleteModal.setAttribute("aria-hidden", "false");
        updateBodyScrollLock();
        window.setTimeout(() => deleteModalSubmitButton?.focus(), 0);
    }

    function deleteCurrentFolder() {
        currentFolderDeleted = true;
        closeDeleteModal();
        if (isDetailViewOpen) {
            closeBookmarkDetail();
        }
        syncFolderNameUI();
        showToast("폴더를 삭제했습니다");
    }

    function openShareDropdown(button) {
        if (!layersRoot) {
            return;
        }
        closePostMenus();
        const rect = button.getBoundingClientRect();
        const layer = document.createElement("div");
        layer.className = "bookmark-layers-dropdown";
        layer.innerHTML = `
            <div role="menu" class="bookmark-dropdown-menu">
                <button type="button" class="bookmark-dropdown-menu-item" data-share-action="copy">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></svg>
                    <span>링크 복사하기</span>
                </button>
                <button type="button" class="bookmark-dropdown-menu-item" data-share-action="chat">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5a.5.5 0 00-.5.5v2.764l8 3.638 8-3.636V5.5a.5.5 0 00-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-8.037z"></path></svg>
                    <span>Chat으로 전송하기</span>
                </button>
                <button type="button" class="bookmark-dropdown-menu-item" data-share-action="bookmark">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.share}"></path></svg>
                    <span>폴더에 북마크 추가하기</span>
                </button>
            </div>
        `;

        layer.addEventListener("click", (event) => {
            const actionButton = event.target.closest("[data-share-action]");
            if (!actionButton || !activeShareButton) {
                return;
            }
            const action = actionButton.dataset.shareAction;
            if (action === "copy") {
                copyShareLink(activeShareButton);
            } else if (action === "chat") {
                openShareChatModal(activeShareButton);
            } else if (action === "bookmark") {
                openShareBookmarkModal(activeShareButton);
            }
        });

        layersRoot.appendChild(layer);
        positionDropdownLayer(layer, rect);
        activeShareDropdown = layer;
        activeShareButton = button;
        activeShareButton.setAttribute("aria-expanded", "true");
    }

    function renderMedia(post) {
        if (!post.media?.images?.length) {
            return "";
        }
        if (post.media.type === "grid-2") {
            return `
                <div class="bookmark-post-media-grid bookmark-post-media-grid--2">
                    ${post.media.images
                        .map(
                            (image) => `
                                <img
                                    src="${escapeHtml(image.src)}"
                                    alt="${escapeHtml(image.alt)}"
                                    class="bookmark-post-media-image"
                                    data-media-preview="true"
                                />
                            `,
                        )
                        .join("")}
                </div>
            `;
        }
        const image = post.media.images[0];
        return `
            <div class="bookmark-post-media">
                <img
                    src="${escapeHtml(image.src)}"
                    alt="${escapeHtml(image.alt)}"
                    class="bookmark-post-media-image"
                    data-media-preview="true"
                />
            </div>
        `;
    }

    function renderAvatar(post) {
        if (post.avatarImage) {
            return `
                <div class="bookmark-post-avatar bookmark-post-avatar--image">
                    <img src="${escapeHtml(post.avatarImage)}" alt="${escapeHtml(post.name)} 프로필 이미지" />
                </div>
            `;
        }
        return `<div class="bookmark-post-avatar">${escapeHtml(post.avatarText || post.name[0])}</div>`;
    }

    function renderPost(post) {
        return `
            <article class="bookmark-post" data-post-id="${escapeHtml(post.id)}">
                ${renderAvatar(post)}
                <div class="bookmark-post-body">
                    <header class="bookmark-post-header">
                        <div class="bookmark-post-identity">
                            <strong class="bookmark-post-name">${escapeHtml(post.name)}</strong>
                            <span class="bookmark-post-handle">${escapeHtml(post.handle)}</span>
                            <span class="bookmark-post-time">${escapeHtml(post.time)}</span>
                        </div>
                        <div class="bookmark-post-more-wrap">
                            <button class="bookmark-post-more" type="button" aria-label="게시물 더 보기" aria-haspopup="menu" aria-expanded="false" data-post-more>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                            </button>
                            <div class="bookmark-post-more-menu" role="menu" hidden>
                                <button type="button" class="bookmark-post-more-menu-item" role="menuitem">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.moreFollow}"></path></svg>
                                    <span>${escapeHtml(post.handle)} 님 팔로우하기</span>
                                </button>
                                <button type="button" class="bookmark-post-more-menu-item" role="menuitem">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.moreBlock}"></path></svg>
                                    <span>${escapeHtml(post.handle)} 님 차단하기</span>
                                </button>
                                <button type="button" class="bookmark-post-more-menu-item" role="menuitem">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.moreReport}"></path></svg>
                                    <span>게시물 신고하기</span>
                                </button>
                            </div>
                        </div>
                    </header>
                    <p class="bookmark-post-text" data-expandable-text>${escapeHtml(post.text)}</p>
                    ${renderMedia(post)}
                    <footer class="bookmark-post-metrics">
                        <div class="bookmark-post-actions">
                            <button type="button" class="bookmark-post-action" data-action="reply" aria-label="답글 ${escapeHtml(post.counts.reply)}">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.reply}"></path></svg>
                                <span>${escapeHtml(post.counts.reply)}</span>
                            </button>
                            <button type="button" class="bookmark-post-action bookmark-post-action--like" data-action="like" data-base-count="${escapeHtml(post.counts.like)}" aria-label="마음 ${escapeHtml(post.counts.like)}">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="${paths.likeInactive}" data-path-inactive="${paths.likeInactive}" data-path-active="${paths.likeActive}"></path>
                                </svg>
                                <span>${escapeHtml(post.counts.like)}</span>
                            </button>
                            <button type="button" class="bookmark-post-action" aria-label="조회수 ${escapeHtml(post.counts.views)}">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.views}"></path></svg>
                                <span>${escapeHtml(post.counts.views)}</span>
                            </button>
                            <div class="bookmark-post-action-right">
                                <button type="button" class="bookmark-post-action bookmark-post-action--bookmark active" data-action="bookmark" aria-label="북마크에 추가됨">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="${paths.bookmarkActive}" data-path-inactive="${paths.bookmarkInactive}" data-path-active="${paths.bookmarkActive}"></path>
                                    </svg>
                                </button>
                                <button type="button" class="bookmark-post-action" data-action="share" aria-label="게시물 공유하기" aria-haspopup="menu" aria-expanded="false">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths.share}"></path></svg>
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>
        `;
    }

    function setupExpandablePostText() {
        const maxLength = 200;
        bookmarkPosts?.querySelectorAll("[data-expandable-text]").forEach((element) => {
            const fullText = element.textContent?.replace(/\s+/g, " ").trim() || "";
            if (fullText.length <= maxLength) {
                return;
            }
            const content = document.createElement("span");
            content.textContent = `${fullText.slice(0, maxLength).trimEnd()}...`;
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "bookmark-post-text-toggle";
            toggle.textContent = "더보기";
            element.dataset.fullText = fullText;
            element.textContent = "";
            element.append(content, toggle);
            toggle.addEventListener("click", () => {
                content.textContent = element.dataset.fullText || fullText;
                toggle.remove();
            });
        });
    }

    function renderBookmarkPosts() {
        if (!bookmarkPosts) {
            return;
        }
        if (bookmarkPostsData.length === 0) {
            bookmarkPosts.innerHTML = `
                <section class="empty-state" aria-live="polite">
                    <div class="empty-copy">
                        <h2 class="empty-title">저장된 게시물이 없습니다</h2>
                        <p class="empty-description">북마크를 해제하면 이 목록에서 바로 사라집니다.</p>
                    </div>
                </section>
            `;
            return;
        }
        bookmarkPosts.innerHTML = bookmarkPostsData.map(renderPost).join("");
        setupExpandablePostText();
    }

    function syncReplyAvatars() {
        const avatar = getCurrentAccountAvatar();
        if (replyComposerAvatar) {
            replyComposerAvatar.src = avatar;
            replyComposerAvatar.alt = "내 프로필";
        }
        document.querySelectorAll("[data-reply-draft-avatar]").forEach((image) => {
            image.src = avatar;
            image.alt = "내 프로필";
        });
    }

    function cloneReplyMediaEdits(entries) {
        return entries.map((entry) => ({ ...entry }));
    }

    function revokeReplyAttachmentUrls() {
        attachedReplyFileUrls.forEach((url) => URL.revokeObjectURL(url));
        attachedReplyFileUrls = [];
    }

    function syncMediaAltTrigger() {
        const can = attachedReplyFiles.some((file) => file.type.startsWith("image/"));
        if (replyMediaAltTrigger) {
            replyMediaAltTrigger.hidden = !can;
            replyMediaAltTrigger.disabled = !can;
        }
        if (replyMediaAltLabel) {
            replyMediaAltLabel.textContent = can ? "설명 추가" : "설명 추가";
        }
    }

    function syncUserTagTrigger() {
        const canTag = attachedReplyFiles.some((file) => file.type.startsWith("image/"));
        if (replyUserTagTrigger) {
            replyUserTagTrigger.hidden = !canTag;
            replyUserTagTrigger.disabled = !canTag;
        }
        if (replyUserTagLabel) {
            replyUserTagLabel.textContent = "사용자 태그하기";
        }
    }

    function renderReplyAttachmentPreview() {
        if (!replyAttachmentPreview || !replyAttachmentMedia) {
            return;
        }
        if (attachedReplyFiles.length === 0) {
            replyAttachmentPreview.hidden = true;
            replyAttachmentMedia.innerHTML = "";
            syncMediaAltTrigger();
            syncUserTagTrigger();
            return;
        }

        if (attachedReplyFileUrls.length !== attachedReplyFiles.length) {
            revokeReplyAttachmentUrls();
            attachedReplyFileUrls = attachedReplyFiles.map((file) =>
                URL.createObjectURL(file),
            );
        }

        const gridClass =
            attachedReplyFiles.length === 1
                ? "reply-attachment-grid reply-attachment-grid--1"
                : attachedReplyFiles.length === 2
                  ? "reply-attachment-grid reply-attachment-grid--2"
                  : attachedReplyFiles.length === 3
                    ? "reply-attachment-grid reply-attachment-grid--3"
                    : "reply-attachment-grid reply-attachment-grid--4";

        replyAttachmentMedia.innerHTML = `
            <div class="${gridClass}">
                ${attachedReplyFileUrls
                    .map(
                        (url, index) => `
                            <div class="reply-attachment-item">
                                <img src="${url}" alt="${escapeHtml(replyMediaEdits[index]?.alt || `첨부 이미지 ${index + 1}`)}" />
                                <div class="reply-attachment-actions">
                                    <button type="button" class="reply-attachment-action" data-attachment-edit-index="${index}" aria-label="설명 수정">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h4.75L19.81 9.94l-4.75-4.75L4 16.25V21zm13.71-13.96 1.09-1.09a1.5 1.5 0 0 0 0-2.12l-.63-.63a1.5 1.5 0 0 0-2.12 0l-1.09 1.09 2.75 2.75z"></path></svg>
                                    </button>
                                    <button type="button" class="reply-attachment-action" data-attachment-remove-index="${index}" aria-label="미디어 삭제하기">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        `,
                    )
                    .join("")}
            </div>
        `;
        replyAttachmentPreview.hidden = false;
        syncMediaAltTrigger();
        syncUserTagTrigger();
    }

    function resetReplyAttachment() {
        attachedReplyFiles = [];
        replyMediaEdits = [];
        pendingReplyMediaEdits = [];
        activeReplyMediaIndex = 0;
        revokeReplyAttachmentUrls();
        if (replyFileInput) {
            replyFileInput.value = "";
        }
        renderReplyAttachmentPreview();
    }

    function syncReplyMediaEditsToAttachments() {
        replyMediaEdits = attachedReplyFiles.map((file, index) => ({
            id: `${file.name}-${index}`,
            alt: replyMediaEdits[index]?.alt ?? "",
        }));
        pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        renderReplyAttachmentPreview();
    }

    function handleReplyFileChange(event) {
        const files = Array.from(event.target.files || []).filter((file) =>
            file.type.startsWith("image/"),
        );
        if (files.length === 0) {
            return;
        }
        attachedReplyFiles = [...attachedReplyFiles, ...files].slice(0, maxReplyImages);
        syncReplyMediaEditsToAttachments();
        syncReplySubmitState();
    }

    function removeReplyAttachment(index) {
        attachedReplyFiles = attachedReplyFiles.filter((_, fileIndex) => fileIndex !== index);
        syncReplyMediaEditsToAttachments();
        syncReplySubmitState();
    }

    function renderMediaEditor() {
        const entry = pendingReplyMediaEdits[activeReplyMediaIndex];
        const url = attachedReplyFileUrls[activeReplyMediaIndex];
        if (!entry || !url || !replyMediaPreviewImage || !replyMediaAltInput || !replyMediaAltCount) {
            return;
        }
        replyMediaPreviewImage.src = url;
        replyMediaPreviewImage.alt = entry.alt;
        replyMediaAltInput.value = entry.alt;
        replyMediaAltCount.textContent = `${replyMediaAltInput.value.length} / 1,000`;
        if (replyMediaTitle) {
            replyMediaTitle.textContent = `이미지 설명 수정 (${activeReplyMediaIndex + 1}/${pendingReplyMediaEdits.length || 1})`;
        }
        if (replyMediaPrevButton) {
            replyMediaPrevButton.disabled = activeReplyMediaIndex <= 0;
        }
        if (replyMediaNextButton) {
            replyMediaNextButton.disabled = activeReplyMediaIndex >= pendingReplyMediaEdits.length - 1;
        }
    }

    function openMediaEditor() {
        if (!replyMediaView || attachedReplyFiles.length === 0) {
            return;
        }
        pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        activeReplyMediaIndex = 0;
        renderMediaEditor();
        if (replyComposeView) {
            replyComposeView.hidden = true;
        }
        replyMediaView.hidden = false;
    }

    function closeMediaEditor({ discardChanges = true, restoreFocus = true } = {}) {
        if (!replyMediaView) {
            return;
        }
        if (discardChanges) {
            pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        }
        replyMediaView.hidden = true;
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        if (restoreFocus) {
            replyModalEditor?.focus();
        }
    }

    function saveReplyMediaEdits() {
        replyMediaEdits = cloneReplyMediaEdits(pendingReplyMediaEdits);
        renderReplyAttachmentPreview();
        closeMediaEditor({ discardChanges: false });
    }

    function syncLocationUI() {
        const has = Boolean(selectedLocation);
        if (replyLocationName) {
            replyLocationName.textContent = selectedLocation || "";
        }
        if (replyLocationDisplayButton) {
            replyLocationDisplayButton.hidden = !has;
        }
        if (replyLocationDeleteButton) {
            replyLocationDeleteButton.hidden = !has;
        }
        if (replyLocationCompleteButton) {
            replyLocationCompleteButton.disabled = !pendingLocation;
        }
        if (replyGeoButtonPath) {
            replyGeoButtonPath.setAttribute(
                "d",
                has
                    ? replyGeoButtonPath.dataset.pathActive ||
                          replyGeoButtonPath.getAttribute("d")
                    : replyGeoButtonPath.dataset.pathInactive ||
                          replyGeoButtonPath.getAttribute("d"),
            );
        }
    }

    function renderLocationList() {
        if (!replyLocationList) {
            return;
        }
        const query = replyLocationSearchInput?.value.trim() ?? "";
        const filtered = locationOptions.filter((location) =>
            location.includes(query),
        );
        replyLocationList.innerHTML = filtered.length
            ? filtered
                  .map(
                      (location) => `
                        <button type="button" class="tweet-modal__location-item" role="menuitem">
                            <span class="tweet-modal__location-item-label">${escapeHtml(location)}</span>
                        </button>
                    `,
                  )
                  .join("")
            : '<p class="tweet-modal__location-empty">검색 결과가 없습니다.</p>';
    }

    function applyLocation(location) {
        selectedLocation = location;
        pendingLocation = location;
        syncLocationUI();
    }

    function resetLocationState() {
        selectedLocation = null;
        pendingLocation = null;
        syncLocationUI();
    }

    function openLocationPanel() {
        if (!replyLocationView) {
            return;
        }
        pendingLocation = selectedLocation;
        renderLocationList();
        if (replyComposeView) {
            replyComposeView.hidden = true;
        }
        replyLocationView.hidden = false;
        window.setTimeout(() => replyLocationSearchInput?.focus(), 0);
    }

    function closeLocationPanel({ restoreFocus = true } = {}) {
        if (!replyLocationView) {
            return;
        }
        replyLocationView.hidden = true;
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        if (replyLocationSearchInput) {
            replyLocationSearchInput.value = "";
        }
        renderLocationList();
        if (restoreFocus) {
            replyModalEditor?.focus();
        }
    }

    function getCurrentPageTagUsers() {
        return [
            {
                id: "self",
                name: "나",
                handle: "@me",
                avatar: getCurrentAccountAvatar(),
            },
            ...bookmarkPostsData.map((post) => ({
                id: post.id,
                name: post.name,
                handle: post.handle,
                avatar:
                    post.avatarImage ||
                    buildShareAvatarDataUri(post.avatarText || post.name.charAt(0)),
            })),
        ];
    }

    function renderTagChipList() {
        if (!replyTagChipList) {
            return;
        }
        replyTagChipList.innerHTML = pendingTaggedUsers
            .map(
                (user) => `
                    <button type="button" class="tweet-modal__tag-chip" data-tag-remove-id="${escapeHtml(user.id)}">
                        <span class="tweet-modal__tag-chip-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span>
                        <span class="tweet-modal__tag-chip-name">${escapeHtml(user.name)}</span>
                    </button>
                `,
            )
            .join("");
    }

    function renderTagResults(users) {
        if (!replyTagResults) {
            return;
        }
        replyTagResults.innerHTML = users.length
            ? users
                  .map(
                      (user) => `
                        <button type="button" class="tweet-modal__tag-user" data-tag-user-id="${escapeHtml(user.id)}">
                            <span class="tweet-modal__tag-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span>
                            <span class="tweet-modal__tag-user-body">
                                <span class="tweet-modal__tag-user-name">${escapeHtml(user.name)}</span>
                                <span class="tweet-modal__tag-user-handle">${escapeHtml(user.handle)}</span>
                            </span>
                        </button>
                    `,
                  )
                  .join("")
            : '<p class="tweet-modal__tag-empty">검색 결과가 없습니다.</p>';
    }

    function runTagSearch() {
        const query = replyTagSearchInput?.value.trim().toLowerCase() ?? "";
        const selectedIds = new Set(pendingTaggedUsers.map((user) => user.id));
        currentTagResults = getCurrentPageTagUsers().filter((user) => {
            if (selectedIds.has(user.id)) {
                return false;
            }
            return (
                user.name.toLowerCase().includes(query) ||
                user.handle.toLowerCase().includes(query)
            );
        });
        renderTagResults(currentTagResults);
    }

    function applyPendingTaggedUsers() {
        selectedTaggedUsers = pendingTaggedUsers.map((user) => ({ ...user }));
        syncUserTagTrigger();
    }

    function resetTaggedUsers() {
        selectedTaggedUsers = [];
        pendingTaggedUsers = [];
        currentTagResults = [];
        renderTagChipList();
        renderTagResults([]);
    }

    function openTagPanel() {
        if (!replyTagView || attachedReplyFiles.length === 0) {
            return;
        }
        pendingTaggedUsers = selectedTaggedUsers.map((user) => ({ ...user }));
        renderTagChipList();
        runTagSearch();
        if (replyComposeView) {
            replyComposeView.hidden = true;
        }
        replyTagView.hidden = false;
        window.setTimeout(() => replyTagSearchInput?.focus(), 0);
    }

    function closeTagPanel({ restoreFocus = true } = {}) {
        if (!replyTagView) {
            return;
        }
        replyTagView.hidden = true;
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        if (replyTagSearchInput) {
            replyTagSearchInput.value = "";
        }
        renderTagResults([]);
        if (restoreFocus) {
            replyModalEditor?.focus();
        }
    }

    function getDraftItems() {
        return Array.from(replyDraftList?.querySelectorAll(".draft-panel__item") ?? []);
    }

    function getDraftItemId(item, index) {
        if (!item.dataset.replyDraftId) {
            item.dataset.replyDraftId = `reply-draft-${index}`;
        }
        return item.dataset.replyDraftId;
    }

    function renderDraftPanel() {
        const items = getDraftItems();
        const hasItems = items.length > 0;
        if (replyDraftActionButton) {
            replyDraftActionButton.textContent = draftPanelState.isEditMode ? "완료" : "수정";
            replyDraftActionButton.classList.toggle("draft-panel__action--done", draftPanelState.isEditMode);
            replyDraftActionButton.disabled = !hasItems;
        }
        items.forEach((item, index) => {
            const draftId = getDraftItemId(item, index);
            const isSelected = draftPanelState.selectedItems.has(draftId);
            item.querySelector(".draft-panel__checkbox")?.remove();
            item.classList.toggle("draft-panel__item--selectable", draftPanelState.isEditMode);
            if (draftPanelState.isEditMode) {
                const checkbox = document.createElement("span");
                checkbox.className = `draft-panel__checkbox${isSelected ? " draft-panel__checkbox--checked" : ""}`;
                checkbox.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9.86 18a1 1 0 01-.73-.31l-3.9-4.11 1.45-1.38 3.2 3.38 7.46-8.1 1.47 1.36-8.19 8.9A1 1 0 019.86 18z"></path></svg>';
                item.prepend(checkbox);
            }
        });
        if (replyDraftEmpty) {
            replyDraftEmpty.hidden = hasItems;
        }
        if (replyDraftFooter) {
            replyDraftFooter.hidden = !draftPanelState.isEditMode;
            replyDraftFooter.style.display = draftPanelState.isEditMode ? "flex" : "none";
        }
        if (replyDraftDeleteButton) {
            replyDraftDeleteButton.disabled = draftPanelState.selectedItems.size === 0;
        }
        if (replyDraftConfirmOverlay) {
            replyDraftConfirmOverlay.hidden = !draftPanelState.confirmOpen;
            replyDraftConfirmOverlay.style.display = draftPanelState.confirmOpen ? "flex" : "none";
        }
        if (replyDraftSelectAllButton) {
            replyDraftSelectAllButton.textContent =
                items.length > 0 && draftPanelState.selectedItems.size === items.length
                    ? "모두 선택 해제"
                    : "모두 선택";
        }
    }

    function openDraftPanel() {
        if (!replyDraftView) {
            return;
        }
        renderDraftPanel();
        if (replyComposeView) {
            replyComposeView.hidden = true;
        }
        replyDraftView.hidden = false;
    }

    function closeDraftPanel({ restoreFocus = true } = {}) {
        if (!replyDraftView) {
            return;
        }
        draftPanelState.isEditMode = false;
        draftPanelState.confirmOpen = false;
        draftPanelState.selectedItems.clear();
        renderDraftPanel();
        replyDraftView.hidden = true;
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        if (restoreFocus) {
            replyModalEditor?.focus();
        }
    }

    function loadDraftIntoComposer(item) {
        if (!replyModalEditor) {
            return;
        }
        replyModalEditor.textContent = getTextContent(
            item.querySelector(".draft-panel__text"),
        );
        closeDraftPanel({ restoreFocus: false });
        syncReplySubmitState();
        placeCaretAtEnd(replyModalEditor);
    }

    function updateReplyCount(button) {
        const countElement = button.querySelector("span");
        if (!countElement) {
            return;
        }
        const nextCount = (Number.parseInt(countElement.textContent || "0", 10) || 0) + 1;
        countElement.textContent = String(nextCount);
        button.setAttribute("aria-label", `답글 ${nextCount}`);
    }

    function getReplySourceText(postCard) {
        const textElement = postCard?.querySelector("[data-expandable-text]");
        return (
            textElement?.dataset.fullText ||
            getTextContent(textElement).replace(/더보기$/, "").trim() ||
            "게시물에 답글을 작성해 보세요."
        );
    }

    function getReplyAvatar(postCard, fallbackLabel) {
        return (
            postCard?.querySelector(".bookmark-post-avatar img")?.getAttribute("src") ||
            buildShareAvatarDataUri(fallbackLabel || "?")
        );
    }

    function syncReplySubmitState() {
        if (!replyModalSubmit || !replyModalEditor) {
            return;
        }
        const currentLength = Math.min(getTextContent(replyModalEditor).length, replyMaxLength);
        const remaining = Math.max(replyMaxLength - currentLength, 0);
        const canSubmit = currentLength > 0 || attachedReplyFiles.length > 0;
        replyModalSubmit.disabled = !canSubmit;
        if (replyGauge) {
            replyGauge.style.setProperty(
                "--gauge-progress",
                `${Math.min(currentLength / replyMaxLength, 1) * 360}deg`,
            );
            replyGauge.setAttribute("aria-valuenow", String(currentLength));
        }
        if (replyGaugeText) {
            replyGaugeText.textContent = String(remaining);
        }
    }

    function populateReplyModal(button) {
        const postCard = button.closest(".bookmark-post");
        if (!postCard) {
            return;
        }
        const name = getTextContent(postCard.querySelector(".bookmark-post-name")) || "사용자";
        const handle = getTextContent(postCard.querySelector(".bookmark-post-handle")) || "@user";
        const time = getTextContent(postCard.querySelector(".bookmark-post-time")) || "방금 전";
        const text = getReplySourceText(postCard);
        const avatar = getReplyAvatar(postCard, name.charAt(0));

        if (replyModalTarget) {
            replyModalTarget.textContent = `${handle} 님에게 보내는 답글`;
        }
        if (replySourceAvatar) {
            replySourceAvatar.src = avatar;
            replySourceAvatar.alt = name;
        }
        if (replyComposerAvatar) {
            replyComposerAvatar.src = avatar;
            replyComposerAvatar.alt = name;
        }
        if (replySourceName) {
            replySourceName.textContent = name;
        }
        if (replySourceHandle) {
            replySourceHandle.textContent = handle;
        }
        if (replySourceTime) {
            replySourceTime.textContent = time;
        }
        if (replySourceText) {
            replySourceText.textContent = text;
        }
    }

    function canCloseReplyModal() {
        return (
            (!hasReplyEditorText() && attachedReplyFiles.length === 0) ||
            window.confirm("게시물을 삭제하시겠어요?")
        );
    }

    function removeBookmarkedPost(postId) {
        const index = bookmarkPostsData.findIndex((post) => post.id === postId);
        if (index === -1) {
            return false;
        }
        bookmarkPostsData.splice(index, 1);
        renderBookmarkPosts();
        showToast("북마크에서 삭제했습니다");
        return true;
    }

    function updateBodyScrollLock() {
        const shouldLock =
            Boolean(activeShareModal) ||
            bookmarkModal?.classList.contains("is-open") ||
            bookmarkEditModal?.classList.contains("is-open") ||
            bookmarkDeleteModal?.classList.contains("is-open") ||
            replyModalOverlay?.hidden === false ||
            mediaPreviewOverlay?.hidden === false;
        document.body.classList.toggle("modal-open", shouldLock);
    }

    function closeMediaPreview() {
        if (!mediaPreviewOverlay || !mediaPreviewImage) {
            return;
        }
        mediaPreviewOverlay.hidden = true;
        mediaPreviewImage.removeAttribute("src");
        mediaPreviewImage.removeAttribute("alt");
        updateBodyScrollLock();
    }

    function openReplyModal(button) {
        if (!replyModalOverlay || !replyModalEditor || !replyModalSubmit) {
            return;
        }
        closePostMenus();
        activeReplyButton = button;
        syncReplyAvatars();
        populateReplyModal(button);
        closeEmojiPicker();
        replyModalEditor.textContent = "";
        savedReplySelection = null;
        pendingReplyFormats = new Set();
        activeEmojiCategory = "recent";
        resetLocationState();
        resetTaggedUsers();
        resetReplyAttachment();
        if (replyEmojiSearchInput) {
            replyEmojiSearchInput.value = "";
        }
        if (replyLocationSearchInput) {
            replyLocationSearchInput.value = "";
        }
        if (replyTagSearchInput) {
            replyTagSearchInput.value = "";
        }
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        if (replyLocationView) {
            replyLocationView.hidden = true;
        }
        if (replyTagView) {
            replyTagView.hidden = true;
        }
        if (replyMediaView) {
            replyMediaView.hidden = true;
        }
        closeDraftPanel({ restoreFocus: false });
        renderDraftPanel();
        renderLocationList();
        syncReplySubmitState();
        syncReplyFormatButtons();
        replyModalOverlay.hidden = false;
        updateBodyScrollLock();
        window.setTimeout(() => replyModalEditor.focus(), 0);
    }

    function closeReplyModal({ skipConfirm = false, restoreFocus = true } = {}) {
        if (!replyModalOverlay || !replyModalEditor || !replyModalSubmit) {
            return;
        }
        if (!skipConfirm && !canCloseReplyModal()) {
            return;
        }
        replyModalOverlay.hidden = true;
        replyModalEditor.textContent = "";
        closeEmojiPicker();
        closeLocationPanel({ restoreFocus: false });
        closeTagPanel({ restoreFocus: false });
        closeMediaEditor({ restoreFocus: false });
        closeDraftPanel({ restoreFocus: false });
        if (replyComposeView) {
            replyComposeView.hidden = false;
        }
        resetLocationState();
        resetTaggedUsers();
        resetReplyAttachment();
        renderLocationList();
        syncReplySubmitState();
        syncReplyFormatButtons();
        if (restoreFocus) {
            activeReplyButton?.focus();
        }
        activeReplyButton = null;
        updateBodyScrollLock();
    }

    function openBookmarkDetail(folderName) {
        if (!listView || !detailView || isDetailViewOpen || currentFolderDeleted) {
            return;
        }
        currentFolderName = folderName || currentFolderName;
        syncFolderNameUI();
        renderBookmarkPosts();
        isDetailViewOpen = true;
        listView.hidden = true;
        detailView.hidden = false;
        modalOpenButton?.setAttribute("hidden", "");
        detailMoreButton?.removeAttribute("hidden");
        setHeaderTitle(currentFolderName);
        window.scrollTo({ top: 0, behavior: "auto" });
    }

    function closeBookmarkDetail() {
        if (!listView || !detailView || !isDetailViewOpen) {
            return;
        }
        isDetailViewOpen = false;
        closePostMenus();
        closeReplyModal();
        closeMediaPreview();
        listView.hidden = false;
        detailView.hidden = true;
        modalOpenButton?.removeAttribute("hidden");
        detailMoreButton?.setAttribute("hidden", "");
        setHeaderTitle(defaultHeaderTitle);
    }

    syncFolderNameUI();

    if (backButton) {
        backButton.addEventListener("click", () => {
            if (isDetailViewOpen) {
                closeBookmarkDetail();
                return;
            }
            window.history.back();
        });
    }

    document.addEventListener("click", (event) => {
        const folderButton = event.target.closest("[data-bookmark-folder]");
        if (folderButton) {
            openBookmarkDetail(folderButton.dataset.bookmarkFolder || "북마크");
            return;
        }
    });

    if (detailMoreButton) {
        detailMoreButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (detailFolderMenu && !detailFolderMenu.hidden) {
                closeDetailFolderMenu();
                return;
            }
            openDetailFolderMenu();
        });
    }

    if (searchInput && searchBox) {
        const syncSearchState = () => {
            searchBox.classList.toggle(
                "is-active",
                document.activeElement === searchInput ||
                    searchInput.value.trim().length > 0,
            );
        };
        searchInput.addEventListener("focus", syncSearchState);
        searchInput.addEventListener("blur", syncSearchState);
        searchInput.addEventListener("input", syncSearchState);
        syncSearchState();
    }

    if (
        modalOpenButton &&
        bookmarkModal &&
        modalCloseButton &&
        modalSubmitButton &&
        folderNameInput &&
        folderNameCount
    ) {
        function updateModalState() {
            const value = folderNameInput.value.trim();
            folderNameCount.textContent = `${folderNameInput.value.length} / 25`;
            modalSubmitButton.disabled = value.length === 0;
        }

        function resetModalForm() {
            folderNameInput.value = "";
            updateModalState();
        }

        function closeModal({ reset = true } = {}) {
            bookmarkModal.classList.remove("is-open");
            bookmarkModal.setAttribute("aria-hidden", "true");
            if (reset) {
                resetModalForm();
            }
            updateBodyScrollLock();
        }

        function openModal() {
            resetModalForm();
            bookmarkModal.classList.add("is-open");
            bookmarkModal.setAttribute("aria-hidden", "false");
            updateBodyScrollLock();
            window.setTimeout(() => folderNameInput.focus(), 0);
        }

        modalOpenButton.addEventListener("click", openModal);
        modalCloseButton.addEventListener("click", () => closeModal());
        bookmarkModal.addEventListener("click", (event) => {
            if (event.target === bookmarkModal) {
                closeModal({ reset: false });
            }
        });
        folderNameInput.addEventListener("input", updateModalState);
        modalSubmitButton.addEventListener("click", () => {
            const value = folderNameInput.value.trim();
            if (!value) {
                return;
            }
            showToast(`${value} 폴더를 만들었습니다`);
            closeModal();
        });
    }

    if (
        bookmarkEditModal &&
        editModalCloseButton &&
        editModalSubmitButton &&
        editFolderNameInput &&
        editFolderNameCount
    ) {
        function updateEditModalState() {
            const value = editFolderNameInput.value.trim();
            editFolderNameCount.textContent = `${editFolderNameInput.value.length} / 25`;
            editModalSubmitButton.disabled =
                value.length === 0 || value === currentFolderName;
        }

        function resetEditModalForm() {
            editFolderNameInput.value = currentFolderName;
            updateEditModalState();
        }

        function closeEditModal() {
            bookmarkEditModal.classList.remove("is-open");
            bookmarkEditModal.setAttribute("aria-hidden", "true");
            updateBodyScrollLock();
        }

        function openEditModal() {
            closeDetailFolderMenu();
            resetEditModalForm();
            bookmarkEditModal.classList.add("is-open");
            bookmarkEditModal.setAttribute("aria-hidden", "false");
            updateBodyScrollLock();
            window.setTimeout(() => {
                editFolderNameInput.focus();
                editFolderNameInput.select();
            }, 0);
        }

        detailFolderEditButton?.addEventListener("click", () => {
            openEditModal();
        });
        editModalDeleteButton?.addEventListener("click", () => {
            closeEditModal();
            openDeleteModal();
        });
        editModalCloseButton.addEventListener("click", closeEditModal);
        bookmarkEditModal.addEventListener("click", (event) => {
            if (event.target === bookmarkEditModal) {
                closeEditModal();
            }
        });
        editFolderNameInput.addEventListener("input", updateEditModalState);
        editModalSubmitButton.addEventListener("click", () => {
            const value = editFolderNameInput.value.trim();
            if (!value || value === currentFolderName) {
                return;
            }
            currentFolderName = value;
            syncFolderNameUI();
            setHeaderTitle(value);
            closeEditModal();
            showToast("폴더를 수정했습니다");
        });
    }

    if (
        bookmarkDeleteModal &&
        deleteModalSubmitButton &&
        deleteModalCancelButton
    ) {
        deleteModalSubmitButton.addEventListener("click", deleteCurrentFolder);
        deleteModalCancelButton.addEventListener("click", closeDeleteModal);
        bookmarkDeleteModal.addEventListener("click", (event) => {
            if (event.target === bookmarkDeleteModal) {
                closeDeleteModal();
            }
        });
    }

    if (replyModalEditor && replyModalSubmit) {
        renderLocationList();
        syncLocationUI();
        syncReplyAvatars();
        renderDraftPanel();
        syncMediaAltTrigger();
        syncUserTagTrigger();

        replyModalEditor.addEventListener("input", () => {
            applyPendingReplyFormatsToContent();
            if (!hasReplyEditorText()) {
                pendingReplyFormats = new Set();
            }
            syncReplySubmitState();
            syncReplyFormatButtons();
        });
        replyModalEditor.addEventListener("keyup", saveReplySelection);
        replyModalEditor.addEventListener("mouseup", saveReplySelection);
        replyModalEditor.addEventListener("focus", saveReplySelection);
        replyModalEditor.addEventListener("keydown", (event) => {
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

        document.addEventListener("selectionchange", () => {
            if (replyModalOverlay?.hidden || !replyModalEditor) {
                return;
            }
            saveReplySelection();
            syncReplyFormatButtons();
        });

        document.querySelectorAll("[data-format]").forEach((button) => {
            button.addEventListener("mousedown", (event) => event.preventDefault());
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const format = button.getAttribute("data-format");
                if (format) {
                    applyReplyFormat(format);
                }
            });
        });

        replyEmojiButton?.addEventListener("mousedown", (event) =>
            event.preventDefault(),
        );
        replyEmojiButton?.addEventListener("click", (event) => {
            event.preventDefault();
            toggleEmojiPicker();
        });
        replyEmojiSearchInput?.addEventListener("input", renderEmojiPicker);
        replyEmojiTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const category = tab.dataset.emojiCategory;
                if (!category) {
                    return;
                }
                activeEmojiCategory = category;
                renderEmojiPicker();
            });
        });
        replyEmojiContent?.addEventListener("mousedown", (event) => {
            if (
                event.target.closest(
                    ".tweet-modal__emoji-option, .tweet-modal__emoji-clear",
                )
            ) {
                event.preventDefault();
            }
        });
        replyEmojiContent?.addEventListener("click", (event) => {
            if (event.target.closest("[data-action='clear-recent']")) {
                clearRecentEmojis();
                activeEmojiCategory = "recent";
                renderEmojiPicker();
                return;
            }
            const emojiButton = event.target.closest(".tweet-modal__emoji-option");
            const emoji = emojiButton?.getAttribute("data-emoji");
            if (!emoji) {
                return;
            }
            insertReplyEmoji(emoji);
            closeEmojiPicker();
        });

        replyMediaUploadButton?.addEventListener("click", (event) => {
            event.preventDefault();
            replyFileInput?.click();
        });
        replyFileInput?.addEventListener("change", handleReplyFileChange);
        replyAttachmentMedia?.addEventListener("click", (event) => {
            const removeButton = event.target.closest("[data-attachment-remove-index]");
            if (removeButton) {
                removeReplyAttachment(
                    Number.parseInt(
                        removeButton.getAttribute("data-attachment-remove-index") || "-1",
                        10,
                    ),
                );
                return;
            }
            const editButton = event.target.closest("[data-attachment-edit-index]");
            if (editButton) {
                activeReplyMediaIndex = Number.parseInt(
                    editButton.getAttribute("data-attachment-edit-index") || "0",
                    10,
                );
                openMediaEditor();
            }
        });

        replyGeoButton?.addEventListener("click", (event) => {
            event.preventDefault();
            openLocationPanel();
        });
        replyLocationDisplayButton?.addEventListener("click", (event) => {
            event.preventDefault();
            openLocationPanel();
        });
        replyLocationCloseButton?.addEventListener("click", () =>
            closeLocationPanel(),
        );
        replyLocationDeleteButton?.addEventListener("click", () => {
            resetLocationState();
            closeLocationPanel();
        });
        replyLocationCompleteButton?.addEventListener("click", () => {
            if (pendingLocation) {
                applyLocation(pendingLocation);
                closeLocationPanel();
            }
        });
        replyLocationSearchInput?.addEventListener("input", renderLocationList);
        replyLocationList?.addEventListener("click", (event) => {
            const locationButton = event.target.closest(".tweet-modal__location-item");
            const location = getTextContent(
                locationButton?.querySelector(".tweet-modal__location-item-label"),
            );
            if (!location) {
                return;
            }
            applyLocation(location);
            closeLocationPanel();
        });

        replyUserTagTrigger?.addEventListener("click", (event) => {
            event.preventDefault();
            openTagPanel();
        });
        replyTagCloseButton?.addEventListener("click", () => closeTagPanel());
        replyTagCompleteButton?.addEventListener("click", () => {
            applyPendingTaggedUsers();
            closeTagPanel();
        });
        replyTagSearchForm?.addEventListener("submit", (event) =>
            event.preventDefault(),
        );
        replyTagSearchInput?.addEventListener("input", runTagSearch);
        replyTagChipList?.addEventListener("click", (event) => {
            const chip = event.target.closest("[data-tag-remove-id]");
            const userId = chip?.getAttribute("data-tag-remove-id");
            if (!userId) {
                return;
            }
            pendingTaggedUsers = pendingTaggedUsers.filter((user) => user.id !== userId);
            renderTagChipList();
            runTagSearch();
            replyTagSearchInput?.focus();
        });
        replyTagResults?.addEventListener("click", (event) => {
            const userButton = event.target.closest("[data-tag-user-id]");
            const userId = userButton?.getAttribute("data-tag-user-id");
            if (!userId) {
                return;
            }
            const user = currentTagResults.find((entry) => entry.id === userId);
            if (!user) {
                return;
            }
            pendingTaggedUsers = [...pendingTaggedUsers, { ...user }];
            renderTagChipList();
            if (replyTagSearchInput) {
                replyTagSearchInput.value = "";
            }
            runTagSearch();
        });

        replyMediaAltTrigger?.addEventListener("click", (event) => {
            event.preventDefault();
            openMediaEditor();
        });
        replyMediaBackButton?.addEventListener("click", () => closeMediaEditor());
        replyMediaSaveButton?.addEventListener("click", saveReplyMediaEdits);
        replyMediaPrevButton?.addEventListener("click", () => {
            if (activeReplyMediaIndex <= 0) {
                return;
            }
            activeReplyMediaIndex -= 1;
            renderMediaEditor();
        });
        replyMediaNextButton?.addEventListener("click", () => {
            if (activeReplyMediaIndex >= pendingReplyMediaEdits.length - 1) {
                return;
            }
            activeReplyMediaIndex += 1;
            renderMediaEditor();
        });
        replyMediaAltInput?.addEventListener("input", () => {
            const entry = pendingReplyMediaEdits[activeReplyMediaIndex];
            if (!entry) {
                return;
            }
            entry.alt = replyMediaAltInput.value.slice(0, maxReplyMediaAltLength);
            renderMediaEditor();
        });

        replyDraftButton?.addEventListener("click", (event) => {
            event.preventDefault();
            openDraftPanel();
        });
        replyDraftBackButton?.addEventListener("click", (event) => {
            event.preventDefault();
            closeDraftPanel();
        });
        replyDraftActionButton?.addEventListener("click", (event) => {
            event.preventDefault();
            draftPanelState.isEditMode = !draftPanelState.isEditMode;
            if (!draftPanelState.isEditMode) {
                draftPanelState.selectedItems.clear();
                draftPanelState.confirmOpen = false;
            }
            renderDraftPanel();
        });
        replyDraftSelectAllButton?.addEventListener("click", (event) => {
            event.preventDefault();
            const items = getDraftItems();
            if (items.length === draftPanelState.selectedItems.size) {
                draftPanelState.selectedItems.clear();
            } else {
                draftPanelState.selectedItems = new Set(
                    items.map((item, index) => getDraftItemId(item, index)),
                );
            }
            renderDraftPanel();
        });
        replyDraftDeleteButton?.addEventListener("click", (event) => {
            event.preventDefault();
            draftPanelState.confirmOpen = true;
            renderDraftPanel();
        });
        replyDraftConfirmDeleteButton?.addEventListener("click", () => {
            getDraftItems().forEach((item, index) => {
                const draftId = getDraftItemId(item, index);
                if (draftPanelState.selectedItems.has(draftId)) {
                    item.remove();
                }
            });
            draftPanelState.confirmOpen = false;
            draftPanelState.selectedItems.clear();
            renderDraftPanel();
        });
        replyDraftConfirmCancelButton?.addEventListener("click", () => {
            draftPanelState.confirmOpen = false;
            renderDraftPanel();
        });
        replyDraftConfirmOverlay?.addEventListener("click", (event) => {
            if (
                event.target === replyDraftConfirmOverlay ||
                event.target.closest(".draft-panel__confirm-backdrop")
            ) {
                draftPanelState.confirmOpen = false;
                renderDraftPanel();
            }
        });
        replyDraftList?.addEventListener("click", (event) => {
            const item = event.target.closest(".draft-panel__item");
            if (!item) {
                return;
            }
            if (draftPanelState.isEditMode) {
                const draftId = getDraftItemId(
                    item,
                    getDraftItems().indexOf(item),
                );
                if (draftPanelState.selectedItems.has(draftId)) {
                    draftPanelState.selectedItems.delete(draftId);
                } else {
                    draftPanelState.selectedItems.add(draftId);
                }
                renderDraftPanel();
                return;
            }
            loadDraftIntoComposer(item);
        });

        replyModalClose?.addEventListener("click", closeReplyModal);
        replyModalOverlay?.addEventListener("click", (event) => {
            if (event.target === replyModalOverlay) {
                closeReplyModal();
            }
        });
        replyModalOverlay?.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") {
                return;
            }
            event.preventDefault();
            if (replyMediaView && !replyMediaView.hidden) {
                closeMediaEditor();
                return;
            }
            if (replyTagView && !replyTagView.hidden) {
                closeTagPanel();
                return;
            }
            if (replyLocationView && !replyLocationView.hidden) {
                closeLocationPanel();
                return;
            }
            if (replyDraftConfirmOverlay && !replyDraftConfirmOverlay.hidden) {
                draftPanelState.confirmOpen = false;
                renderDraftPanel();
                return;
            }
            if (replyDraftView && !replyDraftView.hidden) {
                closeDraftPanel();
                return;
            }
            closeReplyModal();
        });
        replyModalSubmit.addEventListener("click", () => {
            if (!activeReplyButton || replyModalSubmit.disabled) {
                return;
            }
            updateReplyCount(activeReplyButton);
            showToast("답글을 게시했습니다");
            closeReplyModal({ skipConfirm: true });
        });
    }

    mediaPreviewClose?.addEventListener("click", closeMediaPreview);
    mediaPreviewOverlay?.addEventListener("click", (event) => {
        if (event.target === mediaPreviewOverlay) {
            closeMediaPreview();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            replyEmojiPicker &&
            !replyEmojiPicker.hidden &&
            !replyEmojiPicker.contains(event.target) &&
            !replyEmojiButton?.contains(event.target)
        ) {
            closeEmojiPicker();
        }
    });

    window.addEventListener("resize", () => {
        if (replyEmojiPicker && !replyEmojiPicker.hidden) {
            updateEmojiPickerPosition();
        }
    });

    window.addEventListener(
        "scroll",
        () => {
            if (replyEmojiPicker && !replyEmojiPicker.hidden) {
                updateEmojiPickerPosition();
            }
        },
        { passive: true },
    );

    document.addEventListener("click", (event) => {
        const target = event.target;
        const mediaTarget = target.closest("[data-media-preview='true']");
        if (mediaTarget && mediaPreviewOverlay && mediaPreviewImage) {
            mediaPreviewImage.src = mediaTarget.getAttribute("src") || "";
            mediaPreviewImage.alt =
                mediaTarget.getAttribute("alt") || "게시물 이미지 미리보기";
            mediaPreviewOverlay.hidden = false;
            updateBodyScrollLock();
            return;
        }

        const moreButton = target.closest("[data-post-more]");
        if (moreButton) {
            const menu =
                moreButton.parentElement?.querySelector(".bookmark-post-more-menu");
            const willOpen = Boolean(menu?.hidden);
            closeShareDropdown();
            document
                .querySelectorAll(".bookmark-post-more-menu")
                .forEach((node) => (node.hidden = true));
            document
                .querySelectorAll("[data-post-more]")
                .forEach((node) => node.setAttribute("aria-expanded", "false"));
            if (menu && willOpen) {
                menu.hidden = false;
                moreButton.setAttribute("aria-expanded", "true");
            }
            return;
        }

        const moreMenuItem = target.closest(".bookmark-post-more-menu-item");
        if (moreMenuItem) {
            const label =
                moreMenuItem.querySelector("span")?.textContent?.trim() || "작업";
            closePostMenus();
            showToast(label);
            return;
        }

        const actionButton = target.closest(".bookmark-post-action[data-action]");
        if (actionButton) {
            const action = actionButton.dataset.action;
            const countNode = actionButton.querySelector("span");
            if (action !== "share") {
                closeShareDropdown();
            }

            if (action === "reply") {
                openReplyModal(actionButton);
                return;
            }

            if (action === "like") {
                const isActive = !actionButton.classList.contains("active");
                const path = actionButton.querySelector("path");
                const baseCount = Number.parseInt(
                    actionButton.dataset.baseCount || "0",
                    10,
                );
                const nextCount = isActive ? baseCount + 1 : baseCount;
                actionButton.classList.toggle("active", isActive);
                actionButton.setAttribute("aria-label", `마음 ${nextCount}`);
                if (countNode) {
                    countNode.textContent = String(nextCount);
                }
                if (path) {
                    path.setAttribute(
                        "d",
                        isActive
                            ? path.dataset.pathActive || path.getAttribute("d")
                            : path.dataset.pathInactive || path.getAttribute("d"),
                    );
                }
                return;
            }

            if (action === "bookmark") {
                if (actionButton.classList.contains("active")) {
                    removeBookmarkedPost(
                        actionButton.closest(".bookmark-post")?.dataset.postId || "",
                    );
                } else {
                    setBookmarkButtonState(actionButton, true);
                }
                return;
            }

            if (action === "share") {
                if (
                    activeShareButton === actionButton &&
                    activeShareDropdown
                ) {
                    closeShareDropdown();
                    return;
                }
                openShareDropdown(actionButton);
                return;
            }
        }

        if (!target.closest(".bookmark-dropdown-menu")) {
            closeShareDropdown();
        }

        if (
            !target.closest("#detailFolderMenu") &&
            !target.closest("#detailMoreButton")
        ) {
            closeDetailFolderMenu();
        }

        if (!target.closest(".bookmark-post-more-wrap")) {
            document
                .querySelectorAll(".bookmark-post-more-menu")
                .forEach((node) => (node.hidden = true));
            document
                .querySelectorAll("[data-post-more]")
                .forEach((node) => node.setAttribute("aria-expanded", "false"));
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }
        if (activeShareModal) {
            closeShareModal();
            updateBodyScrollLock();
            return;
        }
        if (bookmarkModal?.classList.contains("is-open")) {
            bookmarkModal.classList.remove("is-open");
            bookmarkModal.setAttribute("aria-hidden", "true");
            updateBodyScrollLock();
            return;
        }
        if (bookmarkEditModal?.classList.contains("is-open")) {
            bookmarkEditModal.classList.remove("is-open");
            bookmarkEditModal.setAttribute("aria-hidden", "true");
            updateBodyScrollLock();
            return;
        }
        if (bookmarkDeleteModal?.classList.contains("is-open")) {
            closeDeleteModal();
            return;
        }
        if (replyModalOverlay?.hidden === false) {
            closeReplyModal();
            return;
        }
        if (mediaPreviewOverlay?.hidden === false) {
            closeMediaPreview();
            return;
        }
        if (detailFolderMenu && !detailFolderMenu.hidden) {
            closeDetailFolderMenu();
            return;
        }
        if (activeShareDropdown) {
            closeShareDropdown();
            return;
        }
        const openedMenu = document.querySelector(".bookmark-post-more-menu:not([hidden])");
        if (openedMenu) {
            closePostMenus();
        }
    });

    window.addEventListener("resize", () => {
        if (detailFolderMenu && !detailFolderMenu.hidden) {
            positionDetailFolderMenu();
        }
    });

    window.addEventListener(
        "scroll",
        () => {
            if (detailFolderMenu && !detailFolderMenu.hidden) {
                positionDetailFolderMenu();
            }
        },
        true,
    );
})();
