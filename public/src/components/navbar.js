import { toggleDarkMode } from "../modules/dark-mode.js";

function setup() {
    const navbar = document.getElementById("navbar");

    navbar.querySelector("#dark-mode-button").addEventListener("click", () => {
        console.log("ready");
        toggleDarkMode();
    })
}

setup();
