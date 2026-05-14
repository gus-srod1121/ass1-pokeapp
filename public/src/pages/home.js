import { createPokemonCard } from "../modules/pokemon-card.js";
import {
    fetchPokemonDetailsFromName,
    fetchPokemonDetailsFromURL,
    fetchPokemonList,
} from "./../modules/pokemon.js";

let allPokemonRefs = [];
let filteredPokemonRefs = [];
let currentOffset = 0;
const limit = 10;

const pokemonList = document.getElementById("pokemon-list");

const searchInput = document.getElementById("search-input");
const prevButton = document.getElementById("prev-button");
const pageInfo = document.getElementById("page-num");
const nextButton = document.getElementById("next-button");

async function fetchPokemon() {
    pokemonList.innerHTML = "<li>Loading Pokémon...</li>";

    const pageItems = filteredPokemonRefs.slice(currentOffset, currentOffset + limit);

    const pokemonDetails = await Promise.all(
        pageItems.map((p) => fetchPokemonDetailsFromURL(p.url))
    );

    pokemonList.innerHTML = "";
    if (pokemonDetails.length == 0) {
        pokemonList.innerHTML = "<li>No Pokémon found.</li>";
    }

    for (const pokemon of pokemonDetails) {
        const pokeCard = createPokemonCard(pokemon, addToFavorites);
        pokemonList.appendChild(pokeCard);
    }

    const currentPage = Math.floor(currentOffset / limit) + 1;
    const totalPages = Math.ceil(filteredPokemonRefs.length / limit) || 1;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = currentOffset + limit >= filteredPokemonRefs.length;
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

        const detailPromises = favoritesData.map((fav) =>
            fetchPokemonDetailsFromName(fav.pokeName)
        );
        const pokemonDetails = await Promise.all(detailPromises);

        for (const pokemon of pokemonDetails) {
            const pokeCard = createPokemonCard(pokemon, addToFavorites, true);
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
            timelineList.prepend(liElement);
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
    fetchPokemon();
    fetchFavorites();
    fetchTimelineEvents();
}

function attachFunctionToWindow() {
    window.removeTimelineEvent = removeTimelineEvent;
}

function setUpEventListeners() {
    try {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            filteredPokemonRefs = allPokemonRefs.filter((p) => p.name.includes(term));
            currentOffset = 0;
            fetchPokemon();
        });

        prevButton.onclick = () => {
            if (currentOffset >= limit) {
                currentOffset -= limit;
                fetchPokemon();
            }
        };

        nextButton.onclick = () => {
            if (currentOffset + limit < filteredPokemonRefs.length) {
                currentOffset += limit;
                fetchPokemon();
            }
        };
    } catch (error) {
        console.error(error);
    }
}

async function setup() {
    const data = await fetchPokemonList(5000, 0);
    allPokemonRefs = data.results;
    filteredPokemonRefs = allPokemonRefs;

    attachFunctionToWindow();
    setUpEventListeners();
    refresh();
}

setup();
