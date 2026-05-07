const DARK_MODE_CLASS = "dark-mode";

function syncTheme() {
    let theme = localStorage.getItem("theme");

    if (!theme) {
        const prefersDark = window.matchMedia("prefers-color-scheme: dark").matches;
        theme = prefersDark ? "dark" : "light";
        localStorage.setItem("theme", theme);
    }
    const prefersDark = theme == "dark";

    document.documentElement.classList.toggle(DARK_MODE_CLASS, prefersDark);
}

function setup() {
    syncTheme();
    addEventListener("DOMContentLoaded", () => {
        console.log("woosh");
        document.documentElement.style.transition =
            "background-color var(--animation-time) ease, color var(--animation-time) ease";
        document.body.style.maxHeight = "20px";
        console.log("squashie");
    });
}

setup();
