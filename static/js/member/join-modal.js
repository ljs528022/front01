document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.querySelector(".next-button");

    const fields = [
        {
            input: document.querySelector(".name-input"),
            box: document.querySelector(".name-placeholder"),
            label: document.querySelector(".name-text"),
            errorHost: document.querySelector(".name-placeholder-wrap"),
            shrink: (label) => {
                if (!label) return;
                label.style.fontSize = "12px";
                label.style.paddingTop = "8px";
                label.style.color = "rgb(29, 155, 240)";
            },
            expand: (label) => {
                if (!label) return;
                label.style.fontSize = "17px";
                label.style.paddingTop = "16px";
                label.style.color = "rgb(83, 100, 113)";
            },
        },
        {
            input: document.querySelector(".phone-input"),
            box: document.querySelector(".phone-placeholder"),
            label: document.querySelector(".phone-text"),
            errorHost: document.querySelector(".phone-number-placeholder"),
            shrink: (label) => {
                if (!label) return;
                label.style.fontSize = "12px";
                label.style.paddingTop = "8px";
                label.style.color = "rgb(29, 155, 240)";
            },
            expand: (label) => {
                if (!label) return;
                label.style.fontSize = "17px";
                label.style.paddingTop = "16px";
                label.style.color = "rgb(83, 100, 113)";
            },
        },
        {
            input: document.querySelector(".birth-date-input"),
            box: document.querySelector(".birth-date-input"),
            label: document.querySelector(".birth-date-text-input"),
            errorHost: document.querySelector(".birth-date"),
            shrink: (_, input) => {
                if (!input) return;
                input.classList.add("birth-focus-placeholder");
            },
            expand: (_, input) => {
                if (!input) return;
                input.classList.remove("birth-focus-placeholder");
            },
        },
    ].filter((f) => f.input && f.box);

    const states = new WeakMap();

    const ensureErrorNode = (host) => {
        if (!host) return null;

        const existing = host.querySelectorAll(".field-error-message");
        if (existing.length > 1) {
            for (let i = 1; i < existing.length; i += 1) {
                existing[i].remove();
            }
        }

        let node = existing[0] || null;
        if (!node) {
            node = document.createElement("div");
            node.className = "field-error-message";
            node.textContent = "다시입력하시오";
            host.appendChild(node);
        }
        return node;
    };

    const setBlue = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(29, 155, 240)";
        box.style.borderWidth = "2px";
        box.style.boxShadow = "0 0 0 2px rgba(29, 155, 240, 0.18)";
    };

    const setRed = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(244, 33, 46)";
        box.style.borderWidth = "2px";
        box.style.boxShadow = "0 0 0 2px rgba(244, 33, 46, 0.18)";
    };

    const setNeutral = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(207, 217, 222)";
        box.style.borderWidth = "1px";
        box.style.boxShadow = "none";
    };

    const syncNextButton = () => {
        if (!nextButton) return;
        const canNext = fields.every((field) => field.input.value.trim().length > 0);
        nextButton.style.opacity = canNext ? "1" : "0.5";
        nextButton.disabled = !canNext;
    };

    fields.forEach((field) => {
        const errorNode = ensureErrorNode(field.errorHost);
        states.set(field.input, {
            hadTyped: field.input.value.trim().length > 0,
            errorNode,
        });

        if (field.input.value.trim().length > 0) {
            field.shrink(field.label, field.input);
        } else {
            field.expand(field.label, field.input);
        }
        setNeutral(field.box);

        field.input.addEventListener("focus", () => {
            field.shrink(field.label, field.input);
            setBlue(field.box);
        });

        field.input.addEventListener("input", () => {
            const state = states.get(field.input);
            const value = field.input.value.trim();
            if (!state) return;

            if (value.length > 0) {
                state.hadTyped = true;
                field.shrink(field.label, field.input);
                setBlue(field.box);
                if (state.errorNode) state.errorNode.classList.remove("show");
            } else if (document.activeElement === field.input && state.hadTyped) {
                setRed(field.box);
                if (state.errorNode) state.errorNode.classList.add("show");
            } else {
                field.expand(field.label, field.input);
                setNeutral(field.box);
                if (state.errorNode) state.errorNode.classList.remove("show");
            }

            syncNextButton();
        });

        field.input.addEventListener("blur", () => {
            const state = states.get(field.input);
            const value = field.input.value.trim();
            if (!state) return;

            if (value.length === 0) {
                field.expand(field.label, field.input);
                setNeutral(field.box);
            } else {
                field.shrink(field.label, field.input);
                setNeutral(field.box);
            }

            if (state.errorNode) state.errorNode.classList.remove("show");
            syncNextButton();
        });
    });

    syncNextButton();

    const closeButton = document.querySelector(".join-modal-header-close-button, .join-modal-close");
    const modalRoot = document.querySelector(".join-modal, .join-modal-overlay");
    if (closeButton && modalRoot) {
        closeButton.addEventListener("click", () => {
            modalRoot.style.display = "none";
        });
    }
});
