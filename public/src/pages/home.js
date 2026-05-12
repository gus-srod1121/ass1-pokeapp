import { fetchPokemonDetails, fetchPokemonList } from "./../modules/pokemon.js";

async function displayPokemon() {
    const pokemonData = await fetchPokemonList();
    const pokemonDetails = await Promise.all(
        pokemonData.results.map((p) => fetchPokemonDetails(p.url))
    );

    const pokemonList = document.getElementById("pokemon-list");
    const template = document.getElementById("pokemon-card-template");
    pokemonList.innerHTML = "";

    for (const pokemon of pokemonDetails) {
        const clone = template.content.cloneNode(true);

        const pokeImg = clone.querySelector(".poke-img");
        pokeImg.src = pokemon.sprites.front_default;
        pokeImg.alt = pokemon.name;

        clone.querySelector(".poke-name").innerText = pokemon.name;

        const typesContainer = clone.querySelector(".poke-types");
        pokemon.types.forEach((type) => {
            const span = document.createElement("span");
            span.className = `type-badge ${type.type.name}`;
            span.textContent = type.type.name;
            typesContainer.appendChild(span);
        });

        const favButton = clone.querySelector(".fav-button");
        favButton.onclick = () => window.addToFavorites(pokemon.name);

        pokemonList.appendChild(clone);
    }

    // for (let i = 0; i < pokemon.results.length; i++) {
    //     const liElement = document.createElement("li");
    //     liElement.innerHTML = `
    //         ${pokemon.results[i].name}
    //         <button onclick="addToFavorites('${pokemon.results[i].name}')">Add to favorites</button>
    //     `;
    //     pokemonList.appendChild(liElement);
    // }
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
                <strong>${resultJSON[i].title}</strong>: ${resultJSON[i].description}
                <em>${new Date(resultJSON[i].date)}</em>
                <button onclick="removeTimelineEvent('${resultJSON[i]._id}')">Delete event</button>
            `;
            timelineList.appendChild(liElement);
        }
    } catch (error) {
        console.error("Error fetching timeline:", error);
    }
}

async function removeTimelineEvent(eventId) {
    try {
        const result = await fetch(`/removeTimelineEvent/${eventId}`);
        if (result.ok) {
            fetchTimelineEvents(); // Refresh just the timeline
        }
    } catch (error) {
        console.error("Error removing event:", error);
    }
}

function refresh() {
    fetchFavorites();
    fetchTimelineEvents();
}

function attachFunctionToWindow() {
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
    window.removeTimelineEvent = removeTimelineEvent;
}

function setup() {
    attachFunctionToWindow();
    displayPokemon();
    refresh();
}

/* ATTACH TO WINDOW */

setup();
