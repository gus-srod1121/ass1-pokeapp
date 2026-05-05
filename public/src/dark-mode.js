const DARK_MODE_CLASS = "dark-mode";

export function toggleDarkMode() {
    body.classList.toggle(DARK_MODE_CLASS);
}

export function enableDarkMode(enable) {
    enable ? body.classList.add(DARK_MODE_CLASS) : body.classList.remove(DARK_MODE_CLASS);
}