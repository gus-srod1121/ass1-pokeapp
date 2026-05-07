import { toggleDarkMode } from "../modules/dark-mode.js";

function setup() {
    const navbar = document.getElementById("navbar");
        console.log("navbar");

    navbar.querySelector("#dark-mode-button").addEventListener("click", () => {
        console.log("navbar");
        toggleDarkMode();
    });
}

setup();
