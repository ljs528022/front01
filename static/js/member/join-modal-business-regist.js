const btn = document.getElementById("addr-search-btn");
if (btn) {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    let isOpen = false;

    newBtn.addEventListener("click", () => {
        if (isOpen) return;
        isOpen = true;

        new daum.Postcode({
            oncomplete: function (data) {
                const fullAddr = data.roadAddress || data.jibunAddress;
                setReadonlyValue("postcode", data.zonecode);
                setReadonlyValue("addr-main", fullAddr);
                document.getElementById("addr-detail").focus();
                isOpen = false;
            },
            onclose: function () {
                isOpen = false;
            },
        }).open();
    });
}
document.getElementById("addr-search-btn").addEventListener("click", () => {
    new daum.Postcode({
        oncomplete: function (data) {
            const fullAddr = data.roadAddress || data.jibunAddress;
            document.getElementById("postcode").value = data.zonecode;
            document.getElementById("addr-main").value = fullAddr;
            document.getElementById("addr-detail").focus();
        },
    }).open();
});

document.addEventListener("DOMContentLoaded", () => {
    const fields = document.querySelectorAll(
        ".name-placeholder-wrap, .phone-number-placeholder",
    );

    fields.forEach((wrap) => {
        const input = wrap.querySelector("input");
        const label = wrap.querySelector(
            ".name-placeholder, .phone-placeholder",
        );
        const labelText = wrap.querySelector(".name-text, .phone-text");

        if (!input || !label) return;

        // 에러 메시지 요소 생성
        const errorMsg = document.createElement("span");
        errorMsg.textContent = "다시 입력하세요";
        errorMsg.style.cssText = `
            display: none;
            color: rgb(244, 33, 46);
            font-size: 12px;
            font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin-top: 4px;
            padding-left: 8px;
        `;
        wrap.appendChild(errorMsg);

        // 초기 상태 - 이미 값 있으면 라벨 작게
        if (input.value.trim() !== "") {
            shrink(labelText);
        }

        // 포커스 - 파란 테두리 + 라벨 작게
        input.addEventListener("focus", () => {
            label.style.borderColor = "rgb(29, 155, 240)";
            label.style.borderWidth = "2px";
            shrink(labelText);
        });

        // 입력 중 - 값 있으면 에러 숨김, 없으면 에러 표시
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                errorMsg.style.display = "none";
            } else {
                errorMsg.style.display = "block";
            }
        });

        // 블러 - 파란 테두리 제거 + 에러 무조건 숨김
        input.addEventListener("blur", () => {
            label.style.borderColor = "rgb(207, 217, 222)";
            label.style.borderWidth = "1px";
            errorMsg.style.display = "none";

            if (input.value.trim() === "" && !input.readOnly) {
                expand(labelText);
            }
        });
    });

    // 주소 자동 입력 후 라벨 처리
    document
        .getElementById("addr-search-btn")
        ?.addEventListener("click", () => {
            new daum.Postcode({
                oncomplete: function (data) {
                    const fullAddr = data.roadAddress || data.jibunAddress;
                    setReadonlyValue("postcode", data.zonecode);
                    setReadonlyValue("addr-main", fullAddr);
                    document.getElementById("addr-detail").focus();
                },
            }).open();
        });

    function setReadonlyValue(id, value) {
        const input = document.getElementById(id);
        if (!input) return;
        input.value = value;

        const wrap = input.closest(".phone-number-placeholder");
        const labelText = wrap?.querySelector(".phone-text");
        if (labelText) shrink(labelText);

        const label = wrap?.querySelector(".phone-placeholder");
        if (label) {
            label.style.borderColor = "rgb(207, 217, 222)";
            label.style.borderWidth = "1px";
        }
    }
});

function shrink(labelText) {
    if (!labelText) return;
    labelText.style.fontSize = "12px";
    labelText.style.paddingTop = "8px";
    labelText.style.color = "rgb(29, 155, 240)";
}

function expand(labelText) {
    if (!labelText) return;
    labelText.style.fontSize = "17px";
    labelText.style.paddingTop = "16px";
    labelText.style.color = "rgb(83, 100, 113)";
}
