document.addEventListener("DOMContentLoaded", () => {
    const field = document.querySelector(".floating-field");
    const input = document.querySelector("#loginIdentity");
    const nextButton = document.querySelector(".next-button");
    const closeButton = document.querySelector(".join-modal-close");
    const overlay = document.querySelector(".join-modal-overlay");

    if (!field || !input || !nextButton) {
        return;
    }

    const syncFieldState = () => {
        const hasValue = input.value.trim().length > 0;
        field.classList.toggle("has-value", hasValue);
        nextButton.disabled = !hasValue;
    };

    input.addEventListener("focus", () => {
        field.classList.add("is-active");
    });

    input.addEventListener("blur", () => {
        field.classList.remove("is-active");
        syncFieldState();
    });

    input.addEventListener("input", syncFieldState);
    syncFieldState();

    if (closeButton && overlay) {
        closeButton.addEventListener("click", () => {
            overlay.style.display = "none";
        });
    }
});
