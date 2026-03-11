(function () {
    "use strict";

    const objectiveOptions = [
        { value: "11", group: "인지도", title: "도달 범위", description: "광고의 도달 범위 극대화" },
        { value: "4", group: "고려 사항", title: "동영상 조회", description: "사람들이 내 동영상을 시청하도록 유도" },
        { value: "9", group: "고려 사항", title: "프리롤 조회수", description: "광고를 프리미엄 콘텐츠에 연결하기" },
        { value: "1", group: "고려 사항", title: "앱 설치", description: "사람들이 내 앱을 설치하도록 유도" },
        { value: "5", group: "고려 사항", title: "웹사이트 트래픽", description: "웹사이트로 트래픽 유도" },
        { value: "3", group: "고려 사항", title: "참여", description: "내 게시물에 대한 사용자의 참여 유도" },
        { value: "8", group: "전환", title: "앱 재참여", description: "사람들이 내 앱에서 액션을 취하도록 유도" },
        { value: "14", group: "전환", title: "판매", description: "사람들이 내 웹사이트를 방문하고 구매하도록 유도합니다.", badge: "새로운 기능" },
    ];

    const objectiveMap = Object.fromEntries(
        objectiveOptions.map((item) => [item.value, item])
    );

    const tooltipContentMap = {
        BudgetOptimizationTooltipButton: {
            text: "CBO(캠페인 예산 최적화)를 사용 설정하면 캠페인 수준에서 예산을 수립하고 가장 실적이 좋은 광고 그룹에 대한 광고비 지출을 극대화할 수 있습니다.",
            link: "https://business.x.com/en/help/campaign-setup/campaign-dates-and-budget.html",
        },
        SpendLimitTooltipButton: {
            text: "캠페인 전체 기간 동안 지출하려는 예산의 한도를 설정합니다.",
        },
    };

    const state = {
        objectiveValue: "14",
        objectiveDraftValue: "14",
        budgetOptimizationEnabled: false,
        advancedOpen: false,
        adGroupOpen: false,
        adGroupView: false,
    };

    const root = {
        accountButton: document.querySelector(".AccountTriggerButton"),
        profileButton: document.querySelector(".ProfileTriggerButton"),
        objectiveButton: document.querySelector(".ObjectiveEditButton"),
        paymentButton: document.querySelector(".PaymentMethodButton"),
        advancedButton: document.querySelector(".AdvancedToggleButton"),
        advancedFieldset: document.querySelector(".FormFieldset--canOpen"),
        advancedContent: document.querySelector(".AdvancedContentPanel"),
        budgetSwitch: document.querySelector(".BudgetOptimizationSwitch"),
        spendLimitSection: document.querySelector(".SpendLimitSection"),
        tooltipButtons: Array.from(document.querySelectorAll(".TooltipTriggerButton")),
        branchItem: document.querySelector(".AdGroupBranchItem"),
        branchButton: document.querySelector(".AdGroupBranchButton"),
        exitButton: document.querySelector(".ExitButton"),
        draftButton: document.querySelector(".DraftButton"),
        nextButton: document.querySelector(".NextStepButton"),
        campaignTitle: document.querySelector(".Module-title"),
        campaignSummaryTitle: document.querySelector('[data-test-id-v2="CampaignObjective-objectiveField"]'),
        campaignNameInput: document.querySelector('[data-test-id-v2="CampaignName-campaignNameField"]'),
    };

    function createFragment(markup) {
        const template = document.createElement("template");
        template.innerHTML = markup.trim();
        return template.content.firstElementChild;
    }

    function removeByRole(role) {
        document.querySelectorAll(`[data-role="${role}"]`).forEach((node) => node.remove());
    }

    function getObjectiveDescriptionNode() {
        return root.campaignSummaryTitle?.closest(".Grid--yAlignCenter")?.querySelector("p");
    }

    function syncCampaignCounter() {
        const input = root.campaignNameInput;
        const counter = input?.nextElementSibling?.querySelector("[aria-hidden]");
        const description = input
            ? document.getElementById(input.getAttribute("aria-describedby") || "")
            : null;

        if (!input || !counter) return;

        const remaining = Math.max(0, 255 - input.value.length);
        counter.textContent = String(remaining);
        if (description) description.textContent = `Characters left: ${remaining}`;
        counter.style.color = remaining < 20 ? "#e0245e" : "";
    }

    function syncObjectiveSummary() {
        const current = objectiveMap[state.objectiveValue];
        const descriptionNode = getObjectiveDescriptionNode();
        if (!current || !root.campaignSummaryTitle || !descriptionNode) return;

        root.campaignSummaryTitle.textContent = current.title;
        descriptionNode.textContent = current.description;
    }

    function closeDropdowns() {
        removeByRole("account-dropdown");
        removeByRole("profile-dropdown");

        [root.accountButton, root.profileButton].forEach((button) => {
            if (!button) return;
            button.setAttribute("aria-expanded", "false");
            button.classList.remove("is-focus", "is-mouseFocus");
        });
    }

    function closeTooltips() {
        removeByRole("tooltip-panel");
    }

    function closeModals() {
        ["objective-modal", "payment-modal", "modal-overlay"].forEach(removeByRole);
    }

    function closeDialogs() {
        ["confirmation-dialog", "confirmation-overlay"].forEach(removeByRole);
    }

    function showToast(message) {
        removeByRole("toast-notice");
        const toast = createFragment(`<div class="ToastNotice" data-role="toast-notice">${message}</div>`);
        document.body.appendChild(toast);
        window.setTimeout(() => toast.remove(), 1600);
    }

    function updateAdvancedSection() {
        if (!root.advancedFieldset || !root.advancedContent) return;

        root.advancedFieldset.classList.toggle("is-open", state.advancedOpen);
        root.advancedContent.style.display = state.advancedOpen ? "block" : "none";
        if (root.advancedButton) {
            root.advancedButton.setAttribute("aria-expanded", String(state.advancedOpen));
        }
    }

    function renderBudgetFields() {
        const existingPanel = document.querySelector(".BudgetFieldsPanel");
        if (!root.spendLimitSection) return;

        if (!state.budgetOptimizationEnabled) {
            root.spendLimitSection.style.display = "";
            if (existingPanel) existingPanel.remove();
            return;
        }

        root.spendLimitSection.style.display = "none";
        if (existingPanel) return;

        const panel = createFragment(`
            <div class="Grid-cell u-sizeFull BudgetFieldsPanel">
                <div class="FormField">
                    <div class="FormField-label">
                        <span class="FormField-labelText">일 캠페인 예산</span>
                    </div>
                    <div class="FormInputWrapper FormInputWrapper--withStartAdornment">
                        <input class="FormInput" type="text" value="100.00" />
                        <div class="FormInputWrapper-startAdornment">KRW</div>
                    </div>
                </div>
                <div class="FormField">
                    <div class="FormField-label">
                        <span class="FormField-labelText">총 캠페인 예산</span>
                    </div>
                    <div class="FormInputWrapper FormInputWrapper--withStartAdornment">
                        <input class="FormInput" type="text" value="0.00" />
                        <div class="FormInputWrapper-startAdornment">KRW</div>
                    </div>
                </div>
                <div class="FormField">
                    <div class="FormField-label">
                        <span class="FormField-labelText">진행 속도</span>
                    </div>
                    <div class="PacingOptionGroup">
                        <label class="PacingOption">
                            <input checked name="budget-pacing" type="radio" />
                            <span>표준(권장됨)</span>
                        </label>
                        <label class="PacingOption">
                            <input name="budget-pacing" type="radio" />
                            <span>가속</span>
                        </label>
                    </div>
                </div>
            </div>
        `);

        root.spendLimitSection.insertAdjacentElement("afterend", panel);
    }

    function updateBudgetSwitch() {
        if (!root.budgetSwitch) return;

        root.budgetSwitch.classList.toggle("is-checked", state.budgetOptimizationEnabled);
        root.budgetSwitch.setAttribute("aria-checked", String(state.budgetOptimizationEnabled));

        const textNode = root.budgetSwitch.querySelector(".Switch-text");
        if (textNode) {
            textNode.textContent = state.budgetOptimizationEnabled ? "켜기" : "해제";
        }

        renderBudgetFields();
    }

    function objectiveColumnsMarkup() {
        const groups = ["인지도", "고려 사항", "전환"];
        return groups
            .map((group) => {
                const options = objectiveOptions.filter((item) => item.group === group);
                return `
                    <div class="Grid-cell u-size1of3">
                        <div class="TileColumnLabel">${group}</div>
                        <div class="ObjectiveTileGroup" role="radiogroup">
                            ${options
                                .map((item) => {
                                    const selected = item.value === state.objectiveDraftValue;
                                    return `
                                        <button
                                            class="ObjectiveOptionTile${selected ? " is-selected" : ""}"
                                            data-role="objective-option"
                                            data-value="${item.value}"
                                            data-test-id="ObjectiveOption-objectiveTile"
                                            data-test-value="${item.value}"
                                            aria-checked="${selected}"
                                            role="radio"
                                            type="button"
                                        >
                                            <span class="ObjectiveTileHeader">
                                                <span class="ObjectiveTileMarker">
                                                    <span class="${selected ? "Icon Icon--featherCircleCheckFilled" : "Tile-selectCircle"}"></span>
                                                </span>
                                                <span class="ObjectiveTileLabel">
                                                    <span class="ObjectiveTileTitle">${item.title}</span>${item.badge ? `<span class="Label Label--green OjuMe3CYjfY2ahrWIuYq">${item.badge}</span>` : ""}
                                                </span>
                                            </span>
                                            <span class="ObjectiveTileDescription">${item.description}</span>
                                        </button>
                                    `;
                                })
                                .join("")}
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    function openObjectiveModal() {
        state.objectiveDraftValue = state.objectiveValue;
        closeModals();

        const unchanged = state.objectiveDraftValue === state.objectiveValue;

        document.body.append(
            createFragment('<div class="ModalOverlay ObjectiveModalOverlay" data-role="modal-overlay"></div>'),
            createFragment(`
                <div class="DialogModal ObjectiveModal" data-role="objective-modal">
                    <div class="DialogPanel PanelSurface">
                        <div class="PanelHeader">
                            <div class="Grid Grid--yAlignCenter">
                                <div class="Grid-cell u-sizeFill">
                                    <div class="Panel-title" role="heading">캠페인 목표</div>
                                </div>
                                <div class="Grid-cell u-sizeFit">
                                    <button aria-label="Close" class="IconButton IconButton--closeIcon" data-role="modal-close" type="button">
                                        <span aria-hidden="true" class="Icon Icon--close"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="PanelBody">
                            <div style="margin-bottom:16px;">
                                목표를 선택하는 데 도움이 필요하신가요?
                                <a href="https://business.x.com/en/solutions/twitter-ads.html" target="_blank" class="Button Button--link Button--xsmall">
                                    <span class="Button-label">자세히 알아보기</span>
                                </a>
                            </div>
                            <div class="Grid Grid--withGutter">
                                ${objectiveColumnsMarkup()}
                            </div>
                        </div>
                        <div class="PanelFooter">
                            <button class="Button" data-role="objective-cancel" type="button">
                                <span class="Button-label">취소</span>
                            </button>
                            <button class="Button Button--primary${unchanged ? " is-disabled" : ""}" ${unchanged ? "disabled" : ""} data-role="objective-confirm" type="button">
                                <span class="Button-label">다음</span>
                            </button>
                        </div>
                    </div>
                </div>
            `)
        );
    }

    function syncObjectiveModalSelection() {
        const modal = document.querySelector('[data-role="objective-modal"]');
        const confirmButton = modal?.querySelector('[data-role="objective-confirm"]');
        if (!modal || !confirmButton) return;

        modal.querySelectorAll('[data-role="objective-option"]').forEach((button) => {
            const selected = button.dataset.value === state.objectiveDraftValue;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-checked", String(selected));

            const icon = button.querySelector(".ObjectiveTileMarker > .Icon, .ObjectiveTileMarker > .Tile-selectCircle");
            if (icon) {
                icon.className = selected ? "Icon Icon--featherCircleCheckFilled" : "Tile-selectCircle";
            }
        });

        const unchanged = state.objectiveDraftValue === state.objectiveValue;
        confirmButton.disabled = unchanged;
        confirmButton.classList.toggle("is-disabled", unchanged);
    }

    function openPaymentModal() {
        closeModals();

        document.body.append(
            createFragment('<div class="ModalOverlay PaymentModalOverlay" data-role="modal-overlay"></div>'),
            createFragment(`
                <div class="DialogModal PaymentModal PaymentMethodDialog" data-role="payment-modal">
                    <div class="DialogPanel PanelSurface">
                        <div class="PanelHeader">
                            <div class="Grid Grid--yAlignCenter">
                                <div class="Grid-cell u-sizeFill"></div>
                                <div class="Grid-cell u-sizeFit">
                                    <button aria-label="Close" class="IconButton IconButton--closeIcon" data-role="modal-close" type="button">
                                        <span aria-hidden="true" class="Icon Icon--close"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="PanelBody">
                            <h2 style="margin:0 0 8px;">신용카드 추가</h2>
                            <p style="margin:0 0 20px;color:rgb(83, 100, 113);line-height:1.5;">
                                카드를 추가하면 모든 활성 캠페인 비용은 이 카드에 청구됩니다. 결제 설정에서 언제든지 변경할 수 있습니다.
                            </p>
                            <div style="display:grid;gap:14px;">
                                <label class="FormField">
                                    <span class="FormField-labelText">성명</span>
                                    <input class="FormInput" type="text" />
                                </label>
                                <label class="FormField">
                                    <span class="FormField-labelText">카드 번호</span>
                                    <input class="FormInput" type="text" />
                                </label>
                                <div class="Grid Grid--withGutter">
                                    <div class="Grid-cell u-size1of2">
                                        <label class="FormField">
                                            <span class="FormField-labelText">만기일</span>
                                            <input class="FormInput" placeholder="MM/YY" type="text" />
                                        </label>
                                    </div>
                                    <div class="Grid-cell u-size1of2">
                                        <label class="FormField">
                                            <span class="FormField-labelText">보안 코드</span>
                                            <input class="FormInput" placeholder="CVC/CVV" type="text" />
                                        </label>
                                    </div>
                                </div>
                                <h3 style="margin:6px 0 0;">청구지 주소</h3>
                                <label class="FormField">
                                    <span class="FormField-labelText">국가</span>
                                    <select class="FormInput"><option>대한민국</option></select>
                                </label>
                                <label class="FormField">
                                    <span class="FormField-labelText">도로명</span>
                                    <input class="FormInput" type="text" />
                                </label>
                                <label class="FormField">
                                    <span class="FormField-labelText">집 전화번호</span>
                                    <input class="FormInput" type="text" />
                                </label>
                            </div>
                        </div>
                        <div class="PanelFooter">
                            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-input bg-background shadow-sm" data-role="payment-cancel" type="button">취소</button>
                            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-black bg-black text-white shadow" data-role="payment-save" type="button">카드 저장</button>
                        </div>
                    </div>
                </div>
            `)
        );
    }

    function openDropdown(type, button) {
        if (!button) return;

        const role = type === "account" ? "account-dropdown" : "profile-dropdown";
        const isOpen = Boolean(document.querySelector(`[data-role="${role}"]`));
        closeDropdowns();
        if (isOpen) return;

        const rect = button.getBoundingClientRect();
        button.setAttribute("aria-expanded", "true");
        button.classList.add("is-focus", "is-mouseFocus");

        const markup =
            type === "account"
                ? `
                    <div class="DropdownMenu AccountDropdown" data-role="account-dropdown" id="feather-dropdown-1" style="top:${rect.bottom + 8}px;right:${Math.max(12, window.innerWidth - rect.right)}px;width:min(520px, calc(100vw - 24px));">
                        <ul class="DropdownMenuList">
                            <li><a class="DropdownMenuItem" href="/billing/payment_methods">새로운 결제 방법 추가</a></li>
                            <li><a class="DropdownMenuItem" href="/account_settings">계정 설정</a></li>
                            <li><a class="DropdownMenuItem" href="/account_management/access">계정 접근 권한 수정</a></li>
                        </ul>
                        <div class="DropdownFooter">© 2026 X Corp. · 이용약관 · 개인정보 취급방침 · 광고 약관 · 자세히</div>
                    </div>
                `
                : `
                    <div class="DropdownMenu ProfileDropdown" data-role="profile-dropdown" style="top:${rect.bottom + 8}px;right:${Math.max(12, window.innerWidth - rect.right)}px;">
                        <ul class="DropdownMenuList">
                            <li><a class="DropdownMenuItem" href="https://x.com/profile">내 프로필 보기</a></li>
                            <li><a class="DropdownMenuItem" href="https://x.com/logout">로그아웃</a></li>
                        </ul>
                    </div>
                `;

        document.body.appendChild(createFragment(markup));
    }

    function openTooltip(button) {
        closeTooltips();
        if (!button) return;

        const tooltipKey = Object.keys(tooltipContentMap).find((key) => button.classList.contains(key));
        const config = tooltipKey ? tooltipContentMap[tooltipKey] : null;
        if (!config) return;

        const rect = button.getBoundingClientRect();
        const left = Math.min(window.innerWidth - 332, rect.right + 12);
        const top = Math.max(12, rect.top - 8);

        document.body.appendChild(
            createFragment(`
                <div class="TooltipPanel" data-role="tooltip-panel" style="top:${top}px;left:${left}px;">
                    <button class="IconButton IconButton--closeIcon TooltipPanelClose" data-role="tooltip-close" type="button">
                        <span aria-hidden="true" class="Icon Icon--close"></span>
                    </button>
                    <div class="TooltipPanelInner">
                        <div>${config.text}</div>
                        ${config.link ? `<div style="margin-top:10px;"><a href="${config.link}" target="_blank" style="color:rgb(29, 155, 240);">자세히 알아보기</a></div>` : ""}
                    </div>
                </div>
            `)
        );
    }

    function ensureAdGroupChildren() {
        let group = root.branchItem?.querySelector(".AdGroupChildGroup");
        if (group || !root.branchItem) return group;

        group = createFragment(`
            <ul class="NavigationSidebar-itemGroup AdGroupChildGroup" role="tree" style="display:none;">
                <li class="NavigationSidebar-item" role="presentation">
                    <div class="NavigationSidebar-itemTargetWrapper">
                        <button aria-expanded="false" role="treeitem" class="f6AkmDQDUFvEsDg7W97g AdGroupDetailsButton">
                            <span class="NavigationSidebar-itemTargetInnerWrapper">
                                <span class="NavigationSidebar-itemTargetChildren">광고 그룹 세부정보</span>
                            </span>
                        </button>
                    </div>
                </li>
                <li class="NavigationSidebar-item" role="presentation">
                    <div class="NavigationSidebar-itemTargetWrapper">
                        <button aria-expanded="false" role="treeitem" class="f6AkmDQDUFvEsDg7W97g">
                            <span class="NavigationSidebar-itemTargetInnerWrapper">
                                <span class="NavigationSidebar-itemTargetChildren">광고 1</span>
                            </span>
                        </button>
                    </div>
                </li>
            </ul>
        `);

        root.branchItem.appendChild(group);
        return group;
    }

    function updateAdGroupBranch() {
        if (!root.branchItem || !root.branchButton) return;

        const group = ensureAdGroupChildren();
        root.branchItem.classList.toggle("is-open", state.adGroupOpen);
        root.branchButton.setAttribute("aria-expanded", String(state.adGroupOpen));

        const icon = root.branchButton.querySelector(".NavigationSidebar-itemEndIcon");
        if (icon) {
            icon.classList.remove("Icon--caretRight", "Icon--caretDown");
            icon.classList.add(state.adGroupOpen ? "Icon--caretDown" : "Icon--caretRight");
        }

        if (group) {
            group.style.display = state.adGroupOpen ? "" : "none";
        }
    }

    function openConfirmationDialog() {
        closeDialogs();
        document.body.append(
            createFragment('<div class="ConfirmationOverlay" data-role="confirmation-overlay"></div>'),
            createFragment(`
                <div class="ConfirmationDialog DialogModal" data-role="confirmation-dialog">
                    <div class="DialogPanel PanelSurface" role="alertdialog" data-state="open">
                        <div class="PanelBody">
                            <h2 style="margin:0 0 8px;">종료 확인하기</h2>
                            <p style="margin:0 0 20px;">계속하시겠어요? 변경사항이 삭제됩니다.</p>
                            <div style="display:flex;justify-content:flex-end;gap:12px;">
                                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-input bg-background shadow-sm" data-role="confirmation-cancel" type="button">취소</button>
                                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border border-black bg-black text-white shadow" data-role="confirmation-confirm" type="button">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        );
    }

    function updateSidebarSelectionForAdGroup() {
        const selected = document.querySelector(".NavigationSidebar-item.is-selected");
        if (selected) selected.classList.remove("is-selected");

        const childGroup = ensureAdGroupChildren();
        if (!childGroup) return;

        state.adGroupOpen = true;
        updateAdGroupBranch();
        const firstChild = childGroup.querySelector(".NavigationSidebar-item");
        if (firstChild) firstChild.classList.add("is-selected");
    }

    function showAdGroupDetailsView() {
        state.adGroupView = true;
        updateSidebarSelectionForAdGroup();
        if (root.campaignTitle) root.campaignTitle.textContent = "광고 그룹 세부정보";
        if (root.exitButton) root.exitButton.textContent = "뒤로";
        showToast("광고 그룹 세부정보로 이동했습니다.");
    }

    function showCampaignDetailsView() {
        state.adGroupView = false;

        const selected = document.querySelector(".NavigationSidebar-item.is-selected");
        if (selected) selected.classList.remove("is-selected");

        const campaignItem = document.querySelector('[data-test-id-v2="AdGroupNavigationSidebar-adGroupNavigationSidebar"] .NavigationSidebar-item');
        if (campaignItem) campaignItem.classList.add("is-selected");

        if (root.campaignTitle) root.campaignTitle.textContent = "캠페인 세부정보";
        if (root.exitButton) root.exitButton.textContent = "종료";
    }

    function handleDocumentClick(event) {
        const target = event.target instanceof Element ? event.target : null;
        const button = target?.closest("button");

        if (button?.matches(".ObjectiveEditButton")) return openObjectiveModal();
        if (button?.matches(".PaymentMethodButton")) return openPaymentModal();

        if (button?.matches(".AdvancedToggleButton")) {
            state.advancedOpen = !state.advancedOpen;
            updateAdvancedSection();
            return;
        }

        if (target?.closest(".BudgetOptimizationSwitch")) {
            state.budgetOptimizationEnabled = !state.budgetOptimizationEnabled;
            updateBudgetSwitch();
            return;
        }

        if (button?.classList.contains("TooltipTriggerButton")) return openTooltip(button);
        if (button?.matches(".AccountTriggerButton")) return openDropdown("account", button);
        if (button?.matches(".ProfileTriggerButton")) return openDropdown("profile", button);

        if (button?.matches(".AdGroupBranchButton")) {
            state.adGroupOpen = !state.adGroupOpen;
            updateAdGroupBranch();
            return;
        }

        if (button?.matches(".ExitButton")) {
            if (state.adGroupView) {
                showCampaignDetailsView();
            } else {
                openConfirmationDialog();
            }
            return;
        }

        if (button?.matches(".NextStepButton")) return showAdGroupDetailsView();
        if (button?.matches(".DraftButton")) return showToast("임시 저장되었습니다.");
        if (button?.matches('[data-role="modal-close"], [data-role="objective-cancel"], [data-role="payment-cancel"]')) return closeModals();

        if (button?.matches('[data-role="objective-option"]')) {
            state.objectiveDraftValue = button.dataset.value || state.objectiveDraftValue;
            syncObjectiveModalSelection();
            return;
        }

        if (button?.matches('[data-role="objective-confirm"]')) {
            state.objectiveValue = state.objectiveDraftValue;
            syncObjectiveSummary();
            closeModals();
            showToast("캠페인 목표가 변경되었습니다.");
            return;
        }

        if (button?.matches('[data-role="payment-save"]')) {
            closeModals();
            showToast("카드가 저장되었습니다.");
            return;
        }

        if (button?.matches('[data-role="tooltip-close"]')) return closeTooltips();
        if (button?.matches('[data-role="confirmation-cancel"]')) return closeDialogs();

        if (button?.matches('[data-role="confirmation-confirm"]')) {
            closeDialogs();
            try {
                window.history.back();
            } catch (_error) {
                showToast("캠페인 폼을 종료합니다.");
            }
            return;
        }

        if (!target?.closest(".DropdownMenu")) {
            closeDropdowns();
        }

        if (!target?.closest(".TooltipPanel") && !target?.closest(".TooltipTriggerButton")) {
            closeTooltips();
        }

        if (target?.matches('[data-role="modal-overlay"]')) closeModals();
        if (target?.matches('[data-role="confirmation-overlay"]')) closeDialogs();
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closeDropdowns();
            closeTooltips();
            closeModals();
            closeDialogs();
        }
    }

    function bindStaticButton(node, handler) {
        if (!node) return;

        node.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            handler(event);
        });
    }

    function initialize() {
        bindStaticButton(root.objectiveButton, () => openObjectiveModal());
        bindStaticButton(root.paymentButton, () => openPaymentModal());
        bindStaticButton(root.advancedButton, () => {
            state.advancedOpen = !state.advancedOpen;
            updateAdvancedSection();
        });
        bindStaticButton(root.accountButton, () => openDropdown("account", root.accountButton));
        bindStaticButton(root.profileButton, () => openDropdown("profile", root.profileButton));
        root.tooltipButtons.forEach((button) => {
            bindStaticButton(button, () => openTooltip(button));
        });
        bindStaticButton(root.branchButton, () => {
            state.adGroupOpen = !state.adGroupOpen;
            updateAdGroupBranch();
        });
        bindStaticButton(root.exitButton, () => {
            if (state.adGroupView) {
                showCampaignDetailsView();
                return;
            }

            openConfirmationDialog();
        });
        bindStaticButton(root.draftButton, () => showToast("임시 저장되었습니다."));
        bindStaticButton(root.nextButton, () => showAdGroupDetailsView());

        if (root.budgetSwitch) {
            root.budgetSwitch.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                state.budgetOptimizationEnabled = !state.budgetOptimizationEnabled;
                updateBudgetSwitch();
            });
        }

        syncCampaignCounter();
        syncObjectiveSummary();
        updateBudgetSwitch();
        updateAdGroupBranch();
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("input", (event) => {
        if (event.target === root.campaignNameInput) {
            syncCampaignCounter();
        }
    });

    initialize();
})();
