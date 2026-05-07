const DARK_MODE_CLASS = "dark-mode";
const ROOT = document.documentElement;

export function toggleDarkMode() {
    const isDark = ROOT.classList.toggle(DARK_MODE_CLASS);
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function setDarkMode(enableDark) {
    ROOT.classList.toggle(DARK_MODE_CLASS, enableDark);
    localStorage.setItem("theme", enableDark ? "dark" : "light");
}
