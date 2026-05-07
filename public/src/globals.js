const DARK_MODE_CLASS = "dark-mode";

function syncTheme() {
    let theme = localStorage.getItem("theme");

    if (!theme) {
        const prefersDark = window.matchMedia("prefers-color-scheme: dark").matches;
        theme = prefersDark ? "dark" : "light";
        localStorage.setItem("theme", theme);
    }
    const prefersDark = (theme == "dark");
    
    document.documentElement.classList.toggle(DARK_MODE_CLASS, prefersDark);
}

function setup() {
    syncTheme();
}

setup();