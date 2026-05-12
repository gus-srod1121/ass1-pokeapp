import { createPokemonCard } from "../modules/pokemon-card.js";
import {
    fetchPokemonDetailsFromName,
    fetchPokemonDetailsFromURL,
    fetchPokemonList,
} from "./../modules/pokemon.js";

async function displayPokemon() {
    const pokemonData = await fetchPokemonList();
    const pokemonDetails = await Promise.all(
        pokemonData.results.map((p) => fetchPokemonDetailsFromURL(p.url))
    );

    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = "";

    for (const pokemon of pokemonDetails) {
        const pokeCard = createPokemonCard(pokemon, addToFavorites);
        pokemonList.appendChild(pokeCard);
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
        const favoritesData = await result.json();

        const template = document.getElementById("pokemon-card-template");
        const favoritesList = document.getElementById("favorites-list");

        favoritesList.innerHTML = "";

        const detailPromises = favoritesData.map((fav) => fetchPokemonDetailsFromName(fav.pokeName));
        const pokemonDetails = await Promise.all(detailPromises);

        for (const pokemon of pokemonDetails) {
            const pokeCard = createPokemonCard(pokemon, addToFavorites);
            favoritesList.appendChild(pokeCard);
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
    window.removeTimelineEvent = removeTimelineEvent;
}

function setup() {
    attachFunctionToWindow();
    displayPokemon();
    refresh();
}

setup();
