(function () {
    "use strict";

    /* ===== CHARACTER COUNTER ===== */
    const nameInput = document.querySelector(
        '[data-test-id-v2="CampaignName-campaignNameField"]'
    );
    const counterEl = nameInput
        ? nameInput.nextElementSibling?.querySelector("[aria-hidden]")
        : null;
    const MAX_LEN = 255;

    if (nameInput && counterEl) {
        nameInput.addEventListener("input", () => {
            const remaining = Math.max(0, MAX_LEN - nameInput.value.length);
            counterEl.textContent = remaining;
            counterEl.style.color = remaining < 20 ? "#e0245e" : "";
        });
    }

    /* ===== SWITCH TOGGLE ===== */
    document.querySelectorAll(".Switch").forEach((sw) => {
        sw.addEventListener("click", () => {
            const checked = sw.getAttribute("aria-checked") === "true";
            sw.setAttribute("aria-checked", String(!checked));
            const textEl = sw.querySelector(".Switch-text");
            if (textEl) textEl.textContent = !checked ? "활성화" : "해제";
        });
        sw.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                sw.click();
            }
        });
    });

    /* ===== FIELDSET COLLAPSE / EXPAND (기본 열림 상태, is-closed 토글) ===== */
    document.querySelectorAll(".FormFieldset--canOpen").forEach((fieldset) => {
        const legend = fieldset.querySelector(".FormFieldset-legend");
        if (!legend) return;
        legend.addEventListener("click", () => {
            fieldset.classList.toggle("is-closed");
        });
    });

    /* ===== SIDEBAR TREE EXPAND / COLLAPSE ===== */
    document
        .querySelectorAll(".NavigationSidebar-item--hasChildItemGroup")
        .forEach((item) => {
            const btn = item.querySelector(
                ":scope > .NavigationSidebar-itemTargetWrapper > button"
            );
            if (!btn) return;
            btn.addEventListener("click", () => {
                const expanded = btn.getAttribute("aria-expanded") === "true";
                btn.setAttribute("aria-expanded", String(!expanded));
                item.classList.toggle("is-open", !expanded);
            });
        });

    /* ===== SIDEBAR ITEM SELECTION (hover만, 클릭 active 색상 없음) ===== */
    document
        .querySelectorAll(
            ".NavigationSidebar-item:not(.NavigationSidebar-item--hasChildItemGroup)"
        )
        .forEach((item) => {
            const btn = item.querySelector(
                ":scope > .NavigationSidebar-itemTargetWrapper > button"
            );
            if (!btn) return;
            btn.addEventListener("mousedown", (e) => {
                // active 시 background 변화 방지
                e.preventDefault();
            });
            btn.addEventListener("click", () => {
                document
                    .querySelectorAll(".NavigationSidebar-item.is-selected")
                    .forEach((el) => el.classList.remove("is-selected"));
                item.classList.add("is-selected");
            });
        });

    /* ===== FOOTER BUTTONS ===== */
    const exitBtn = document.querySelector(".PageFooter-startContent button");
    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
            if (confirm("캠페인 작성을 종료하시겠습니까?")) history.back();
        });
    }
    const endBtns = document.querySelectorAll(".PageFooter-endContent button");
    if (endBtns[0]) {
        endBtns[0].addEventListener("click", () => alert("임시 저장되었습니다."));
    }

    console.log("[Advertisement] 페이지 로드 완료.");
})();
