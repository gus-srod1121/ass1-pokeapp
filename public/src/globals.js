import { toggleDarkMode } from "./dark-mode";

function setup() {
    const defaultDarkMode = window.matchMedia("prefers-color-scheme:dark");
    if (defaultDarkMode) {
        toggleDarkMode();
    }
}

setup();