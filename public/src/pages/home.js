import { fetchPokemonList } from "./../modules/pokemon.js";

async function displayPokemon() {
    const pokemon = await fetchPokemonList();
    const pokemonList = document.getElementById("pokemon-list");

    for (let i = 0; i < pokemon.results.length; i++) {
        const liElement = document.createElement("li");
        liElement.innerHTML = `
            ${pokemon.results[i].name}
            <button onclick="addToFavorites('${pokemon.results[i].name}')">Add to favorites</button>
        `;
        pokemonList.appendChild(liElement);
    }
}

async function addToFavorites(pokemonName) {
    try {
        const result = await fetch(`/addToFavorites/${pokemonName}`);
        const resultJSON = await result.json();
        refresh();
    } catch (error) {
        console.error("Error adding favorite:", error);
    }
}

async function removeFromFavorites(pokemonName) {
    try {
        const result = await fetch(`/removeFromFavorites/${pokemonName}`);
        const resultJSON = await result.json();
        refresh();
    } catch (error) {
        console.error("Error removing favorite:", error);
    }
}

async function fetchFavorites() {
    try {
        const result = await fetch(`/favorites`);
        const resultJSON = await result.json();
        const favoritesList = document.getElementById("favorites-list");

        favoritesList.innerHTML = "";
        for (let i = 0; i < resultJSON.length; i++) {
            const liElement = document.createElement("li");
            liElement.innerHTML = `
            <p>${resultJSON[i].pokeName}</p>
            <button onclick="removeFromFavorites('${resultJSON[i].pokeName}')">Remove to favorites</button>
            `;
            favoritesList.appendChild(liElement);
        }
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
}

async function fetchTimelineEvents() {
    try {
        const result = await fetch(`/timeline`);
        const resultJSON = await result.json();
        const timelineList = document.getElementById("timeline-list");

        timelineList.innerHTML = "";
        for (let i = 0; i < resultJSON.length; i++) {
            const liElement = document.createElement("li");
            liElement.innerHTML = `
                <strong>${resultJSON[i].title}</strong>: ${resultJSON[i].description} <em>${resultJSON[i].date}</em>
            `;
            timelineList.appendChild(liElement);
        }
    } catch (error) {
        console.error("Error fetching timeline:", error);
    }
}

function refresh() {
    fetchFavorites();
    fetchTimelineEvents();
}

function setup() {
    displayPokemon();
    refresh();
    window.addTofavorites
}

setup();
