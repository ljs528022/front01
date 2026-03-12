document.addEventListener("DOMContentLoaded", () => {
    /*
     * 이 파일은 setting.html 안의 설정 페이지 전체 상호작용을 담당한다.
     * 사용 위치:
     * - 좌측 설정 메뉴(`#settingsNavigationList`)
     * - 우측 상세 패널(`#settingsDetailTitle`, `#settingsDetailSummary`, `#settingsDetailList`)
     * - 표시 모달(`#appearanceModal`)
     * - 키보드 단축키 모달(`#shortcutModal`)
     *
     * 동작 구조:
     * 1. 문서에서 필요한 DOM을 한 번에 찾는다.
     * 2. 분석 문서 기준의 설정 데이터와 SVG path를 JS 데이터로 선언한다.
     * 3. 좌측 메뉴와 우측 상세 항목을 이 데이터로 렌더링한다.
     * 4. 검색, 섹션 선택, 모달 열기/닫기, 표시 테마 변경을 이벤트로 연결한다.
     */

    const navigationList = document.getElementById("settingsNavigationList");
    const searchInput = document.getElementById("settingsSearchInput");
    const detailBackButton = document.getElementById(
        "settingsDetailBackButton",
    );
    const detailTitle = document.getElementById("settingsDetailTitle");
    const detailActionButton = document.getElementById(
        "settingsDetailActionButton",
    );
    const detailContent = document.getElementById("settingsDetailContent");
    const detailSummary = document.getElementById("settingsDetailSummary");
    const detailList = document.getElementById("settingsDetailList");
    const modalLayer = document.getElementById("settingsModalLayer");
    const appearanceModal = document.getElementById("appearanceModal");
    const shortcutModal = document.getElementById("shortcutModal");
    const languageSelectionModal = document.getElementById(
        "languageSelectionModal",
    );
    const languageSelectionModalTitle = document.getElementById(
        "languageSelectionModalTitle",
    );
    const languageSelectionBackButton = document.getElementById(
        "languageSelectionBackButton",
    );
    const languageSelectionSummary = document.getElementById(
        "languageSelectionSummary",
    );
    const languageSelectionSearch = document.getElementById(
        "languageSelectionSearch",
    );
    const languageSelectionSearchInput = document.getElementById(
        "languageSelectionSearchInput",
    );
    const languageSelectionList = document.getElementById(
        "languageSelectionList",
    );
    const languageSelectionMoreButton = document.getElementById(
        "languageSelectionMoreButton",
    );
    const languageSelectionNextButton = document.getElementById(
        "languageSelectionNextButton",
    );
    const languageSelectionSkipButton = document.getElementById(
        "languageSelectionSkipButton",
    );
    const phoneAddModal = document.getElementById("phoneAddModal");
    const phoneVerifyModal = document.getElementById("phoneVerifyModal");
    const phoneAddInput = document.getElementById("phoneAddInput");
    const phoneAddCloseButton = document.getElementById("phoneAddCloseButton");
    const phoneAddActionButton = document.getElementById(
        "phoneAddActionButton",
    );
    const phoneAddStep = document.getElementById("phoneAddStep");
    const phoneCodeStep = document.getElementById("phoneCodeStep");
    const phoneCodeNumber = document.getElementById("phoneCodeNumber");
    const phoneCodeInput = document.getElementById("phoneCodeInput");
    const phoneCodeHelp = document.getElementById("phoneCodeHelp");
    const phoneCodeHelpButton = document.getElementById("phoneCodeHelpButton");
    const phoneCodeHelpMenu = document.getElementById("phoneCodeHelpMenu");
    const phoneCodeResendButton = document.getElementById(
        "phoneCodeResendButton",
    );
    const phoneCodeActionButton = document.getElementById(
        "phoneCodeActionButton",
    );
    const phoneVerifyNumber = document.getElementById("phoneVerifyNumber");
    const phoneVerifyConfirmButton = document.getElementById(
        "phoneVerifyConfirmButton",
    );
    const phoneVerifyEditButton = document.getElementById(
        "phoneVerifyEditButton",
    );
    const appearanceFontRange = document.getElementById("appearanceFontRange");
    const appearanceAccentList = document.getElementById(
        "appearanceAccentList",
    );
    const appearanceSurfaceList = document.getElementById(
        "appearanceSurfaceList",
    );
    const appearanceCompleteButton = document.getElementById(
        "appearanceCompleteButton",
    );

    if (
        !navigationList ||
        !searchInput ||
        !detailBackButton ||
        !detailTitle ||
        !detailActionButton ||
        !detailContent ||
        !detailSummary ||
        !detailList ||
        !modalLayer ||
        !appearanceModal ||
        !shortcutModal ||
        !languageSelectionModal ||
        !languageSelectionModalTitle ||
        !languageSelectionBackButton ||
        !languageSelectionSummary ||
        !languageSelectionSearch ||
        !languageSelectionSearchInput ||
        !languageSelectionList ||
        !languageSelectionMoreButton ||
        !languageSelectionNextButton ||
        !languageSelectionSkipButton ||
        !phoneAddModal ||
        !phoneVerifyModal ||
        !phoneAddInput ||
        !phoneAddCloseButton ||
        !phoneAddActionButton ||
        !phoneAddStep ||
        !phoneCodeStep ||
        !phoneCodeNumber ||
        !phoneCodeInput ||
        !phoneCodeHelp ||
        !phoneCodeHelpButton ||
        !phoneCodeHelpMenu ||
        !phoneCodeResendButton ||
        !phoneCodeActionButton ||
        !phoneVerifyNumber ||
        !phoneVerifyConfirmButton ||
        !phoneVerifyEditButton ||
        !appearanceFontRange ||
        !appearanceAccentList ||
        !appearanceSurfaceList ||
        !appearanceCompleteButton
    ) {
        return;
    }

    /*
     * SVG path 데이터는 분석 문서에 정리된 아이콘을 그대로 사용한다.
     * 오른쪽 상세 패널의 각 항목은 왼쪽 아이콘 + 텍스트 + 오른쪽 화살표 구조를 공통으로 공유한다.
     */
    const icons = {
        arrow: "M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z",
        external: "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
        account:
            "M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z",
        key: "M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z",
        download:
            "M2.01 17.5l-.11-1.1c-.26-2.66-1.16-4.89-2.63-6.46l-.01-.01C.64 8.35 2.65 7.5 5.01 7.5s4.37.85 5.86 2.44c1.48 1.58 2.37 3.8 2.63 6.46l.11 1.1h-11.6zM5.01 1c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm17 6.72L17.59 9.3l-4.42 4.42L17.59 18.14l4.42-4.42zM17.59 7.89l5.13 5.13-5.13 5.13-5.13-5.13 5.13-5.13z",
        deactivate:
            "M8.28 21.634l.496.278a.15.15 0 00.187-.026l1.043-1.09c.052-.055.04-.143-.023-.184l-1.782-1.15c-.064-.042-.153-.012-.178.061l-.42 1.219c-.026.075.01.152.083.186l.594.306zM21.078 3.48c-1.583-1.58-4.03-1.88-5.933-.9l-.32.165-2.723 7.53L3.72 18.66l3.72 2.4L21.08 7.42c.977-1.9.677-4.36-.903-5.94zM3.44 19.466l-.402-.26a.318.318 0 01-.1-.434l1.166-1.94 1.572 1.015-1.805 1.698a.315.315 0 01-.43-.079z",
        filter: "M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z",
        preferences:
            "M7 17h6v2H7v-2zm7.5-15C15.88 2 17 3.12 17 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-9C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h9zM5 19.5c0 .28.22.5.5.5h9c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-9c-.28 0-.5.22-.5.5v15zm15.74-3.49l1.64 1.15C23.4 15.7 24 13.92 24 12s-.6-3.7-1.62-5.16l-1.64 1.15C21.53 9.13 22 10.51 22 12s-.47 2.87-1.26 4.01zm-.82-7.45l-1.64 1.15c.45.65.72 1.43.72 2.29 0 .85-.27 1.64-.72 2.29l1.64 1.15C20.6 14.47 21 13.28 21 12s-.4-2.47-1.08-3.44z",
        accessibility:
            "M14.828 9.172c-1.315-1.315-3.326-1.522-4.86-.618L3.707 2.293 2.293 3.707l2.428 2.429c-2.478 2.421-3.606 5.376-3.658 5.513L.932 12l.131.351C1.196 12.704 4.394 21 12 21c2.063 0 3.989-.622 5.737-1.849l2.556 2.556 1.414-1.414-6.261-6.261c.904-1.534.698-3.545-.618-4.86zm-1.414 1.414c.522.522.695 1.264.518 1.932l-2.449-2.449c.669-.177 1.409-.005 1.931.517zM3.085 11.999c.107-.24.272-.588.497-1.002l7.993 7.992c-5.14-.279-7.85-5.563-8.489-6.989zm13.21 5.71c-.695.448-1.422.781-2.175.996L4.672 9.258c.412-.57.899-1.158 1.464-1.708l10.16 10.16h-.001zm6.772-5.71l-.131.352c-.062.164-.801 2.055-2.33 4.027l-1.438-1.438c.917-1.217 1.494-2.378 1.746-2.941-.658-1.467-3.5-7-8.915-7-.712 0-1.376.1-2 .27V3.223c.633-.131 1.291-.223 2-.223 7.605 0 10.804 8.296 10.937 8.648l.131.352z",
        display:
            "M18.36 2.62c-.14-.14-.32-.21-.5-.21h-.01c-.19 0-.37.08-.51.22l-1.76 1.82-3.18-1.49L6 9.36l3.66 3.66-6.36 6.36 1.42 1.42 6.36-6.36 3.66 3.66 6.4-6.4-1.49-3.18 1.82-1.76c.14-.14.22-.32.22-.51v-.01c0-.19-.07-.37-.21-.5l-3.12-3.12zM17 14.25L9.75 7l4.19-4.19 2.53 1.19-2.11 2.18 3.47 3.47 2.18-2.11 1.19 2.53L17 14.25z",
        language:
            "M11.999 22.25c-5.652 0-10.25-4.598-10.25-10.25S6.347 1.75 11.999 1.75 22.249 6.348 22.249 12s-4.598 10.25-10.25 10.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25-3.701-8.25-8.25-8.25zM13.21 6.134c.57 1.242.928 2.726 1.027 4.366H9.762c.1-1.64.457-3.124 1.027-4.366.526-1.148 1.134-1.822 1.71-1.884.058-.006.166-.006.224 0 .577.062 1.185.736 1.711 1.884h-.224zm-4.451 4.366c.103-1.775.497-3.39 1.13-4.674C7.573 6.636 5.877 8.711 5.38 10.5h3.38zm5.481 0H17.62c-.497-1.789-2.193-3.864-4.508-4.674.633 1.284 1.027 2.899 1.13 4.674h-.002zm-4.478 2c.103 1.775.497 3.39 1.13 4.674-2.316-.81-4.012-2.885-4.508-4.674h3.38-.002zm1.027 4.366c-.57-1.242-.928-2.726-1.027-4.366h4.476c-.1 1.64-.457 3.124-1.027 4.366-.526 1.148-1.134 1.822-1.71 1.884-.058.006-.166.006-.224 0-.577-.062-1.185-.736-1.711-1.884h.224-.001zm4.451-4.366c-.103 1.775-.497 3.39-1.13 4.674 2.316-.81 4.012-2.885 4.508-4.674h-3.38.002z",
        add: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z",
        mute:
            "M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z",
        data: "M2 3v18h20v-2H4V3H2zm5 14h2V9H7v8zm4 0h2V6h-2v11zm4 0h2v-5h-2v5z",
        shortcuts:
            "M11.999 22.25c-5.652 0-10.25-4.598-10.25-10.25S6.347 1.75 11.999 1.75 22.249 6.348 22.249 12s-4.598 10.25-10.25 10.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25-3.701-8.25-8.25-8.25zm.445 6.992c1.747-.096 3.748-.689 3.768-.695l.575 1.916c-.077.022-1.616.48-3.288.689v.498c.287 1.227 1.687 2.866 2.214 3.405l-1.428 1.4c-.188-.191-1.518-1.576-2.286-3.144-.769 1.568-2.098 2.952-2.286 3.144l-1.428-1.4c.527-.54 1.927-2.178 2.214-3.405v-.498c-1.672-.209-3.211-.667-3.288-.689l.575-1.916c.02.006 2.021.6 3.768.695m0 0c.301.017.59.017.891 0M12 6.25c-.967 0-1.75.78-1.75 1.75s.783 1.75 1.75 1.75 1.75-.78 1.75-1.75-.784-1.75-1.75-1.75z",
    };

    /*
     * 좌측 메뉴는 분석 문서의 전체 설정 목록을 그대로 갖되,
     * 우측 상세 패널 데이터는 현재 클론 범위에 포함된 섹션만 완전하게 제공한다.
     * 나머지 메뉴는 클릭해도 해당 타이틀과 준비중 메시지만 보여주는 fallback으로 처리한다.
     */
    const navigationSections = [
        { id: "account", label: "계정", href: "/settings/account" },
        {
            id: "notifications",
            label: "알림",
            href: "/settings/notifications",
        },
        {
            id: "privacy_and_safety",
            label: "개인정보 및 안전",
            href: "/settings/privacy_and_safety",
        },
        {
            id: "accessibility_display_and_languages",
            label: "접근성, 표시, 언어",
            href: "/settings/accessibility_display_and_languages",
        },
    ];

    const detailSections = {
        account: {
            title: "계정",
            summary:
                "계정 정보를 확인하고, 계정 비활성화 옵션에 대해 자세히 알아보세요.",
            entries: [
                {
                    title: "계정 정보",
                    description:
                        "휴대폰 번호와 이메일 주소와 같은 계정 정보를 조회하세요.",
                    href: "/settings/your_twitter_data/account",
                    icon: icons.account,
                },
                {
                    title: "비밀번호 변경",
                    description: "언제든지 비밀번호를 변경하세요.",
                    href: "/settings/password",
                    icon: icons.key,
                },
                {
                    title: "계정 비활성화",
                    description: "계정을 비활성화하는 법을 알아보세요.",
                    href: "/settings/deactivate",
                    icon: icons.deactivate,
                },
            ],
        },
        notifications: {
            title: "알림",
            summary:
                "활동, 관심사 및 추천에 관해 받는 알림의 종류를 선택합니다.",
            entries: [
                {
                    title: "필터",
                    description:
                        "확인하고자 하는 알림과 확인하고 싶지 않은 알림을 선택하세요.",
                    href: "/settings/notifications/filters",
                    icon: icons.filter,
                },
                {
                    title: "환경설정",
                    description: "알림 유형별로 환경설정을 선택하세요.",
                    href: "/settings/notifications/preferences",
                    icon: icons.preferences,
                },
            ],
        },
        privacy_and_safety: {
            title: "개인정보 및 안전",
            summary:
                "노출 범위와 상호작용 방식을 조정하고, 뮤트 및 차단 같은 안전 도구를 관리합니다.",
            entries: [
                {
                    title: "잠재적으로 민감한 콘텐츠",
                    description:
                        "민감한 미디어를 표시할지와 검색 결과 반영 방식을 관리합니다.",
                    href: "/settings/privacy_and_safety/sensitive_content",
                    icon: icons.display,
                },
                {
                    title: "내 게시물",
                    description:
                        "게시물 공개 범위와 태그 허용 여부 같은 공개 설정을 관리합니다.",
                    href: "/settings/privacy_and_safety/your_posts",
                    icon: icons.account,
                },
                {
                    title: "뮤트 및 차단",
                    description:
                        "뮤트하거나 차단한 계정, 단어, 알림을 한곳에서 관리합니다.",
                    href: "/settings/privacy_and_safety/mute_and_block",
                    icon: icons.filter,
                },
                {
                    title: "다이렉트 메시지",
                    description:
                        "누가 메시지를 보낼 수 있는지와 메시지 관련 권한을 조정합니다.",
                    href: "/settings/privacy_and_safety/direct_messages",
                    icon: icons.preferences,
                },
                {
                    title: "검색 가능성 및 연락처",
                    description:
                        "이메일 주소와 휴대폰 번호로 내 계정을 찾을 수 있는지 관리합니다.",
                    href: "/settings/privacy_and_safety/discoverability_and_contacts",
                    icon: icons.accessibility,
                },
            ],
        },
        accessibility_display_and_languages: {
            title: "접근성, 표시, 언어",
            summary: "X의 콘텐츠 표시 방식을 관리합니다.",
            entries: [
                {
                    title: "접근성",
                    description:
                        "색 대비와 동작 제한 등 X에서의 환경을 관리합니다.",
                    href: "/settings/accessibility",
                    icon: icons.accessibility,
                },
                {
                    title: "표시",
                    description:
                        "글꼴 크기, 색상 및 배경을 관리합니다. 이러한 설정은 이 브라우저의 모든 X 계정에 적용됩니다.",
                    href: "/settings/display",
                    icon: icons.display,
                    modal: "appearance",
                },
                {
                    title: "언어",
                    description:
                        "사용자 환경을 맞춤 설정할 때 사용되는 언어를 관리합니다.",
                    href: "/settings/languages",
                    icon: icons.language,
                },
                {
                    title: "데이터 사용량",
                    description:
                        "X는 이 디바이스에서 사용자의 일부 네트워크 데이터를 사용하는 방식을 제한합니다.",
                    href: "/settings/data",
                    icon: icons.data,
                },
                {
                    title: "키보드 단축키",
                    href: "/i/keyboard_shortcuts",
                    icon: icons.shortcuts,
                    modal: "shortcuts",
                },
            ],
        },
    };

    const accentOptions = [
        { id: "blue", label: "기본", color: "#1d9bf0" },
        { id: "yellow", label: "노랑", color: "#ffd400" },
        { id: "pink", label: "핑크", color: "#f91880" },
        { id: "purple", label: "보라", color: "#7856ff" },
        { id: "orange", label: "주황", color: "#ff7a00" },
        { id: "green", label: "초록", color: "#00ba7c" },
    ];

    const surfaceOptions = [
        { id: "light", label: "기본", color: "#ffffff" },
        { id: "dim", label: "어두운", color: "#15202b" },
        { id: "lights-out", label: "완전 어두운", color: "#000000" },
    ];
    const languageSelectionOptions = [
        { id: "ko", label: "한국어 - 한국어" },
        { id: "en", label: "영어 - English" },
        { id: "en-gb", label: "영어(영국) - British English" },
        { id: "ja", label: "일본어 - 日本語" },
        { id: "es", label: "스페인어 - Español" },
        { id: "fr", label: "프랑스어 - Français" },
    ];
    const countryOptionMarkup = `
        <option value="gh">가나</option><option value="ga">가봉</option><option value="gy">가이아나</option><option value="gm">감비아</option><option value="gg">건지</option><option value="gp">과들루프</option><option value="gt">과테말라</option><option value="gu">괌</option><option value="gd">그레나다</option><option value="gr">그리스</option><option value="gl">그린란드</option><option value="gn">기니</option><option value="gw">기니비사우</option><option value="na">나미비아</option><option value="nr">나우루</option><option value="ng">나이지리아</option><option value="za">남아프리카</option><option value="nl">네덜란드</option><option value="bq">네덜란드령 카리브</option><option value="np">네팔</option><option value="no">노르웨이</option><option value="nf">노퍽섬</option><option value="nz">뉴질랜드</option><option value="nc">뉴칼레도니아</option><option value="nu">니우에</option><option value="ne">니제르</option><option value="ni">니카라과</option><option value="tw">대만</option><option value="kr">대한민국</option><option value="dk">덴마크</option><option value="dm">도미니카</option><option value="do">도미니카 공화국</option><option value="de">독일</option><option value="tl">동티모르</option><option value="la">라오스</option><option value="lr">라이베리아</option><option value="lv">라트비아</option><option value="ru">러시아</option><option value="lb">레바논</option><option value="ls">레소토</option><option value="ro">루마니아</option><option value="lu">룩셈부르크</option><option value="rw">르완다</option><option value="ly">리비아</option><option value="re">리유니온</option><option value="lt">리투아니아</option><option value="li">리히텐슈타인</option><option value="mg">마다가스카르</option><option value="mq">마르티니크</option><option value="mh">마셜 제도</option><option value="yt">마요트</option><option value="mo">마카오(중국 특별행정구)</option><option value="mk">마케도니아</option><option value="mw">말라위</option><option value="my">말레이시아</option><option value="ml">말리</option><option value="im">맨 섬</option><option value="mx">멕시코</option><option value="mc">모나코</option><option value="ma">모로코</option><option value="mu">모리셔스</option><option value="mr">모리타니</option><option value="mz">모잠비크</option><option value="me">몬테네그로</option><option value="ms">몬트세라트</option><option value="md">몰도바</option><option value="mv">몰디브</option><option value="mt">몰타</option><option value="mn">몽골</option><option value="us">미국</option><option value="vi">미국령 버진아일랜드</option><option value="fm">미크로네시아</option><option value="vu">바누아투</option><option value="bh">바레인</option><option value="bb">바베이도스</option><option value="va">바티칸 시국</option><option value="bs">바하마</option><option value="bd">방글라데시</option><option value="bm">버뮤다</option><option value="bj">베냉</option><option value="ve">베네수엘라</option><option value="vn">베트남</option><option value="be">벨기에</option><option value="by">벨라루스</option><option value="bz">벨리즈</option><option value="ba">보스니아 헤르체고비나</option><option value="bw">보츠와나</option><option value="bo">볼리비아</option><option value="bi">부룬디</option><option value="bf">부르키나파소</option><option value="bv">부베섬</option><option value="bt">부탄</option><option value="mp">북마리아나제도</option><option value="bg">불가리아</option><option value="br">브라질</option><option value="bn">브루나이</option><option value="ws">사모아</option><option value="sa">사우디아라비아</option><option value="gs">사우스조지아 사우스샌드위치 제도</option><option value="sm">산마리노</option><option value="st">상투메 프린시페</option><option value="mf">생마르탱</option><option value="bl">생바르텔레미</option><option value="pm">생피에르 미클롱</option><option value="sn">세네갈</option><option value="rs">세르비아</option><option value="sc">세이셸</option><option value="lc">세인트루시아</option><option value="vc">세인트빈센트그레나딘</option><option value="kn">세인트키츠 네비스</option><option value="sh">세인트헬레나</option><option value="so">소말리아</option><option value="sb">솔로몬 제도</option><option value="sr">수리남</option><option value="lk">스리랑카</option><option value="sz">스와질란드</option><option value="se">스웨덴</option><option value="ch">스위스</option><option value="es">스페인</option><option value="sk">슬로바키아</option><option value="si">슬로베니아</option><option value="sl">시에라리온</option><option value="sx">신트마르턴</option><option value="sg">싱가포르</option><option value="ae">아랍에미리트</option><option value="aw">아루바</option><option value="am">아르메니아</option><option value="ar">아르헨티나</option><option value="as">아메리칸 사모아</option><option value="is">아이슬란드</option><option value="ht">아이티</option><option value="ie">아일랜드</option><option value="az">아제르바이잔</option><option value="af">아프가니스탄</option><option value="ad">안도라</option><option value="al">알바니아</option><option value="dz">알제리</option><option value="ao">앙골라</option><option value="ag">앤티가 바부다</option><option value="ai">앵귈라</option><option value="er">에리트리아</option><option value="ee">에스토니아</option><option value="ec">에콰도르</option><option value="et">에티오피아</option><option value="sv">엘살바도르</option><option value="gb">영국</option><option value="io">영국령 인도양 식민지</option><option value="ye">예멘</option><option value="om">오만</option><option value="au">오스트레일리아</option><option value="at">오스트리아</option><option value="hn">온두라스</option><option value="ax">올란드 제도</option><option value="wf">왈리스-푸투나 제도</option><option value="jo">요르단</option><option value="ug">우간다</option><option value="uy">우루과이</option><option value="uz">우즈베키스탄</option><option value="ua">우크라이나</option><option value="iq">이라크</option><option value="ir">이란</option><option value="il">이스라엘</option><option value="eg">이집트</option><option value="it">이탈리아</option><option value="in">인도</option><option value="id">인도네시아</option><option value="jp">일본</option><option value="jm">자메이카</option><option value="zm">잠비아</option><option value="je">저지</option><option value="gq">적도 기니</option><option value="ge">조지아</option><option value="cf">중앙 아프리카 공화국</option><option value="dj">지부티</option><option value="gi">지브롤터</option><option value="zw">짐바브웨</option><option value="td">차드</option><option value="cz">체코</option><option value="cl">칠레</option><option value="cm">카메룬</option><option value="cv">카보베르데</option><option value="kz">카자흐스탄</option><option value="qa">카타르</option><option value="kh">캄보디아</option><option value="ca">캐나다</option><option value="ke">케냐</option><option value="ky">케이맨 제도</option><option value="km">코모로</option><option value="xk">코소보</option><option value="cr">코스타리카</option><option value="cc">코코스 제도</option><option value="ci">코트디부아르</option><option value="co">콜롬비아</option><option value="cg">콩고-브라자빌</option><option value="cd">콩고-킨샤사</option><option value="cu">쿠바</option><option value="kw">쿠웨이트</option><option value="ck">쿡 제도</option><option value="cw">퀴라소</option><option value="hr">크로아티아</option><option value="cx">크리스마스섬</option><option value="kg">키르기스스탄</option><option value="ki">키리바시</option><option value="cy">키프로스</option><option value="tj">타지키스탄</option><option value="tz">탄자니아</option><option value="th">태국</option><option value="tc">터크스 케이커스 제도</option><option value="tr">터키</option><option value="tg">토고</option><option value="tk">토켈라우</option><option value="to">통가</option><option value="tm">투르크메니스탄</option><option value="tv">투발루</option><option value="tn">튀니지</option><option value="tt">트리니다드 토바고</option><option value="pa">파나마</option><option value="py">파라과이</option><option value="pk">파키스탄</option><option value="pg">파푸아뉴기니</option><option value="pw">팔라우</option><option value="ps">팔레스타인 지구</option><option value="fo">페로 제도</option><option value="pe">페루</option><option value="pt">포르투갈</option><option value="fk">포클랜드 제도</option><option value="pl">폴란드</option><option value="pr">푸에르토리코</option><option value="fr">프랑스</option><option value="tf">프랑스 남부 지방</option><option value="gf">프랑스령 기아나</option><option value="pf">프랑스령 폴리네시아</option><option value="fj">피지</option><option value="fi">핀란드</option><option value="ph">필리핀</option><option value="pn">핏케언 섬</option><option value="hu">헝가리</option><option value="hk">홍콩(중국 특별행정구)</option>
    `;

    const accountInfoItems = [
        {
            id: "username",
            label: "사용자 아이디",
            value: "tmtsugar",
        },
        {
            id: "phone",
            label: "휴대폰",
            value: "",
        },
        {
            id: "email",
            label: "이메일",
            value: "tjdgh1851@gmail.com",
        },
        {
            id: "createdAt",
            label: "계정 생성",
            value: "2025. 2. 3. 오후 5:02:45",
            description: "211.234.227.8 (South Korea)",
            showArrow: false,
        },
        {
            id: "country",
            label: "국가",
            value: "대한민국",
        },
        {
            id: "language",
            label: "언어",
            value: "한국어, 영어, 언어 관련 내용 없음",
        },
    ];

    let activeSectionId = "account";
    let activeDetailRoute = "";
    let activeModal = "";
    const appearanceState = {
        fontScale: "2",
        accent: "blue",
        surface: "light",
    };
    const usernameState = {
        current: "tmtsugar",
        draft: "tmtsugar",
        isMarketplaceVisible: true,
    };
    const passwordChangeState = {
        currentPassword: "",
        nextPassword: "",
        confirmPassword: "",
    };
    const notificationFilterState = {
        isQualityFilterEnabled: true,
        mutedNotificationOptions: {
            nonFollowing: false,
            notFollowingYou: false,
            newAccount: false,
            defaultProfile: false,
            unverifiedEmail: false,
            unverifiedPhone: false,
        },
    };
    const notificationPreferenceState = {
        isPushEnabled: false,
        isEmailEnabled: true,
        emailAlerts: {
            newNotifications: true,
            messages: true,
            emailedPosts: true,
            performanceUpdates: false,
        },
        emailDigest: "often",
    };
    const privacyPostsState = {
        isSensitiveMediaMarked: false,
        isLocationEnabled: true,
    };
    const mutedWordFormState = {
        value: "",
        muteFromTimeline: true,
        muteNotifications: true,
        notificationAudience: "non-following",
        duration: "until-unmuted",
    };
    const currentAccountState = {
        displayName: "tmt",
        handle: "@tmtsugar",
        avatarUrl:
            "https://pbs.twimg.com/profile_images/1886326200253202432/j2j1wUY3_x96.jpg",
    };
    const phoneModalState = {
        phoneNumber: "",
        code: "",
        step: "add",
        isHelpMenuOpen: false,
    };
    const languageSelectionState = {
        step: "choices",
        query: "",
        showAll: false,
        selectedIds: new Set(["ko", "en"]),
        appLanguageId: "ko",
    };

    function buildIcon(path, extraClass = "") {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="${extraClass}">
                <g><path d="${path}"></path></g>
            </svg>
        `;
    }

    function getFallbackSection(sectionId) {
        const navigationItem = navigationSections.find(
            (section) => section.id === sectionId,
        );
        return {
            title: navigationItem?.label ?? "설정",
            summary: "이 항목은 현재 설정 클론 범위에서 제외되어 있습니다.",
            entries: [],
        };
    }

    function getActiveSectionData() {
        return (
            detailSections[activeSectionId] ??
            getFallbackSection(activeSectionId)
        );
    }

    function getUsernameValidationMessage(value) {
        if (/^[A-Za-z0-9_]{3,15}$/.test(value)) {
            return "";
        }

        return "사용자 아이디는 문자, 숫자, 밑줄을 포함할 수 있으며, 3~15자 사이여야 합니다.";
    }

    function buildUsernameSuggestions(value) {
        const suffixes = ["zxsc", "ph", "aby"];
        const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
        const fallbackBase = usernameState.current
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");
        let base = sanitizedValue || fallbackBase || "user";

        if (base.length < 3) {
            base = `${base}${fallbackBase}`.slice(0, 8) || "user";
        }

        base = base.slice(0, 11);

        return suffixes.map((suffix) => `${base}${suffix}`.slice(0, 15));
    }

    function renderLanguageSelectionModal() {
        const isAppStep = languageSelectionState.step === "app";
        const normalizedQuery = languageSelectionState.query
            .trim()
            .toLowerCase();
        const filteredOptions = languageSelectionOptions.filter((option) =>
            option.label.toLowerCase().includes(normalizedQuery),
        );
        const selectedOptions = languageSelectionOptions.filter((option) =>
            languageSelectionState.selectedIds.has(option.id),
        );
        const visibleOptions = isAppStep
            ? selectedOptions
            : !normalizedQuery && !languageSelectionState.showAll
              ? filteredOptions.slice(0, 3)
              : filteredOptions;

        languageSelectionBackButton.hidden = !isAppStep;
        languageSelectionModalTitle.textContent = isAppStep
            ? "앱 언어 선택"
            : "언어 선택";
        languageSelectionSummary.textContent = isAppStep
            ? "앱의 기본 언어가 이 언어로 설정됩니다. Twitter에서 추천하는 내가 좋아할 만한 콘텐츠는 내가 선택한 다른 언어로도 표시됩니다."
            : "X 환경을 맞춤 설정하는 데 사용할 언어를 선택하세요.";
        languageSelectionSearch.hidden = isAppStep;
        languageSelectionMoreButton.hidden =
            isAppStep ||
            Boolean(normalizedQuery) ||
            filteredOptions.length <= 3 ||
            languageSelectionState.showAll;
        languageSelectionSkipButton.hidden = isAppStep;
        languageSelectionNextButton.textContent = "다음";
        languageSelectionSearchInput.value = languageSelectionState.query;
        languageSelectionList.innerHTML = visibleOptions.length
            ? visibleOptions
                  .map((option) => {
                      const isChecked = isAppStep
                          ? languageSelectionState.appLanguageId === option.id
                          : languageSelectionState.selectedIds.has(option.id);
                      const boxClass = isAppStep
                          ? "language-selection__item-box language-selection__item-box--radio"
                          : "language-selection__item-box";
                      const itemClass = isAppStep
                          ? "language-selection__item language-selection__item--app"
                          : "language-selection__item";
                      const inputType = isAppStep ? "radio" : "checkbox";
                      const inputName = isAppStep
                          ? 'name="appLanguageOption"'
                          : "";

                      return `
                            <label class="${itemClass}">
                                <span class="language-selection__item-label">
                                    ${option.label}
                                </span>
                                <span class="language-selection__item-control">
                                    <input
                                        type="${inputType}"
                                        class="language-selection__item-checkbox"
                                        data-language-option-id="${option.id}"
                                        ${inputName}
                                        ${isChecked ? "checked" : ""}
                                    />
                                    <span class="${boxClass}" aria-hidden="true">
                                        ${buildIcon(
                                            "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                        )}
                                    </span>
                                </span>
                            </label>
                        `;
                  })
                  .join("")
            : '<p class="language-selection__empty">검색 결과가 없습니다.</p>';

        languageSelectionSearchInput.disabled = isAppStep;
        const footerClassName = isAppStep
            ? "language-selection__footer language-selection__footer--compact"
            : "language-selection__footer";
        languageSelectionNextButton.parentElement.className = footerClassName;
        languageSelectionNextButton.textContent = "다음";
    }

    function getLanguagePreferenceLabel() {
        const labels = languageSelectionOptions
            .filter((option) =>
                languageSelectionState.selectedIds.has(option.id),
            )
            .map((option) => option.label.split(" - ")[0]);

        if (!labels.length) {
            return "언어를 선택하세요";
        }

        if (
            labels.length === 2 &&
            labels[0] === "한국어" &&
            labels[1] === "영어"
        ) {
            return "한국어 및 영어";
        }

        return labels.join(", ");
    }

    function getAppLanguageLabel() {
        const selectedOption = languageSelectionOptions.find(
            (option) => option.id === languageSelectionState.appLanguageId,
        );

        return selectedOption?.label.split(" - ")[0] || "한국어";
    }

    function getCombinedLanguageLabel() {
        const preferenceLabel = getLanguagePreferenceLabel();
        const appLanguageLabel = getAppLanguageLabel();

        if (preferenceLabel === "언어를 선택하세요") {
            return appLanguageLabel;
        }

        if (preferenceLabel.includes(appLanguageLabel)) {
            return preferenceLabel;
        }

        return `${appLanguageLabel}, ${preferenceLabel}`;
    }

    function resetDetailHeaderAction() {
        detailActionButton.hidden = true;
        detailActionButton.textContent = "";
        detailActionButton.innerHTML = "";
        detailActionButton.removeAttribute("data-detail-action");
        detailActionButton.removeAttribute("aria-label");
    }

    function setDetailHeaderAction({ label = "", iconPath = "", ariaLabel, action }) {
        detailActionButton.hidden = false;
        detailActionButton.textContent = label;
        detailActionButton.innerHTML = iconPath
            ? buildIcon(iconPath, "panel-header__action-icon")
            : label;
        detailActionButton.dataset.detailAction = action;
        detailActionButton.setAttribute("aria-label", ariaLabel);
    }

    /*
     * 우측 상세 패널에는 "섹션 기본 목록" 외에 하위 라우트 화면이 들어올 수 있다.
     * 현재는 사용자가 요청한 `계정 > 계정 정보` 비밀번호 확인 화면만 구현한다.
     */
    function renderDetailRoute() {
        if (
            activeDetailRoute !== "account-info-auth" &&
            activeDetailRoute !== "account-info-list" &&
            activeDetailRoute !== "username-edit" &&
            activeDetailRoute !== "password-edit" &&
            activeDetailRoute !== "deactivate-edit" &&
            activeDetailRoute !== "notification-filter-edit" &&
            activeDetailRoute !== "notification-muted-edit" &&
            activeDetailRoute !== "notification-preferences-edit" &&
            activeDetailRoute !== "notification-push-edit" &&
            activeDetailRoute !== "notification-email-edit" &&
            activeDetailRoute !== "privacy-mute-block-edit" &&
            activeDetailRoute !== "privacy-blocked-accounts-edit" &&
            activeDetailRoute !== "privacy-muted-accounts-edit" &&
            activeDetailRoute !== "privacy-muted-words-edit" &&
            activeDetailRoute !== "privacy-muted-words-add-edit" &&
            activeDetailRoute !== "privacy-posts-edit" &&
            activeDetailRoute !== "privacy-posts-location-edit" &&
            activeDetailRoute !== "phone-edit" &&
            activeDetailRoute !== "email-edit" &&
            activeDetailRoute !== "country-edit" &&
            activeDetailRoute !== "language-edit"
        ) {
            return false;
        }

        detailBackButton.hidden = false;
        detailTitle.textContent = "계정 정보";
        detailSummary.hidden = true;
        detailList.hidden = true;

        if (activeDetailRoute === "account-info-auth") {
            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route" data-detail-route>
                        <div class="detail-route__section">
                            <h3 class="detail-route__heading">비밀번호를 확인하세요</h3>
                            <p class="detail-route__copy">비밀번호를 입력하여 계속하세요.</p>
                        </div>
                        <form class="detail-form" data-account-auth-form>
                            <label class="detail-form__field" data-password-field>
                                <span class="detail-form__label">비밀번호</span>
                                <input
                                    class="detail-form__input"
                                    type="password"
                                    aria-label="비밀번호"
                                />
                            </label>
                            <a class="detail-form__link" href="#">비밀번호를 잊으셨나요?</a>
                            <div class="detail-form__footer">
                                <button type="submit" class="detail-form__button">확인</button>
                            </div>
                        </form>
                    </section>
                `,
            );

            const passwordField = detailContent.querySelector(
                "[data-password-field]",
            );
            const passwordInput = passwordField?.querySelector(
                ".detail-form__input",
            );
            const authForm = detailContent.querySelector(
                "[data-account-auth-form]",
            );

            if (
                passwordField instanceof HTMLElement &&
                passwordInput instanceof HTMLInputElement
            ) {
                // Spring 정적 리소스 배포에서도 추가 템플릿 엔진 의존 없이 DOM 상태만으로
                // 포커스/입력 여부를 판단해 클래스만 토글하도록 구성한다.
                const syncPasswordFieldState = () => {
                    const isActive =
                        document.activeElement === passwordInput ||
                        passwordInput.value.length > 0;
                    passwordField.classList.toggle(
                        "detail-form__field--active",
                        isActive,
                    );
                };

                passwordInput.addEventListener("focus", syncPasswordFieldState);
                passwordInput.addEventListener("blur", syncPasswordFieldState);
                passwordInput.addEventListener("input", syncPasswordFieldState);
                syncPasswordFieldState();
            }

            if (authForm instanceof HTMLFormElement) {
                authForm.addEventListener("submit", (event) => {
                    event.preventDefault();

                    /*
                     * 현재 단계:
                     * - 서버 인증이 아직 없어서 입력값과 관계없이 다음 상세 화면으로 넘긴다.
                     *
                     * Spring 연동 시 권장 흐름:
                     * 1. 여기서 `passwordInput.value`를 읽는다.
                     * 2. `/settings/account/verify-password` 같은 POST 엔드포인트로 전송한다.
                     * 3. Spring Security 또는 서비스 레이어에서 현재 로그인 사용자의 비밀번호를 검증한다.
                     * 4. 성공 시에만 `activeDetailRoute = "account-info-list"`로 전환한다.
                     * 5. 실패 시에는 400/401 응답을 받아 필드 하단 에러 문구를 표시한다.
                     *
                     * 즉, 지금의 즉시 전환 코드는 서버가 붙기 전까지의 임시 클라이언트 스텁이다.
                     */
                    activeDetailRoute = "account-info-list";
                    renderDetail();
                });
            }

            return true;
        }

        if (activeDetailRoute === "username-edit") {
            const usernameError = getUsernameValidationMessage(
                usernameState.draft,
            );
            const canSaveUsername =
                !usernameError &&
                usernameState.draft.length > 0 &&
                usernameState.draft !== usernameState.current;

            detailTitle.textContent = "사용자 이름 변경";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--username" data-detail-route>
                        <form class="username-editor" data-username-form novalidate>
                            <div class="username-editor__section">
                                <label class="username-field${usernameError ? " username-field--error" : ""}" data-username-field>
                                    <span class="username-field__label${usernameState.draft.length > 0 ? " username-field__label--filled" : ""}">사용자 아이디</span>
                                    <input
                                        class="username-field__input"
                                        type="text"
                                        value="${usernameState.draft}"
                                        aria-label="사용자 아이디"
                                        autocomplete="off"
                                        autocapitalize="off"
                                        spellcheck="false"
                                        data-username-input
                                    />
                                </label>
                                <p class="username-field__message" data-username-message${usernameError ? "" : " hidden"}>
                                    ${usernameError}
                                </p>
                            </div>

                            <section class="username-suggestion">
                                <h3 class="username-suggestion__title">추천</h3>
                                <div class="username-suggestion__list" data-username-suggestion-list>
                                    ${buildUsernameSuggestions(
                                        usernameState.draft,
                                    )
                                        .map(
                                            (suggestion) => `
                                                <button
                                                    type="button"
                                                    class="username-suggestion__item"
                                                    data-username-suggestion="${suggestion}"
                                                >
                                                    ${suggestion}
                                                </button>
                                            `,
                                        )
                                        .join("")}
                                </div>
                            </section>

                            <div class="username-action">
                                <button
                                    type="submit"
                                    class="username-action__button${canSaveUsername ? " username-action__button--enabled" : ""}"
                                    data-username-save
                                    ${canSaveUsername ? "" : "disabled"}
                                >
                                    저장
                                </button>
                            </div>
                        </form>

                        ${
                            usernameState.isMarketplaceVisible
                                ? `
                                    <aside class="username-marketplace">
                                        <button
                                            type="button"
                                            class="username-marketplace__close"
                                            aria-label="추천 카드 닫기"
                                            data-username-marketplace-close
                                        >
                                            ${buildIcon(
                                                "M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z",
                                            )}
                                        </button>
                                        <div class="username-marketplace__brand">X</div>
                                        <p class="username-marketplace__copy">
                                            Handle Marketplace에 원하는 사용자 아이디가 있을 수도 있습니다
                                        </p>
                                        <button type="button" class="username-marketplace__button">
                                            사용자 아이디 찾아보기
                                        </button>
                                    </aside>
                                `
                                : ""
                        }
                    </section>
                `,
            );

            const usernameForm = detailContent.querySelector(
                "[data-username-form]",
            );
            const usernameField = detailContent.querySelector(
                "[data-username-field]",
            );
            const usernameInput = detailContent.querySelector(
                "[data-username-input]",
            );
            const usernameMessage = detailContent.querySelector(
                "[data-username-message]",
            );
            const usernameSuggestionList = detailContent.querySelector(
                "[data-username-suggestion-list]",
            );
            const usernameSaveButton = detailContent.querySelector(
                "[data-username-save]",
            );
            const usernameMarketplaceCloseButton = detailContent.querySelector(
                "[data-username-marketplace-close]",
            );

            if (
                usernameForm instanceof HTMLFormElement &&
                usernameField instanceof HTMLElement &&
                usernameInput instanceof HTMLInputElement &&
                usernameMessage instanceof HTMLElement &&
                usernameSuggestionList instanceof HTMLElement &&
                usernameSaveButton instanceof HTMLButtonElement
            ) {
                const usernameLabel = usernameField.querySelector(
                    ".username-field__label",
                );

                const syncUsernameEditorState = () => {
                    usernameState.draft = usernameInput.value;

                    const isActive = document.activeElement === usernameInput;
                    const validationMessage = getUsernameValidationMessage(
                        usernameState.draft,
                    );
                    const canSave =
                        !validationMessage &&
                        usernameState.draft.length > 0 &&
                        usernameState.draft !== usernameState.current;

                    usernameField.classList.toggle(
                        "username-field--active",
                        isActive,
                    );
                    usernameField.classList.toggle(
                        "username-field--error",
                        Boolean(validationMessage),
                    );
                    if (usernameLabel instanceof HTMLElement) {
                        usernameLabel.classList.toggle(
                            "username-field__label--filled",
                            usernameInput.value.length > 0,
                        );
                    }
                    usernameMessage.hidden = !validationMessage;
                    usernameMessage.textContent = validationMessage;
                    usernameSaveButton.disabled = !canSave;
                    usernameSaveButton.classList.toggle(
                        "username-action__button--enabled",
                        canSave,
                    );
                    usernameSuggestionList.innerHTML = buildUsernameSuggestions(
                        usernameState.draft,
                    )
                        .map(
                            (suggestion) => `
                                <button
                                    type="button"
                                    class="username-suggestion__item"
                                    data-username-suggestion="${suggestion}"
                                >
                                    ${suggestion}
                                </button>
                            `,
                        )
                        .join("");
                };

                usernameInput.addEventListener(
                    "focus",
                    syncUsernameEditorState,
                );
                usernameInput.addEventListener("blur", syncUsernameEditorState);
                usernameInput.addEventListener(
                    "input",
                    syncUsernameEditorState,
                );

                usernameSuggestionList.addEventListener("click", (event) => {
                    const target = event.target;
                    if (!(target instanceof Element)) {
                        return;
                    }

                    const suggestionButton = target.closest(
                        "[data-username-suggestion]",
                    );
                    if (!(suggestionButton instanceof HTMLButtonElement)) {
                        return;
                    }

                    usernameInput.value =
                        suggestionButton.dataset.usernameSuggestion || "";
                    syncUsernameEditorState();
                    usernameInput.focus();
                    usernameInput.setSelectionRange(
                        usernameInput.value.length,
                        usernameInput.value.length,
                    );
                });

                usernameForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    syncUsernameEditorState();

                    if (
                        usernameSaveButton.disabled ||
                        getUsernameValidationMessage(usernameInput.value)
                    ) {
                        return;
                    }

                    usernameState.current = usernameInput.value;
                    usernameState.draft = usernameInput.value;
                    accountInfoItems[0].value = usernameInput.value;
                    activeDetailRoute = "account-info-list";
                    renderDetail();
                });

                syncUsernameEditorState();
            }

            if (usernameMarketplaceCloseButton instanceof HTMLButtonElement) {
                usernameMarketplaceCloseButton.addEventListener("click", () => {
                    usernameState.isMarketplaceVisible = false;
                    renderDetail();
                });
            }

            return true;
        }

        if (activeDetailRoute === "password-edit") {
            detailTitle.textContent = "비밀번호 변경";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--password" data-detail-route>
                        <form class="password-editor" data-password-editor-form novalidate>
                            <div class="password-editor__group">
                                <label class="password-editor__field" data-password-editor-field>
                                    <span class="password-editor__label">현재 비밀번호</span>
                                    <input
                                        class="password-editor__input"
                                        type="password"
                                        value="${passwordChangeState.currentPassword}"
                                        aria-label="현재 비밀번호"
                                        data-password-editor-input="currentPassword"
                                    />
                                </label>
                                <a href="#" class="password-editor__link">
                                    비밀번호를 잊으셨나요?
                                </a>
                            </div>

                            <div class="password-editor__group">
                                <label class="password-editor__field" data-password-editor-field>
                                    <span class="password-editor__label">새 비밀번호</span>
                                    <input
                                        class="password-editor__input"
                                        type="password"
                                        value="${passwordChangeState.nextPassword}"
                                        aria-label="새 비밀번호"
                                        data-password-editor-input="nextPassword"
                                    />
                                </label>
                            </div>

                            <div class="password-editor__group">
                                <label class="password-editor__field" data-password-editor-field>
                                    <span class="password-editor__label">비밀번호 확인</span>
                                    <input
                                        class="password-editor__input"
                                        type="password"
                                        value="${passwordChangeState.confirmPassword}"
                                        aria-label="비밀번호 확인"
                                        data-password-editor-input="confirmPassword"
                                    />
                                </label>
                            </div>

                            <div class="password-editor__notice">
                                비밀번호를 변경하면 현재 사용 중인 세션을 제외한 모든 활성 X 세션에서 로그아웃됩니다. 내 계정에 대한 액세스 권한이 있는 1개의 애플리케이션은(는) 영향을 받지 않습니다.
                                <a href="#" class="password-editor__notice-link">자세히 알아보기</a>
                            </div>

                            <div class="password-editor__actions">
                                <button
                                    type="submit"
                                    class="password-editor__save"
                                    data-password-editor-save
                                    disabled
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </section>
                `,
            );

            const passwordEditorForm = detailContent.querySelector(
                "[data-password-editor-form]",
            );
            const passwordEditorFields = Array.from(
                detailContent.querySelectorAll("[data-password-editor-field]"),
            );
            const passwordEditorInputs = Array.from(
                detailContent.querySelectorAll("[data-password-editor-input]"),
            );
            const passwordEditorSaveButton = detailContent.querySelector(
                "[data-password-editor-save]",
            );

            if (
                passwordEditorForm instanceof HTMLFormElement &&
                passwordEditorSaveButton instanceof HTMLButtonElement
            ) {
                const syncPasswordEditorState = () => {
                    passwordEditorInputs.forEach((input) => {
                        if (!(input instanceof HTMLInputElement)) {
                            return;
                        }

                        const stateKey = input.dataset.passwordEditorInput;
                        if (!stateKey) {
                            return;
                        }

                        passwordChangeState[stateKey] = input.value;
                    });

                    passwordEditorFields.forEach((field) => {
                        if (!(field instanceof HTMLElement)) {
                            return;
                        }

                        const input = field.querySelector(
                            "[data-password-editor-input]",
                        );
                        if (!(input instanceof HTMLInputElement)) {
                            return;
                        }

                        const isActive = document.activeElement === input;
                        field.classList.toggle(
                            "password-editor__field--active",
                            isActive,
                        );
                    });

                    const canSave =
                        passwordChangeState.currentPassword.length > 0 &&
                        passwordChangeState.nextPassword.length > 0 &&
                        passwordChangeState.confirmPassword.length > 0 &&
                        passwordChangeState.nextPassword ===
                            passwordChangeState.confirmPassword;

                    passwordEditorSaveButton.disabled = !canSave;
                    passwordEditorSaveButton.classList.toggle(
                        "password-editor__save--enabled",
                        canSave,
                    );
                };

                passwordEditorInputs.forEach((input) => {
                    if (!(input instanceof HTMLInputElement)) {
                        return;
                    }

                    input.addEventListener("focus", syncPasswordEditorState);
                    input.addEventListener("blur", syncPasswordEditorState);
                    input.addEventListener("input", syncPasswordEditorState);
                });

                passwordEditorForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    syncPasswordEditorState();
                });

                syncPasswordEditorState();
            }

            return true;
        }

        if (activeDetailRoute === "deactivate-edit") {
            detailTitle.textContent = "계정 비활성화";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--deactivate" data-detail-route>
                        <section class="deactivate-editor">
                            <div class="deactivate-account">
                                <span
                                    class="deactivate-account__avatar"
                                    aria-hidden="true"
                                    style="background-image: url('${currentAccountState.avatarUrl}');"
                                ></span>
                                <span class="deactivate-account__meta">
                                    <strong class="deactivate-account__name">
                                        ${currentAccountState.displayName}
                                    </strong>
                                    <span class="deactivate-account__handle">
                                        ${currentAccountState.handle}
                                    </span>
                                </span>
                            </div>

                            <h3 class="deactivate-editor__title">
                                계정이 비활성화됩니다
                            </h3>
                            <p class="deactivate-editor__summary">
                                X 계정 비활성화 과정을 시작합니다. 내 표시 이름, ${currentAccountState.handle}, 공개 프로필이 X.com, iOS용 X, Android용 X에 더 이상 표시되지 않습니다.
                            </p>

                            <h4 class="deactivate-editor__heading">
                                그 밖에 내가 알아야 할 내용
                            </h4>
                            <p class="deactivate-editor__copy">
                                실수로 또는 잘못하여 X 계정을 비활성화한 후에도 30일 이내에 복구할 수 있습니다.
                            </p>

                            <div class="deactivate-editor__note-list">
                                <div class="deactivate-editor__note">
                                    일부 계정 정보는 Google 또는 Bing과 같은 검색 엔진에서 아직 접근 가능할 수도 있습니다.
                                    <a href="#" class="deactivate-editor__link" data-deactivate-link>자세히 알아보기</a>
                                </div>
                                <div class="deactivate-editor__note">
                                    @사용자 아이디를 변경하기 위해 계정을 비활성화할 필요는 없습니다.
                                    <a href="#" class="deactivate-editor__link" data-deactivate-link>설정</a>에서 아이디를 수정하세요.
                                </div>
                                <div class="deactivate-editor__note">
                                    현재 @사용자 아이디 또는 이메일 주소를 다른 X 계정에서 사용하려면 이 계정을 비활성화하기 전에 해당 항목을
                                    <a href="#" class="deactivate-editor__link" data-deactivate-link>변경</a>하시기 바랍니다.
                                </div>
                                <div class="deactivate-editor__note">
                                    <a href="#" class="deactivate-editor__link" data-deactivate-link>내 X 데이터</a>를 다운로드하려면 계정을 비활성화하기 전에 요청 및 다운로드 프로세스를 모두 완료해야 합니다. 비활성화된 계정으로는 데이터 다운로드 링크를 보낼 수 없습니다.
                                </div>
                            </div>

                            <div class="deactivate-editor__actions">
                                <button
                                    type="button"
                                    class="deactivate-editor__button"
                                >
                                    비활성화
                                </button>
                            </div>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "notification-filter-edit") {
            detailTitle.textContent = "필터";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--notification-filter" data-detail-route>
                        <section class="notification-filter-editor">
                            <p class="notification-filter-editor__summary">
                                확인하고자 하는 알림과 확인하고 싶지 않은 알림을 선택하세요.
                            </p>

                            <label class="notification-filter-editor__quality">
                                <span class="notification-filter-editor__quality-copy">
                                    <span class="notification-filter-editor__quality-title">
                                        퀄리티 필터
                                    </span>
                                    <span class="notification-filter-editor__quality-description">
                                        선택한 중복 및 자동 게시물과 같은 콘텐츠가 필터링됩니다. 팔로우 중이거나 최근 대화한 계정의 알림에 적용되지 않습니다.
                                        <a href="#" class="notification-filter-editor__link" data-notification-filter-link>자세히 알아보기</a>
                                    </span>
                                </span>
                                <span class="notification-filter-editor__quality-control">
                                    <input
                                        type="checkbox"
                                        class="notification-filter-editor__checkbox"
                                        data-notification-filter-toggle
                                        ${notificationFilterState.isQualityFilterEnabled ? "checked" : ""}
                                    />
                                    <span class="notification-filter-editor__checkbox-box" aria-hidden="true">
                                        ${buildIcon(
                                            "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                        )}
                                    </span>
                                </span>
                            </label>

                            <button
                                type="button"
                                class="notification-filter-editor__item"
                                data-notification-filter-route="muted"
                            >
                                <span class="notification-filter-editor__item-title">
                                    뮤트 상태의 알림
                                </span>
                                <span class="notification-filter-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "notification-muted-edit") {
            detailTitle.textContent = "뮤트 상태의 알림";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--notification-muted" data-detail-route>
                        <section class="notification-muted-editor">
                            <h3 class="notification-muted-editor__title">
                                다음 계정의 알림 뮤트하기:
                            </h3>

                            <div class="notification-muted-editor__list">
                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        내가 팔로우하지 않는 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="nonFollowing"
                                            ${notificationFilterState.mutedNotificationOptions.nonFollowing ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        나를 팔로우하지 않는 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="notFollowingYou"
                                            ${notificationFilterState.mutedNotificationOptions.notFollowingYou ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        새 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="newAccount"
                                            ${notificationFilterState.mutedNotificationOptions.newAccount ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        기본 프로필 이미지를 사용하는 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="defaultProfile"
                                            ${notificationFilterState.mutedNotificationOptions.defaultProfile ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        이메일을 인증하지 않은 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="unverifiedEmail"
                                            ${notificationFilterState.mutedNotificationOptions.unverifiedEmail ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="notification-muted-editor__item">
                                    <span class="notification-muted-editor__label">
                                        휴대폰 번호를 인증하지 않은 계정
                                    </span>
                                    <span class="notification-muted-editor__control">
                                        <input
                                            type="checkbox"
                                            class="notification-muted-editor__checkbox"
                                            data-notification-muted-toggle="unverifiedPhone"
                                            ${notificationFilterState.mutedNotificationOptions.unverifiedPhone ? "checked" : ""}
                                        />
                                        <span class="notification-muted-editor__box" aria-hidden="true"></span>
                                    </span>
                                </label>
                            </div>

                            <p class="notification-muted-editor__help">
                                이 필터는 내가 팔로우하는 사람에게서 받는 알림에는 영향을 주지 않습니다.
                                <a href="#" class="notification-muted-editor__link" data-notification-filter-link>자세히 알아보기</a>
                            </p>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "notification-preferences-edit") {
            detailTitle.textContent = "환경설정";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--notification-preferences" data-detail-route>
                        <section class="notification-preferences-editor">
                            <p class="notification-preferences-editor__summary">
                                알림 유형별로 환경설정을 선택하세요.
                                <a href="#" class="notification-preferences-editor__link" data-notification-filter-link>자세히 알아보기</a>
                            </p>

                            <button
                                type="button"
                                class="notification-preferences-editor__item"
                                data-notification-preferences-route="push"
                            >
                                <span class="notification-preferences-editor__item-title">
                                    푸시 알림
                                </span>
                                <span class="notification-preferences-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>

                            <button
                                type="button"
                                class="notification-preferences-editor__item"
                                data-notification-preferences-route="email"
                            >
                                <span class="notification-preferences-editor__item-title">
                                    이메일 알림
                                </span>
                                <span class="notification-preferences-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "notification-email-edit") {
            detailTitle.textContent = "이메일 알림";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--notification-email" data-detail-route>
                        <section class="notification-email-editor">
                            <div class="notification-email-editor__top">
                                <div class="notification-email-editor__top-row">
                                    <h3 class="notification-email-editor__title">
                                        이메일 알림
                                    </h3>
                                    <label class="notification-email-editor__switch">
                                        <input
                                            type="checkbox"
                                            class="notification-email-editor__switch-input"
                                            data-notification-email-toggle="enabled"
                                            ${notificationPreferenceState.isEmailEnabled ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__switch-track" aria-hidden="true">
                                            <span class="notification-email-editor__switch-thumb"></span>
                                        </span>
                                    </label>
                                </div>
                                <p class="notification-email-editor__summary">
                                    X에서 자리를 비운 사이 무슨 일이 일어났는지 이메일로 알아볼 수 있습니다. 언제든 이 설정을 끌 수 있습니다.
                                    <a href="#" class="notification-email-editor__link" data-notification-filter-link>자세히 알아보기</a>
                                </p>
                            </div>

                            <div class="notification-email-editor__divider"></div>

                            <section class="notification-email-editor__section">
                                <h4 class="notification-email-editor__section-title">
                                    나 또는 내 게시물 관련
                                </h4>

                                <label class="notification-email-editor__check-item">
                                    <span class="notification-email-editor__check-label">새 알림</span>
                                    <span class="notification-email-editor__check-control">
                                        <input
                                            type="checkbox"
                                            class="notification-email-editor__checkbox"
                                            data-notification-email-toggle="newNotifications"
                                            ${notificationPreferenceState.emailAlerts.newNotifications ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__checkbox-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="notification-email-editor__check-item">
                                    <span class="notification-email-editor__check-label">쪽지</span>
                                    <span class="notification-email-editor__check-control">
                                        <input
                                            type="checkbox"
                                            class="notification-email-editor__checkbox"
                                            data-notification-email-toggle="messages"
                                            ${notificationPreferenceState.emailAlerts.messages ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__checkbox-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="notification-email-editor__check-item">
                                    <span class="notification-email-editor__check-label">내게 이메일로 전송된 게시물</span>
                                    <span class="notification-email-editor__check-control">
                                        <input
                                            type="checkbox"
                                            class="notification-email-editor__checkbox"
                                            data-notification-email-toggle="emailedPosts"
                                            ${notificationPreferenceState.emailAlerts.emailedPosts ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__checkbox-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>
                            </section>

                            <section class="notification-email-editor__section notification-email-editor__section--radio">
                                <h4 class="notification-email-editor__section-title">
                                    인기 게시물 및 스토리
                                </h4>

                                <label class="notification-email-editor__radio-item">
                                    <span class="notification-email-editor__radio-label">매일 보내기</span>
                                    <span class="notification-email-editor__radio-control">
                                        <input
                                            name="notificationEmailDigest"
                                            type="radio"
                                            class="notification-email-editor__radio"
                                            value="daily"
                                            data-notification-email-digest
                                            ${notificationPreferenceState.emailDigest === "daily" ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__radio-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="notification-email-editor__radio-item">
                                    <span class="notification-email-editor__radio-label">매주 보내기</span>
                                    <span class="notification-email-editor__radio-control">
                                        <input
                                            name="notificationEmailDigest"
                                            type="radio"
                                            class="notification-email-editor__radio"
                                            value="weekly"
                                            data-notification-email-digest
                                            ${notificationPreferenceState.emailDigest === "weekly" ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__radio-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="notification-email-editor__radio-item">
                                    <span class="notification-email-editor__radio-label">수시로 보내기</span>
                                    <span class="notification-email-editor__radio-control">
                                        <input
                                            name="notificationEmailDigest"
                                            type="radio"
                                            class="notification-email-editor__radio"
                                            value="often"
                                            data-notification-email-digest
                                            ${notificationPreferenceState.emailDigest === "often" ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__radio-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="notification-email-editor__radio-item">
                                    <span class="notification-email-editor__radio-label">끄기</span>
                                    <span class="notification-email-editor__radio-control">
                                        <input
                                            name="notificationEmailDigest"
                                            type="radio"
                                            class="notification-email-editor__radio"
                                            value="off"
                                            data-notification-email-digest
                                            ${notificationPreferenceState.emailDigest === "off" ? "checked" : ""}
                                        />
                                        <span class="notification-email-editor__radio-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>
                            </section>

                            <label class="notification-email-editor__check-item notification-email-editor__check-item--tail">
                                <span class="notification-email-editor__check-label">내 게시물 실적 관련 업데이트</span>
                                <span class="notification-email-editor__check-control">
                                    <input
                                        type="checkbox"
                                        class="notification-email-editor__checkbox"
                                        data-notification-email-toggle="performanceUpdates"
                                        ${notificationPreferenceState.emailAlerts.performanceUpdates ? "checked" : ""}
                                    />
                                    <span class="notification-email-editor__checkbox-box" aria-hidden="true">
                                        ${buildIcon(
                                            "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                        )}
                                    </span>
                                </span>
                            </label>

                            <div class="notification-email-editor__footer-divider"></div>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "notification-push-edit") {
            detailTitle.textContent = "푸시 알림";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--notification-push" data-detail-route>
                        <section class="notification-push-editor">
                            <div class="notification-push-editor__top">
                                <div class="notification-push-editor__copy">
                                    <h3 class="notification-push-editor__title">
                                        푸시 알림
                                    </h3>
                                    <p class="notification-push-editor__summary">
                                        자리를 비운 동안 X에서 일어난 일에 대한 푸시 알림을 받아 보세요. 알림은 언제든지 끌 수 있습니다. 이 선택 사항은 이 브라우저에서 사용하는 모든 계정에 해당됩니다.
                                    </p>
                                </div>
                                <label class="notification-push-editor__switch">
                                    <input
                                        type="checkbox"
                                        class="notification-push-editor__switch-input"
                                        data-notification-push-toggle
                                        ${notificationPreferenceState.isPushEnabled ? "checked" : ""}
                                    />
                                    <span class="notification-push-editor__switch-track" aria-hidden="true">
                                        <span class="notification-push-editor__switch-thumb"></span>
                                    </span>
                                </label>
                            </div>

                            <div class="notification-push-editor__divider"></div>

                            <section class="notification-push-editor__empty">
                                <h4 class="notification-push-editor__empty-title">
                                    푸시 알림 켜기
                                </h4>
                                <p class="notification-push-editor__empty-copy">
                                    푸시 알림을 통해 지금 일어나는 일에 대한 소식을 실시간으로 받아보세요. X에 로그인하지 않아도 알림을 받을 수 있습니다. 알림은 언제든지 끌 수 있습니다.
                                </p>
                                <button
                                    type="button"
                                    class="notification-push-editor__enable"
                                    data-notification-push-enable
                                >
                                    켜기
                                </button>
                            </section>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-mute-block-edit") {
            detailTitle.textContent = "뮤트 및 차단";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-mute-block" data-detail-route>
                        <section class="privacy-mute-block-editor">
                            <p class="privacy-mute-block-editor__summary">
                                내가 뮤트했거나 차단한 계정, 단어 및 알림을 관리합니다.
                            </p>

                            <button
                                type="button"
                                class="privacy-mute-block-editor__item"
                                data-privacy-mute-block-item="blocked-accounts"
                            >
                                <span class="privacy-mute-block-editor__item-title">
                                    차단한 계정
                                </span>
                                <span class="privacy-mute-block-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>

                            <button
                                type="button"
                                class="privacy-mute-block-editor__item"
                                data-privacy-mute-block-item="muted-accounts"
                            >
                                <span class="privacy-mute-block-editor__item-title">
                                    뮤트한 계정
                                </span>
                                <span class="privacy-mute-block-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>

                            <button
                                type="button"
                                class="privacy-mute-block-editor__item"
                                data-privacy-mute-block-item="muted-words"
                            >
                                <span class="privacy-mute-block-editor__item-title">
                                    뮤트한 단어
                                </span>
                                <span class="privacy-mute-block-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>

                            <button
                                type="button"
                                class="privacy-mute-block-editor__item"
                                data-privacy-mute-block-item="muted-notifications"
                            >
                                <span class="privacy-mute-block-editor__item-title">
                                    뮤트 상태의 알림
                                </span>
                                <span class="privacy-mute-block-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-blocked-accounts-edit") {
            detailTitle.textContent = "차단한 계정";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-blocked-accounts" data-detail-route>
                        <section class="privacy-blocked-accounts-editor">
                            <p class="privacy-blocked-accounts-editor__summary">
                                사용자를 차단하면 해당 사용자는 나를 팔로우하거나 내게 쪽지를 보낼 수 없고, 해당 사용자의 알림이 표시되지 않습니다.
                                <a href="#" class="privacy-blocked-accounts-editor__link" data-privacy-blocked-accounts-link>자세히 알아보기</a>
                            </p>

                            <section class="privacy-blocked-accounts-editor__empty">
                                <h3 class="privacy-blocked-accounts-editor__empty-title">
                                    원치 않는 계정 차단하기
                                </h3>
                                <p class="privacy-blocked-accounts-editor__empty-copy">
                                    차단된 사용자는 나를 팔로우하거나 내게 쪽지를 보낼 수 없으며, 해당 사용자에 대한 알림이 표시되지 않습니다.
                                    <a href="#" class="privacy-blocked-accounts-editor__link" data-privacy-blocked-accounts-link>자세히 알아보기</a>
                                </p>
                            </section>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-muted-accounts-edit") {
            detailTitle.textContent = "뮤트한 계정";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-muted-accounts" data-detail-route>
                        <section class="privacy-muted-accounts-editor">
                            <p class="privacy-muted-accounts-editor__summary">
                                뮤트한 계정의 게시물은 홈 타임라인에 표시되지 않으며, 해당 계정에 대한 알림도 표시되지 않습니다.
                                <a href="#" class="privacy-muted-accounts-editor__link" data-privacy-muted-accounts-link>자세히 알아보기</a>
                            </p>

                            <section class="privacy-muted-accounts-editor__empty">
                                <h3 class="privacy-muted-accounts-editor__empty-title">
                                    원치 않는 계정 뮤트하기
                                </h3>
                                <p class="privacy-muted-accounts-editor__empty-copy">
                                    뮤트한 사용자의 게시물은 홈 타임라인에 표시되지 않으며, 해당 사용자에 대한 알림도 표시되지 않습니다.
                                    <a href="#" class="privacy-muted-accounts-editor__link" data-privacy-muted-accounts-link>자세히 알아보기</a>
                                </p>
                            </section>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-muted-words-edit") {
            detailTitle.textContent = "뮤트한 단어";
            setDetailHeaderAction({
                iconPath: icons.add,
                ariaLabel: "뮤트한 단어 추가",
                action: "muted-words-add",
            });

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-muted-words" data-detail-route>
                        <section class="privacy-muted-words-editor">
                            <section class="privacy-muted-words-editor__empty">
                                <h3 class="privacy-muted-words-editor__empty-title">
                                    뮤트할 단어 추가
                                </h3>
                                <p class="privacy-muted-words-editor__empty-copy">
                                    단어를 뮤트하면 해당 단어를 포함한 게시물이 홈 타임라인에서 보이지 않으며, 관련 알림도 받지 않게 됩니다.
                                    <a href="#" class="privacy-muted-words-editor__link" data-privacy-muted-words-link>자세히 알아보기</a>
                                </p>
                            </section>

                            <section class="privacy-muted-words-editor__list" data-privacy-muted-words-list>
                                <!-- 서버에서 뮤트한 단어 목록을 렌더링할 때 아래 아이템 구조를 반복해서 사용합니다. -->
                                <article class="privacy-muted-word-item" data-privacy-muted-word-item>
                                    <div class="privacy-muted-word-item__copy">
                                        <strong class="privacy-muted-word-item__term">
                                            방귀 뿡뿡
                                        </strong>
                                        <span class="privacy-muted-word-item__meta">
                                            영원히
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        class="privacy-muted-word-item__action"
                                        aria-label="뮤트한 단어 편집"
                                    >
                                        ${buildIcon(icons.mute, "privacy-muted-word-item__action-icon")}
                                    </button>
                                </article>
                            </section>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-muted-words-add-edit") {
            detailTitle.textContent = "뮤트할 단어 추가하기";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-muted-words-add" data-detail-route>
                        <form class="privacy-muted-word-form" data-privacy-muted-word-form novalidate>
                            <div class="privacy-muted-word-form__field-shell" data-privacy-muted-word-field>
                                <label class="privacy-muted-word-form__field">
                                    <input
                                        type="text"
                                        class="privacy-muted-word-form__input"
                                        value="${mutedWordFormState.value}"
                                        placeholder="단어 또는 문구를 입력하세요"
                                        aria-label="단어 또는 문구를 입력하세요"
                                        data-privacy-muted-word-input
                                    />
                                </label>
                            </div>
                            <p class="privacy-muted-word-form__help">
                                한 번에 단어, 문구, @사용자 아이디, 해시태그 중 하나만 뮤트할 수 있습니다.
                                <a href="#" class="privacy-muted-word-form__link" data-privacy-muted-word-link>자세히 알아보기</a>
                            </p>

                            <section class="privacy-muted-word-form__section">
                                <h3 class="privacy-muted-word-form__section-title">
                                    다음에서 뮤트
                                </h3>

                                <label class="privacy-muted-word-form__check-row">
                                    <span class="privacy-muted-word-form__check-label">
                                        홈 타임라인
                                    </span>
                                    <span class="privacy-muted-word-form__check-control">
                                        <input
                                            type="checkbox"
                                            class="privacy-muted-word-form__checkbox"
                                            data-privacy-muted-word-timeline-toggle
                                            ${mutedWordFormState.muteFromTimeline ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__checkbox-box" aria-hidden="true">
                                            ${buildIcon(
                                                "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                            )}
                                        </span>
                                    </span>
                                </label>

                                <label class="privacy-muted-word-form__switch-row">
                                    <span class="privacy-muted-word-form__switch-label">
                                        알림
                                    </span>
                                    <span class="privacy-muted-word-form__switch-control">
                                        <input
                                            type="checkbox"
                                            class="privacy-muted-word-form__switch-input"
                                            data-privacy-muted-word-notifications-toggle
                                            ${mutedWordFormState.muteNotifications ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__switch-track" aria-hidden="true">
                                            <span class="privacy-muted-word-form__switch-thumb"></span>
                                        </span>
                                    </span>
                                </label>

                                <div class="privacy-muted-word-form__divider"></div>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        모든 사용자
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordAudience"
                                            class="privacy-muted-word-form__radio"
                                            value="everyone"
                                            data-privacy-muted-word-audience
                                            ${mutedWordFormState.notificationAudience === "everyone" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        내가 팔로우하지 않는 사람들
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordAudience"
                                            class="privacy-muted-word-form__radio"
                                            value="non-following"
                                            data-privacy-muted-word-audience
                                            ${mutedWordFormState.notificationAudience === "non-following" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>
                            </section>

                            <section class="privacy-muted-word-form__section privacy-muted-word-form__section--duration">
                                <h3 class="privacy-muted-word-form__section-title">
                                    기간
                                </h3>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        해당 단어를 언뮤트할 때까지
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordDuration"
                                            class="privacy-muted-word-form__radio"
                                            value="until-unmuted"
                                            data-privacy-muted-word-duration
                                            ${mutedWordFormState.duration === "until-unmuted" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        24시간
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordDuration"
                                            class="privacy-muted-word-form__radio"
                                            value="24h"
                                            data-privacy-muted-word-duration
                                            ${mutedWordFormState.duration === "24h" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        7일
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordDuration"
                                            class="privacy-muted-word-form__radio"
                                            value="7d"
                                            data-privacy-muted-word-duration
                                            ${mutedWordFormState.duration === "7d" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>

                                <label class="privacy-muted-word-form__radio-row">
                                    <span class="privacy-muted-word-form__radio-label">
                                        30일
                                    </span>
                                    <span class="privacy-muted-word-form__radio-control">
                                        <input
                                            type="radio"
                                            name="mutedWordDuration"
                                            class="privacy-muted-word-form__radio"
                                            value="30d"
                                            data-privacy-muted-word-duration
                                            ${mutedWordFormState.duration === "30d" ? "checked" : ""}
                                        />
                                        <span class="privacy-muted-word-form__radio-box" aria-hidden="true"></span>
                                    </span>
                                </label>
                            </section>

                            <div class="privacy-muted-word-form__footer">
                                <button
                                    type="submit"
                                    class="privacy-muted-word-form__save"
                                    data-privacy-muted-word-save
                                    disabled
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </section>
                `,
            );

            const mutedWordForm = detailContent.querySelector(
                "[data-privacy-muted-word-form]",
            );
            const mutedWordInput = detailContent.querySelector(
                "[data-privacy-muted-word-input]",
            );
            const mutedWordField = detailContent.querySelector(
                "[data-privacy-muted-word-field]",
            );
            const mutedWordSave = detailContent.querySelector(
                "[data-privacy-muted-word-save]",
            );

            if (
                mutedWordForm instanceof HTMLFormElement &&
                mutedWordInput instanceof HTMLInputElement &&
                mutedWordField instanceof HTMLElement &&
                mutedWordSave instanceof HTMLButtonElement
            ) {
                const syncMutedWordFormState = () => {
                    const hasValue = mutedWordInput.value.trim().length > 0;
                    mutedWordField.classList.toggle(
                        "privacy-muted-word-form__field-shell--active",
                        document.activeElement === mutedWordInput || hasValue,
                    );
                    mutedWordSave.disabled = !hasValue;
                    mutedWordSave.classList.toggle(
                        "privacy-muted-word-form__save--enabled",
                        hasValue,
                    );
                };

                mutedWordInput.addEventListener("focus", syncMutedWordFormState);
                mutedWordInput.addEventListener("blur", syncMutedWordFormState);
                mutedWordInput.addEventListener("input", () => {
                    mutedWordFormState.value = mutedWordInput.value;
                    syncMutedWordFormState();
                });

                mutedWordForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    syncMutedWordFormState();
                });

                syncMutedWordFormState();
            }

            return true;
        }

        if (activeDetailRoute === "privacy-posts-edit") {
            detailTitle.textContent = "내 게시물";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-posts" data-detail-route>
                        <section class="privacy-posts-editor">
                            <p class="privacy-posts-editor__summary">
                                게시물과 관련된 정보를 관리합니다.
                            </p>

                            <label class="privacy-posts-editor__sensitive">
                                <span class="privacy-posts-editor__sensitive-copy">
                                    <span class="privacy-posts-editor__sensitive-title">
                                        게시하는 미디어를 민감한 내용이 포함될 수 있는 미디어로 표시하기
                                    </span>
                                    <span class="privacy-posts-editor__sensitive-description">
                                        활성화하면 게시하는 사진과 동영상이 민감한 콘텐츠가 표시되기를 원치 않는 사람들에게 민감한 콘텐츠로 표시됩니다.
                                        <a href="#" class="privacy-posts-editor__link" data-privacy-posts-link>자세히 알아보기</a>
                                    </span>
                                </span>
                                <span class="privacy-posts-editor__sensitive-control">
                                    <input
                                        type="checkbox"
                                        class="privacy-posts-editor__checkbox"
                                        data-privacy-posts-sensitive-toggle
                                        ${privacyPostsState.isSensitiveMediaMarked ? "checked" : ""}
                                    />
                                    <span class="privacy-posts-editor__checkbox-box" aria-hidden="true">
                                        ${buildIcon(
                                            "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                        )}
                                    </span>
                                </span>
                            </label>

                            <button
                                type="button"
                                class="privacy-posts-editor__item"
                                data-privacy-posts-route="location"
                            >
                                <span class="privacy-posts-editor__item-title">
                                    게시물에 위치 정보 넣기
                                </span>
                                <span class="privacy-posts-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "privacy-posts-location-edit") {
            detailTitle.textContent = "게시물에 위치 정보 넣기";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--privacy-posts-location" data-detail-route>
                        <section class="privacy-posts-location-editor">
                            <p class="privacy-posts-location-editor__summary">
                                활성화하면 게시물에 위치 정보를 첨부할 수 있습니다.
                                <a href="#" class="privacy-posts-location-editor__link" data-privacy-posts-location-link>자세히 알아보기</a>
                            </p>

                            <label class="privacy-posts-location-editor__toggle-row">
                                <span class="privacy-posts-location-editor__toggle-title">
                                    게시물에 위치 정보 넣기
                                </span>
                                <span class="privacy-posts-location-editor__toggle-control">
                                    <input
                                        type="checkbox"
                                        class="privacy-posts-location-editor__checkbox"
                                        data-privacy-posts-location-toggle
                                        ${privacyPostsState.isLocationEnabled ? "checked" : ""}
                                    />
                                    <span class="privacy-posts-location-editor__checkbox-box" aria-hidden="true">
                                        ${buildIcon(
                                            "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                                        )}
                                    </span>
                                </span>
                            </label>

                            <button
                                type="button"
                                class="privacy-posts-location-editor__delete"
                                data-privacy-posts-location-delete
                            >
                                게시물에 추가된 모든 위치 정보를 삭제합니다
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "phone-edit") {
            detailTitle.textContent = "휴대폰 변경";
            const phoneItem = accountInfoItems.find(
                (item) => item.id === "phone",
            );
            const phoneValue = phoneItem?.value || "+821099139076";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--phone" data-detail-route>
                        <div class="phone-editor">
                            <button
                                type="button"
                                class="phone-editor__action"
                                data-modal-type="phone-add"
                            >
                                휴대폰 번호 추가
                            </button>
                        </div>
                        <!-- 서버에서 휴대폰 인증 완료 후 hidden을 제거하고 값을 주입해 기존 휴대폰 번호 추가 화면을 대체합니다. -->
                        <section
                            class="phone-editor phone-editor--verified"
                            data-phone-verified-screen
                            hidden
                            aria-hidden="true"
                        >
                            <div class="phone-editor__current-card">
                                <span class="phone-editor__current-label">
                                    현재 이메일
                                </span>
                                <span class="phone-editor__current-value">
                                    ${phoneValue}
                                </span>
                            </div>
                            <div class="phone-editor__verified-actions">
                                <button
                                    type="button"
                                    class="phone-editor__verified-action phone-editor__verified-action--update"
                                >
                                    휴대폰 번호 업데이트
                                </button>
                                <button
                                    type="button"
                                    class="phone-editor__verified-action phone-editor__verified-action--delete"
                                >
                                    휴대폰 번호 삭제
                                </button>
                            </div>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "email-edit") {
            detailTitle.textContent = "이메일 변경";
            const emailItem = accountInfoItems.find(
                (item) => item.id === "email",
            );
            const emailValue = emailItem?.value || "tjdgh1851@gmail.com";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--email" data-detail-route>
                        <section class="email-editor">
                            <div class="email-editor__current-card">
                                <span class="email-editor__current-label">
                                    현재 이메일
                                </span>
                                <span class="email-editor__current-value">
                                    ${emailValue}
                                </span>
                            </div>
                            <div class="email-editor__actions">
                                <button
                                    type="button"
                                    class="email-editor__action"
                                >
                                    이메일 주소 업데이트
                                </button>
                            </div>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        if (activeDetailRoute === "country-edit") {
            detailTitle.textContent = "국가 변경";
            const countryItem = accountInfoItems.find(
                (item) => item.id === "country",
            );
            const currentCountry = countryItem?.value || "대한민국";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--country" data-detail-route>
                        <section class="country-editor">
                            <div class="country-editor__section">
                                <label class="country-editor__field">
                                    <span class="country-editor__label">국가</span>
                                    <select
                                        class="country-editor__select"
                                        aria-label="국가"
                                        data-country-select
                                    >
                                        ${countryOptionMarkup}
                                    </select>
                                    <span class="country-editor__arrow" aria-hidden="true">
                                        ${buildIcon(
                                            "M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z",
                                        )}
                                    </span>
                                </label>
                                <p class="country-editor__help">
                                    사용자 계정과 연결된 기본 국가입니다. 사용자의 국가는 X 환경을 맞춤화하는 데 사용됩니다.
                                    <a href="#" class="country-editor__help-link">자세히 알아보기</a>
                                </p>
                            </div>
                        </section>
                    </section>
                `,
            );

            const countrySelect = detailContent.querySelector(
                "[data-country-select]",
            );

            if (countrySelect instanceof HTMLSelectElement) {
                const matchedOption = Array.from(countrySelect.options).find(
                    (option) => option.textContent?.trim() === currentCountry,
                );

                if (matchedOption) {
                    countrySelect.value = matchedOption.value;
                }

                countrySelect.addEventListener("change", () => {
                    const selectedCountry =
                        countrySelect.selectedOptions[0]?.textContent?.trim() ||
                        currentCountry;

                    if (countryItem) {
                        countryItem.value = selectedCountry;
                    }
                });
            }

            return true;
        }

        if (activeDetailRoute === "language-edit") {
            detailTitle.textContent = "언어";

            detailContent.insertAdjacentHTML(
                "beforeend",
                `
                    <section class="detail-route detail-route--language" data-detail-route>
                        <section class="language-editor">
                            <p class="language-editor__summary">
                                사용자 환경을 맞춤 설정할 때 사용되는 언어를 관리합니다.
                            </p>
                            <button
                                type="button"
                                class="language-editor__item"
                                data-modal-type="language-select"
                            >
                                <span class="language-editor__item-copy">
                                    <span class="language-editor__item-title">
                                        앱 및 게시 언어
                                    </span>
                                    <span class="language-editor__item-value">
                                        ${getCombinedLanguageLabel()}
                                    </span>
                                </span>
                                <span class="language-editor__item-arrow" aria-hidden="true">
                                    ${buildIcon(icons.arrow)}
                                </span>
                            </button>
                        </section>
                    </section>
                `,
            );

            return true;
        }

        detailContent.insertAdjacentHTML(
            "beforeend",
            `
                <section class="detail-route detail-route--info" data-detail-route>
                    <div class="account-info-list">
                        ${accountInfoItems
                            .map(
                                (item) => `
                                    <button type="button" class="account-info-item" data-account-info-id="${item.id}">
                                        <span class="account-info-item__content">
                                            <span class="account-info-item__label">${item.label}</span>
                                            <span class="account-info-item__value">${item.value || "&nbsp;"}</span>
                                            ${item.description ? `<span class="account-info-item__description">${item.description}</span>` : ""}
                                        </span>
                                        ${item.showArrow === false ? "" : `<span class="account-info-item__arrow">${buildIcon(icons.arrow)}</span>`}
                                    </button>
                                `,
                            )
                            .join("")}
                    </div>
                </section>
            `,
        );

        return true;
    }

    /*
     * 좌측 메뉴 렌더링:
     * - 검색어로 필터링된 항목만 노출
     * - 현재 섹션은 배경색과 오른쪽 파란 인디케이터를 붙인다
     * - 외부 링크는 외부 링크 아이콘을 사용한다
     */
    function renderNavigation(searchTerm = "") {
        const normalizedTerm = searchTerm.trim().toLowerCase();
        navigationList.innerHTML = navigationSections
            .map((section) => {
                const isVisible =
                    !normalizedTerm ||
                    section.label.toLowerCase().includes(normalizedTerm);
                const isActive = section.id === activeSectionId;
                const arrowIcon = section.external
                    ? icons.external
                    : icons.arrow;

                return `
                    <div class="navigation-entry${isActive ? " navigation-entry--active" : ""}${isVisible ? "" : " navigation-entry--hidden"}">
                        <a
                            class="navigation-entry__link"
                            href="${section.href}"
                            role="tab"
                            aria-selected="${String(isActive)}"
                            data-section-id="${section.id}"
                            ${section.external ? 'target="_blank" rel="noreferrer"' : ""}
                        >
                            <span class="navigation-entry__label">${section.label}</span>
                            <span class="navigation-entry__icon">
                                ${buildIcon(arrowIcon)}
                            </span>
                        </a>
                        ${isActive ? '<span class="navigation-entry__indicator" aria-hidden="true"></span>' : ""}
                    </div>
                `;
            })
            .join("");
    }

    /*
     * 우측 상세 패널 렌더링:
     * - 좌측 메뉴에서 선택된 섹션의 제목/설명/항목 목록을 교체한다
     * - `modal` 값이 있는 항목은 실제 페이지 이동 대신 오버레이를 연다
     */
    function renderDetail() {
        const section = getActiveSectionData();
        const existingRoute = detailContent.querySelector(
            "[data-detail-route]",
        );
        existingRoute?.remove();
        resetDetailHeaderAction();
        detailBackButton.hidden = true;
        detailSummary.hidden = false;
        detailList.hidden = false;

        if (renderDetailRoute()) {
            return;
        }

        detailTitle.textContent = section.title;
        detailSummary.textContent = section.summary;

        if (section.entries.length === 0) {
            detailList.innerHTML =
                '<p class="detail-entry__empty">문서에서 상세 분석된 섹션만 현재 클론 범위에 포함되어 있습니다.</p>';
            return;
        }

        detailList.innerHTML = section.entries
            .map((entry) => {
                const descriptionMarkup = entry.description
                    ? `<p class="detail-entry__description">${entry.description}</p>`
                    : "";
                const modalAttrs = entry.modal
                    ? `data-modal-type="${entry.modal}"`
                    : "";

                return `
                    <a
                        class="detail-entry"
                        href="${entry.href}"
                        role="tab"
                        aria-selected="false"
                        ${modalAttrs}
                    >
                        <span class="detail-entry__content">
                            <span class="detail-entry__icon">
                                ${buildIcon(entry.icon)}
                            </span>
                            <span class="detail-entry__body">
                                <span class="detail-entry__title">${entry.title}</span>
                                ${descriptionMarkup}
                            </span>
                        </span>
                        <span class="detail-entry__arrow">
                            ${buildIcon(icons.arrow)}
                        </span>
                    </a>
                `;
            })
            .join("");
    }

    /*
     * 표시 모달의 선택지 렌더링:
     * - 색상 선택은 브랜드 포인트 컬러만 바꾼다
     * - 배경 선택은 body data 속성을 바꿔 페이지 전체 톤을 바꾼다
     */
    function renderAppearanceOptions() {
        appearanceAccentList.innerHTML = accentOptions
            .map(
                (option) => `
                    <button
                        type="button"
                        class="appearance-chip${appearanceState.accent === option.id ? " appearance-chip--active" : ""}"
                        data-accent-id="${option.id}"
                    >
                        <span class="appearance-chip__dot" style="background:${option.color}"></span>
                        <span class="appearance-chip__label">${option.label}</span>
                    </button>
                `,
            )
            .join("");

        appearanceSurfaceList.innerHTML = surfaceOptions
            .map(
                (option) => `
                    <button
                        type="button"
                        class="surface-chip${appearanceState.surface === option.id ? " surface-chip--active" : ""}"
                        data-surface-id="${option.id}"
                    >
                        <span class="surface-chip__swatch" style="background:${option.color}"></span>
                        <span class="surface-chip__label">${option.label}</span>
                    </button>
                `,
            )
            .join("");
    }

    /*
     * body data 속성은 CSS 토큰을 직접 바꾸는 역할을 한다.
     * 이 방식으로 JS는 상태만 관리하고 실제 색상/배경 적용은 CSS가 담당한다.
     */
    function applyAppearanceState() {
        document.body.dataset.fontScale = appearanceState.fontScale;
        document.body.dataset.accent = appearanceState.accent;
        document.body.dataset.surface = appearanceState.surface;
        appearanceFontRange.value = appearanceState.fontScale;
        renderAppearanceOptions();
    }

    function applyPhoneAddActionState() {
        const hasPhoneNumber = phoneModalState.phoneNumber.trim().length > 0;

        phoneAddActionButton.textContent = hasPhoneNumber ? "다음" : "취소";
        phoneAddActionButton.classList.toggle(
            "phone-modal__action--primary",
            hasPhoneNumber,
        );
    }

    function renderPhoneAddStep() {
        const isCodeStep = phoneModalState.step === "code";
        const isHelpMenuVisible = isCodeStep && phoneModalState.isHelpMenuOpen;

        phoneAddStep.hidden = isCodeStep;
        phoneCodeStep.hidden = !isCodeStep;
        phoneCodeNumber.textContent =
            phoneModalState.phoneNumber || "01099139076";
        phoneCodeInput.value = phoneModalState.code;
        phoneCodeHelpMenu.hidden = !isHelpMenuVisible;
        phoneCodeHelpButton.setAttribute(
            "aria-expanded",
            String(isHelpMenuVisible),
        );
        phoneCodeActionButton.disabled =
            phoneModalState.code.trim().length === 0;
        phoneCodeActionButton.classList.toggle(
            "phone-modal__action--primary",
            phoneModalState.code.trim().length > 0,
        );
        phoneCodeActionButton.classList.toggle(
            "phone-modal__action--disabled",
            phoneModalState.code.trim().length === 0,
        );
    }

    function openModal(modalType) {
        activeModal = modalType;
        modalLayer.hidden = false;
        appearanceModal.hidden = modalType !== "appearance";
        shortcutModal.hidden = modalType !== "shortcuts";
        languageSelectionModal.hidden = modalType !== "language-select";
        phoneAddModal.hidden = modalType !== "phone-add";
        phoneVerifyModal.hidden = true;

        if (modalType === "appearance") {
            appearanceCompleteButton.focus();
        } else if (modalType === "shortcuts") {
            const closeButton = shortcutModal.querySelector(".modal-close");
            closeButton?.focus();
        } else if (modalType === "language-select") {
            languageSelectionState.step = "choices";
            languageSelectionState.query = "";
            languageSelectionState.showAll = false;
            languageSelectionSearchInput.value = "";
            renderLanguageSelectionModal();
            languageSelectionSearchInput.focus();
        } else if (modalType === "phone-add") {
            phoneModalState.step = "add";
            phoneModalState.isHelpMenuOpen = false;
            phoneAddInput.value = phoneModalState.phoneNumber;
            applyPhoneAddActionState();
            renderPhoneAddStep();
            phoneAddInput.focus();
        }
    }

    function closeModal() {
        activeModal = "";
        modalLayer.hidden = true;
        appearanceModal.hidden = true;
        shortcutModal.hidden = true;
        languageSelectionModal.hidden = true;
        phoneAddModal.hidden = true;
        phoneVerifyModal.hidden = true;
        phoneModalState.isHelpMenuOpen = false;
    }

    function selectSection(sectionId) {
        activeSectionId = sectionId;
        activeDetailRoute = "";
        renderNavigation(searchInput.value);
        renderDetail();
    }

    searchInput.addEventListener("input", () => {
        renderNavigation(searchInput.value);
    });

    navigationList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const link = target.closest("[data-section-id]");
        if (!(link instanceof HTMLAnchorElement)) {
            return;
        }

        const sectionId = link.dataset.sectionId;
        if (!sectionId) {
            return;
        }

        if (!link.target || link.target === "_self") {
            event.preventDefault();
        }

        if (link.target === "_blank") {
            return;
        }

        selectSection(sectionId);
    });

    detailList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const entryLink = target.closest(".detail-entry");
        if (!(entryLink instanceof HTMLAnchorElement)) {
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") ===
                "/settings/your_twitter_data/account"
        ) {
            event.preventDefault();
            activeDetailRoute = "account-info-auth";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") === "/settings/password"
        ) {
            event.preventDefault();
            activeDetailRoute = "password-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") === "/settings/deactivate"
        ) {
            event.preventDefault();
            activeDetailRoute = "deactivate-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "notifications" &&
            entryLink.getAttribute("href") === "/settings/notifications/filters"
        ) {
            event.preventDefault();
            activeDetailRoute = "notification-filter-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "notifications" &&
            entryLink.getAttribute("href") ===
                "/settings/notifications/preferences"
        ) {
            event.preventDefault();
            activeDetailRoute = "notification-preferences-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
                "/settings/privacy_and_safety/your_posts"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-posts-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
                "/settings/privacy_and_safety/mute_and_block"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-mute-block-edit";
            renderDetail();
            return;
        }

        const entry = target.closest("[data-modal-type]");
        if (!(entry instanceof HTMLAnchorElement)) {
            return;
        }

        const modalType = entry.dataset.modalType;
        if (!modalType) {
            return;
        }

        event.preventDefault();
        openModal(modalType);
    });

    detailContent.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const deactivateLink = target.closest("[data-deactivate-link]");
        if (deactivateLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const notificationFilterLink = target.closest(
            "[data-notification-filter-link]",
        );
        if (notificationFilterLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyPostsLink = target.closest("[data-privacy-posts-link]");
        if (privacyPostsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyPostsLocationLink = target.closest(
            "[data-privacy-posts-location-link]",
        );
        if (privacyPostsLocationLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const blockedAccountsLink = target.closest(
            "[data-privacy-blocked-accounts-link]",
        );
        if (blockedAccountsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedAccountsLink = target.closest(
            "[data-privacy-muted-accounts-link]",
        );
        if (mutedAccountsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedWordsLink = target.closest("[data-privacy-muted-words-link]");
        if (mutedWordsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedWordFormLink = target.closest("[data-privacy-muted-word-link]");
        if (mutedWordFormLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const modalButton = target.closest("[data-modal-type]");
        if (modalButton instanceof HTMLButtonElement) {
            const modalType = modalButton.dataset.modalType;
            if (modalType) {
                openModal(modalType);
                return;
            }
        }

        const notificationFilterToggle = target.closest(
            "[data-notification-filter-toggle]",
        );
        if (notificationFilterToggle instanceof HTMLInputElement) {
            notificationFilterState.isQualityFilterEnabled =
                notificationFilterToggle.checked;
            return;
        }

        const notificationFilterRoute = target.closest(
            "[data-notification-filter-route]",
        );
        if (notificationFilterRoute instanceof HTMLButtonElement) {
            if (
                notificationFilterRoute.dataset.notificationFilterRoute ===
                "muted"
            ) {
                activeDetailRoute = "notification-muted-edit";
                renderDetail();
            }
            return;
        }

        const notificationPreferencesRoute = target.closest(
            "[data-notification-preferences-route]",
        );
        if (notificationPreferencesRoute instanceof HTMLButtonElement) {
            if (
                notificationPreferencesRoute.dataset
                    .notificationPreferencesRoute === "push"
            ) {
                activeDetailRoute = "notification-push-edit";
                renderDetail();
            } else if (
                notificationPreferencesRoute.dataset
                    .notificationPreferencesRoute === "email"
            ) {
                activeDetailRoute = "notification-email-edit";
                renderDetail();
            }
            return;
        }

        const privacyPostsRoute = target.closest("[data-privacy-posts-route]");
        if (privacyPostsRoute instanceof HTMLButtonElement) {
            if (privacyPostsRoute.dataset.privacyPostsRoute === "location") {
                activeDetailRoute = "privacy-posts-location-edit";
                renderDetail();
            }
            return;
        }

        const privacyMuteBlockItem = target.closest(
            "[data-privacy-mute-block-item]",
        );
        if (privacyMuteBlockItem instanceof HTMLButtonElement) {
            if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "blocked-accounts"
            ) {
                activeDetailRoute = "privacy-blocked-accounts-edit";
                renderDetail();
            } else if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "muted-accounts"
            ) {
                activeDetailRoute = "privacy-muted-accounts-edit";
                renderDetail();
            } else if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "muted-words"
            ) {
                activeDetailRoute = "privacy-muted-words-edit";
                renderDetail();
            }
            return;
        }

        const notificationPushEnable = target.closest(
            "[data-notification-push-enable]",
        );
        if (notificationPushEnable instanceof HTMLButtonElement) {
            notificationPreferenceState.isPushEnabled = true;
            renderDetail();
            return;
        }

        const privacyPostsLocationDelete = target.closest(
            "[data-privacy-posts-location-delete]",
        );
        if (privacyPostsLocationDelete instanceof HTMLButtonElement) {
            return;
        }

        const infoButton = target.closest("[data-account-info-id]");
        if (!(infoButton instanceof HTMLButtonElement)) {
            return;
        }

        if (infoButton.dataset.accountInfoId === "username") {
            usernameState.draft = usernameState.current;
            activeDetailRoute = "username-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "phone") {
            activeDetailRoute = "phone-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "email") {
            activeDetailRoute = "email-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "country") {
            activeDetailRoute = "country-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "language") {
            activeDetailRoute = "language-edit";
            renderDetail();
        }
    });

    detailContent.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        if (target.matches("[data-notification-filter-toggle]")) {
            notificationFilterState.isQualityFilterEnabled = target.checked;
            return;
        }

        if (target.matches("[data-notification-muted-toggle]")) {
            const optionKey = target.dataset.notificationMutedToggle;
            if (
                optionKey &&
                Object.hasOwn(
                    notificationFilterState.mutedNotificationOptions,
                    optionKey,
                )
            ) {
                notificationFilterState.mutedNotificationOptions[optionKey] =
                    target.checked;
            }
            return;
        }

        if (target.matches("[data-notification-push-toggle]")) {
            notificationPreferenceState.isPushEnabled = target.checked;
            return;
        }

        if (target.matches("[data-notification-email-toggle]")) {
            const toggleKey = target.dataset.notificationEmailToggle;
            if (toggleKey === "enabled") {
                notificationPreferenceState.isEmailEnabled = target.checked;
                return;
            }

            if (
                toggleKey &&
                Object.hasOwn(
                    notificationPreferenceState.emailAlerts,
                    toggleKey,
                )
            ) {
                notificationPreferenceState.emailAlerts[toggleKey] =
                    target.checked;
            }
            return;
        }

        if (target.matches("[data-notification-email-digest]")) {
            notificationPreferenceState.emailDigest = target.value;
            return;
        }

        if (target.matches("[data-privacy-posts-sensitive-toggle]")) {
            privacyPostsState.isSensitiveMediaMarked = target.checked;
            return;
        }

        if (target.matches("[data-privacy-posts-location-toggle]")) {
            privacyPostsState.isLocationEnabled = target.checked;
            return;
        }

        if (target.matches("[data-privacy-muted-word-timeline-toggle]")) {
            mutedWordFormState.muteFromTimeline = target.checked;
            return;
        }

        if (
            target.matches("[data-privacy-muted-word-notifications-toggle]")
        ) {
            mutedWordFormState.muteNotifications = target.checked;
            return;
        }

        if (target.matches("[data-privacy-muted-word-audience]")) {
            mutedWordFormState.notificationAudience = target.value;
            return;
        }

        if (target.matches("[data-privacy-muted-word-duration]")) {
            mutedWordFormState.duration = target.value;
        }
    });

    detailActionButton.addEventListener("click", () => {
        const action = detailActionButton.dataset.detailAction;
        if (action === "muted-words-add") {
            activeDetailRoute = "privacy-muted-words-add-edit";
            renderDetail();
            return;
        }
    });

    detailBackButton.addEventListener("click", () => {
        if (
            activeDetailRoute === "username-edit" ||
            activeDetailRoute === "phone-edit" ||
            activeDetailRoute === "email-edit" ||
            activeDetailRoute === "country-edit" ||
            activeDetailRoute === "language-edit"
        ) {
            activeDetailRoute = "account-info-list";
        } else if (
            activeDetailRoute === "password-edit" ||
            activeDetailRoute === "deactivate-edit" ||
            activeDetailRoute === "notification-filter-edit" ||
            activeDetailRoute === "notification-preferences-edit" ||
            activeDetailRoute === "privacy-mute-block-edit" ||
            activeDetailRoute === "privacy-posts-edit"
        ) {
            activeDetailRoute = "";
        } else if (activeDetailRoute === "privacy-blocked-accounts-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-accounts-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-words-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-words-add-edit") {
            activeDetailRoute = "privacy-muted-words-edit";
        } else if (activeDetailRoute === "privacy-posts-location-edit") {
            activeDetailRoute = "privacy-posts-edit";
        } else if (activeDetailRoute === "notification-muted-edit") {
            activeDetailRoute = "notification-filter-edit";
        } else if (activeDetailRoute === "notification-push-edit") {
            activeDetailRoute = "notification-preferences-edit";
        } else if (activeDetailRoute === "notification-email-edit") {
            activeDetailRoute = "notification-preferences-edit";
        } else if (activeDetailRoute === "account-info-list") {
            activeDetailRoute = "account-info-auth";
        } else {
            activeDetailRoute = "";
        }
        renderDetail();
    });

    phoneAddCloseButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (phoneModalState.step === "code") {
            phoneModalState.step = "add";
            phoneModalState.isHelpMenuOpen = false;
            renderPhoneAddStep();
            phoneAddInput.focus();
            return;
        }

        closeModal();
    });

    phoneAddInput.addEventListener("input", () => {
        phoneModalState.phoneNumber = phoneAddInput.value;
        applyPhoneAddActionState();
    });

    phoneCodeInput.addEventListener("input", () => {
        phoneModalState.code = phoneCodeInput.value;
        renderPhoneAddStep();
    });

    phoneCodeHelpButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        phoneModalState.isHelpMenuOpen = !phoneModalState.isHelpMenuOpen;
        renderPhoneAddStep();
    });

    phoneAddActionButton.addEventListener("click", () => {
        const phoneNumber = phoneAddInput.value.trim();
        phoneModalState.phoneNumber = phoneNumber;

        if (!phoneNumber) {
            closeModal();
            return;
        }

        phoneVerifyNumber.textContent = phoneNumber;
        phoneVerifyModal.hidden = false;
        activeModal = "phone-verify";
        phoneVerifyConfirmButton.focus();
    });

    phoneVerifyEditButton.addEventListener("click", () => {
        phoneVerifyModal.hidden = true;
        activeModal = "phone-add";
        phoneAddInput.focus();
    });

    phoneVerifyConfirmButton.addEventListener("click", () => {
        phoneVerifyModal.hidden = true;
        activeModal = "phone-add";
        phoneModalState.step = "code";
        phoneModalState.code = "";
        phoneModalState.isHelpMenuOpen = false;
        renderPhoneAddStep();
        phoneCodeInput.focus();
    });

    phoneCodeResendButton.addEventListener("click", (event) => {
        event.stopPropagation();
        phoneModalState.isHelpMenuOpen = false;
        renderPhoneAddStep();
        phoneCodeInput.focus();
    });

    languageSelectionSearchInput.addEventListener("input", () => {
        languageSelectionState.query = languageSelectionSearchInput.value;
        renderLanguageSelectionModal();
    });

    languageSelectionList.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        const optionId = target.dataset.languageOptionId;
        if (!optionId) {
            return;
        }

        if (languageSelectionState.step === "app") {
            languageSelectionState.appLanguageId = optionId;
            renderLanguageSelectionModal();
            return;
        }

        if (target.checked) {
            languageSelectionState.selectedIds.add(optionId);
        } else {
            languageSelectionState.selectedIds.delete(optionId);
        }
    });

    languageSelectionMoreButton.addEventListener("click", () => {
        languageSelectionState.showAll = true;
        renderLanguageSelectionModal();
    });

    languageSelectionNextButton.addEventListener("click", () => {
        if (languageSelectionState.step === "choices") {
            const selectedOptions = languageSelectionOptions.filter((option) =>
                languageSelectionState.selectedIds.has(option.id),
            );
            languageSelectionState.appLanguageId =
                selectedOptions[0]?.id || "ko";
            languageSelectionState.step = "app";
            renderLanguageSelectionModal();
            languageSelectionBackButton.focus();
            return;
        }

        const languageItem = accountInfoItems.find(
            (item) => item.id === "language",
        );
        if (languageItem) {
            languageItem.value = getCombinedLanguageLabel();
        }

        closeModal();

        if (activeDetailRoute === "language-edit") {
            renderDetail();
        }
    });

    languageSelectionSkipButton.addEventListener("click", () => {
        closeModal();
    });

    languageSelectionBackButton.addEventListener("click", () => {
        languageSelectionState.step = "choices";
        renderLanguageSelectionModal();
        languageSelectionSearchInput.focus();
    });

    modalLayer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (
            phoneModalState.isHelpMenuOpen &&
            !target.closest("#phoneCodeHelp")
        ) {
            phoneModalState.isHelpMenuOpen = false;
            renderPhoneAddStep();
        }

        if (target.hasAttribute("data-modal-close")) {
            closeModal();
        }
    });

    appearanceAccentList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("[data-accent-id]");
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        appearanceState.accent = button.dataset.accentId || "blue";
        applyAppearanceState();
    });

    appearanceSurfaceList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("[data-surface-id]");
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        appearanceState.surface = button.dataset.surfaceId || "light";
        applyAppearanceState();
    });

    appearanceFontRange.addEventListener("input", () => {
        appearanceState.fontScale = appearanceFontRange.value;
        applyAppearanceState();
    });

    appearanceCompleteButton.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && activeModal) {
            closeModal();
        }
    });

    applyAppearanceState();
    renderNavigation();
    renderDetail();
});
