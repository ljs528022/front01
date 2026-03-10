window.onload = () => {
    // 상담 받기 버튼
    const newChatBtn = document.querySelector(".ChatContent-Button");
    // 새 채팅방 div
    const newChatDiv = document.querySelector(".Chat-ChatContent");
    // 채팅방 div
    const chatDiv = document.querySelector(".ChatPage-Layout");
    // 채팅방 유저
    const chatUser = chatDiv.querySelector(".ChatPage-UserInfo");

    // 좌측의 채팅방이 있는 유저들
    const chats = document.querySelectorAll(".UserList-EachUser") || null;
    // 모달 백드롭
    const modalBackDrop = document.querySelector(".Modal-BackDrop");
    // 전문가 검색 모달
    const searchExpertModal = document.querySelector(".Search-Modal");
    // 상대방 정보 모달
    const userInfoModal = document.querySelector(".Big-Modal.Info");
    // 사라진 메세지 설정 모달
    const removedMsgModal = document.querySelector(".Big-Modal.RemovedMsg");
    // 모든 대화 지우기 모달
    const removeAllMsgModal = document.querySelector(".Small-Modal.RemoveAll");
    // 스크린샷 차단 설정 모달
    const banScreanShotModal = document.querySelector(
        ".Big-Modal.BanScreanShot",
    );
    // 전달 전용 검색 모달
    const postChatModal = document.querySelector(".Small-Modal.PostChat");
    // 특정 채팅 지우기 모달
    const deleteChatModal = document.querySelector(".Small-Modal.DeleteChat");
    // 채팅방 나가기 모달
    const leaveModal = document.querySelector(".Small-Modal.Leave");
    // 대화 차단 모달
    const bnnUserModal = document.querySelector(".Small-Modal.Ban-User");

    // 이모지 api -----------------------------------
    // 채팅 입력란 이모지 버튼
    const picker = new EmojiButton({
        position: "bottom-start",
    });
    picker.on("emoji", (emoji) => {
        const textBox = document.getElementById("chat-input");
        textBox.value += emoji;
    });

    // 채팅 메뉴 이모지 버튼
    const emojiPicker = document.querySelector(".Chat-Emoji-Picker");
    let activeEmoteBtn = null;

    function openEmojiPicker(btn) {
        emojiPicker.classList.remove("off");
        const rect = btn.getBoundingClientRect();
        const pickerWidth = emojiPicker.offsetWidth;
        const pickerHeight = emojiPicker.offsetHeight;

        const top = rect.top - pickerHeight - 8;
        let left = rect.left;

        if (left + pickerWidth > window.innerWidth) {
            left = window.innerWidth - pickerWidth - 8;
        }

        emojiPicker.style.top = `${top}px`;
        emojiPicker.style.left = `${left}px`;
        activeEmoteBtn = btn;
    }

    function closeEmojiPicker() {
        emojiPicker.classList.add("off");
        activeEmoteBtn = null;
    }

    // 이모지 선택 이벤트
    emojiPicker.querySelectorAll(".Emoji-Button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const emoji = btn.dataset.emoji;
            const targetChat = activeEmoteBtn?.closest(".Each-Main-Content");

            // 이모지 div 추가
            addReaction(emoji, targetChat);
            closeEmojiPicker();

            closeEmojiPicker();
        });
    });

    // 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
        if (!emojiPicker.contains(e.target)) {
            closeEmojiPicker();
        }
    });

    // ---------------------------------------------

    // 상담 받기 클릭시 전문가 검색창 표시
    newChatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(searchExpertModal);

        // 전문가 모달창 닫기 버튼
        const closeBtn = searchExpertModal.querySelector(
            ".Modal-Header-Button",
        );
        // 전문가 모달창 input
        const searchInput = document.querySelector(
            ".Search-Modal-SearchBar input",
        );

        let timer;
        const delay = 1000;

        // 전문가 회원 검색
        searchInput.addEventListener("keyup", (e) => {
            e.preventDefault();

            clearTimeout(timer);

            // 검색 값이 입력되면 1초 뒤에 검색
            timer = setTimeout(() => {
                // 여기에 rest api 요청 작성
            }, delay);
        });

        // 검색한 전문가들
        const experts = searchExpertModal.querySelectorAll(".Each-Expert");
        // 전문가를 선택하면 모달이 닫히고 채팅방 불러오기
        experts.forEach((expert) => {
            expert.addEventListener("click", (e) => {
                // 새 채팅방 요청

                // 완료되면 모달 닫고 채팅방 div 열기
                closeModal(searchExpertModal);
                newChatDiv.classList.add("off");
                chatDiv.classList.remove("off");
            });
        });

        // 닫기 버튼 누르면 모달창 닫기
        closeBtn.addEventListener("click", (e) => {
            closeModal(searchExpertModal);
        });
    });

    // 채팅방 이벤트 --------------------------------------
    // 채팅방이 있다면 클릭 시 채팅방 불러오기
    if (chats) {
        chats.forEach((chat) => {
            chat.addEventListener("click", (e) => {
                // 눌린 채팅방에 current 추가
                chats.forEach((c) => c.classList.remove("current"));
                chat.classList.add("current");

                // 해당 유저의 채팅방 요청

                // 성공하면 채팅방 열기
                newChatDiv.classList.add("off");
                chatDiv.classList.remove("off");
            });
        });
    }

    // 채팅방 버튼들
    const buttons = chatDiv.querySelectorAll(".ChatPage-Button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const divName = button.classList[1];
            console.log(divName);
            switch (divName) {
                case "VideoCall":
                    alert("추후 업데이트 예정입니다.");
                    break;
                case "UserInfo":
                    openModal(userInfoModal);
                    break;
            }
        });
    });
    // 채팅들
    const conversations = chatDiv.querySelectorAll(
        ".Left, .Right, .MyReply, .Reply",
    );
    // 답변 채팅들
    const replyCons = chatDiv.querySelectorAll(".MyReply, .Reply");

    // 채팅 입력란 Emote 버튼
    const emoteButton = document.getElementById("emoji-btn");

    // 채팅 메뉴 누르면 메뉴 등장하는 이벤트
    const chatMenu = document.querySelector(".Chat-Extend-Menu");
    let activeBtn = null;

    // 메뉴 닫기 함수
    function closeMenu() {
        if (activeBtn) {
            const menu = activeBtn.closest(".Message-Buttons");
            if (menu) menu.classList.add("off");
        }
        chatMenu.classList.remove("on");
        chatMenu.classList.add("off");
        activeBtn = null;
    }

    // 메뉴 위치 업데이트 함수
    function updateMenuPosition() {
        if (!activeBtn) return;

        const rect = activeBtn.getBoundingClientRect();

        // 버튼이 화면 밖으로 벗어나면 메뉴 닫기
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            closeMenu();
            return;
        }

        const menuHeight = chatMenu.offsetHeight;
        const menuWidth = chatMenu.offsetWidth;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceRight = window.innerWidth - rect.left;

        // 아래 공간이 메뉴 height만큼 없으면 위로
        let top;
        if (spaceBelow >= menuHeight) {
            top = rect.bottom + 8;
        } else {
            top = rect.top - menuHeight - 8;
        }

        let left;
        if (spaceRight >= menuWidth) {
            left = rect.left;
        } else {
            left = rect.right - menuWidth;
        }

        chatMenu.style.top = `${top}px`;
        chatMenu.style.left = `${left}px`;
    }

    // 각 채팅에 마우스가 올라가면 메뉴바 표시
    conversations.forEach((c) => {
        const menu = c.querySelector(".Message-Buttons");
        const emojiBtn = menu.querySelector(".Message-Button.Emote");
        const moreBtn = menu.querySelector(".Message-Button.Menu");
        const chatEmoteBtn = menu.querySelector(".Message-Button.Emote");
        if (menu) {
            c.addEventListener("mouseover", (e) => {
                menu.classList.remove("off");
            });
            c.addEventListener("mouseleave", (e) => {
                // 메뉴바가 열려있고 이 채팅의 버튼이 activeBtn이면 숨기지 않음
                if (activeBtn === moreBtn) return;
                menu.classList.add("off");
            });

            // 이모지 버튼 이벤트
            emojiBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (
                    activeEmoteBtn === chatEmoteBtn &&
                    !emojiPicker.classList.contains("off")
                ) {
                    closeEmojiPicker();
                    return;
                }
                openEmojiPicker(chatEmoteBtn);
            });

            // 더보기 메뉴 이벤트
            moreBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                // 같은 버튼 다시 클릭 시 닫기
                if (
                    activeBtn === moreBtn &&
                    chatMenu.classList.contains("on")
                ) {
                    closeMenu();
                    return;
                }

                activeBtn = moreBtn;
                updateMenuPosition();
                chatMenu.classList.remove("off");
                chatMenu.classList.add("on");
            });
            // 이모지 클릭 이벤트
            chatEmoteBtn.addEventListener("click", (e) => {
                pickerMenu.togglePicker(chatEmoteBtn);
            });
        }
    });

    // 스크롤 시 메뉴 위치 업데이트
    const scrollContainer = document.querySelector(".ChatPage-Main-Container");
    scrollContainer.addEventListener(
        "scroll",
        () => {
            if (chatMenu.classList.contains("on")) {
                updateMenuPosition();
            }
        },
        { passive: true },
    );

    // 외부 클릭 시 메뉴 닫기
    document.addEventListener("click", (e) => {
        if (!chatMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // 채팅 메뉴 이벤트
    const toast = document.querySelector(".Clipboard-Toast");
    const chatMenuBtns = chatMenu.querySelectorAll(".Extend-Menu-Button");
    chatMenuBtns.forEach((button) => {
        button.addEventListener("click", (e) => {
            const name = button.getAttribute("name");
            switch (name) {
                case "reply":
                    // 답글 로직
                    break;
                case "trans":
                    openModal(postChatModal);
                    break;
                case "copy":
                    // 현재 열린 채팅의 메시지 내용 가져오기
                    const messageContent = activeBtn
                        .closest(".Each-Main-Content")
                        ?.querySelector(".Message-Content")?.innerText;

                    if (!messageContent) break;

                    navigator.clipboard
                        .writeText(messageContent)
                        .then(() => {
                            // 이미 애니메이션 중이면 초기화
                            toast.classList.remove("show");
                            void toast.offsetWidth; // reflow 강제

                            toast.classList.add("show");

                            setTimeout(() => {
                                toast.classList.remove("show");
                            }, 4000);
                        })
                        .catch(() => {
                            console.error("클립보드 복사 실패");
                        });
                    break;
                case "delete":
                    openModal(deleteChatModal);
                    break;
            }
        });
    });

    // 답변의 채팅누르면 해당 채팅으로 이동 후 애니메이션 이벤트
    replyCons.forEach((reply) => {
        reply.addEventListener("click", () => {
            const targetId = reply.dataset.replyTo;
            if (!targetId) return;

            const targetLi = document.querySelector(
                `[data-chat-id="${targetId}"]`,
            );
            if (!targetLi) return;

            // 1. 스크롤 이동
            targetLi.scrollIntoView({ behavior: "smooth", block: "center" });

            // 2. 스크롤 완료 후 방향에 따라 애니메이션 실행
            setTimeout(() => {
                const messageContainer = targetLi.closest(".Each-Main-Content");
                if (!messageContainer) return;

                // 방향 판별 - li의 클래스로 확인
                const isLeft = targetLi.classList.contains("Left");
                const animClass = isLeft ? "chat-pop-right" : "chat-pop-left";

                // 기존 클래스 제거 후 재실행
                messageContainer.classList.remove(
                    "chat-pop-right",
                    "chat-pop-left",
                );
                void messageContainer.offsetWidth; // reflow 강제

                messageContainer.classList.add(animClass);

                messageContainer.addEventListener(
                    "animationend",
                    () => {
                        messageContainer.classList.remove(animClass);
                    },
                    { once: true },
                );
            }, 400);
        });
    });

    // 하단 입력란 부분 -------------------------------------
    // 채팅 입력 wrapper
    const chatInputDiv = document.querySelector(".Input-TextArea-Container");
    // 채팅 입력 form
    const chatForm = document.getElementById("chatSubmit");
    // 채팅 입력 input
    const chatInput = document.getElementById("chat-input");
    // 채팅 첨부파일 div
    const chatAttachDiv = document.querySelector(".Input-Image-Card");
    // 채팅 첨부파일 input
    const chatAttach = document.getElementById("chat-image");
    // 채팅 submit 버튼
    const chatSubmit = document.querySelector(".Submit-Button-Wrapper");

    // 채팅 input에 입력값이 있으면 버튼 활성화
    chatInput.addEventListener("keyup", (e) => {
        if (chatInput.value) {
            chatSubmit.classList.remove("off");
        } else {
            chatSubmit.classList.add("off");
        }
    });

    // 채팅 보내기 이벤트 -----------------------------
    chatSubmit.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            // 엔터키 눌리면 submit
            chatForm.submit();
        }
    });
    chatSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        chatForm.submit();
    });

    // 이모지 버튼 이벤트
    emoteButton.addEventListener("click", (e) => {
        picker.togglePicker(emoteButton);
    });

    // 모달 이벤트 부분 -------------------------------------
    // 채팅방 회원 정보 누르면 모달 열기
    chatUser.addEventListener("click", (e) => {
        modalBackDrop.classList.remove("off");
        userInfoModal.classList.remove("off");
    });

    // 회원 정보 모달 닫기 버튼
    const userInfoClose = userInfoModal.querySelector(
        ".Big-Modal-Button.Close",
    );
    userInfoClose.addEventListener("click", (e) => {
        modalBackDrop.classList.add("off");
        userInfoModal.classList.add("off");
    });

    // 회원 정보 모달 버튼들
    userInfoModal.addEventListener("click", (e) => {});

    // 모달 여닫기 이벤트 ---------------------
    // 모달 열기
    function openModal(modal) {
        modalBackDrop.classList.remove("off");
        modal.classList.remove("off");
    }

    // 모달 닫기
    function closeModal(modal) {
        modalBackDrop.classList.add("off");
        modal.classList.add("off");
    }

    // 백드롭 클릭 시 모든 모달 닫기
    modalBackDrop.addEventListener("click", () => {
        const modals = document.querySelectorAll(
            ".Big-Modal, .Small-Modal, .Search-Modal",
        );
        modals.forEach((modal) => modal.classList.add("off"));
        modalBackDrop.classList.add("off");
    });

    // 채팅에 이모지 div 추가하기
    function addReaction(emoji, targetChat) {
        if (!targetChat) return;

        const reactionsDiv = targetChat.querySelector(".Message-Reactions");
        if (!reactionsDiv) return;

        const existing = [
            ...reactionsDiv.querySelectorAll(".Reaction-Badge"),
        ].find((badge) => badge.dataset.emoji === emoji);

        if (existing) {
            if (existing.classList.contains("my-reaction")) {
                const countEl = existing.querySelector(".Reaction-Count");
                const count = parseInt(countEl.textContent) - 1;

                if (count <= 0) {
                    existing.remove();
                } else {
                    countEl.textContent = count;
                    existing.classList.remove("my-reaction");
                }
            } else {
                const countEl = existing.querySelector(".Reaction-Count");
                countEl.textContent = parseInt(countEl.textContent) + 1;
                existing.classList.add("my-reaction");
            }
        } else {
            const badge = document.createElement("div");
            badge.classList.add("Reaction-Badge", "my-reaction");
            badge.dataset.emoji = emoji;
            badge.innerHTML = `<span>${emoji}</span><span class="Reaction-Count">1</span>`;

            badge.addEventListener("click", () => {
                addReaction(emoji, targetChat);
            });

            reactionsDiv.appendChild(badge);
        }

        // reaction 유무에 따라 클래스 토글
        if (reactionsDiv.children.length > 0) {
            targetChat.classList.add("has-reaction");
        } else {
            targetChat.classList.remove("has-reaction");
        }
    }
};
