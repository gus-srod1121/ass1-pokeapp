import { createPokemonCard } from "../modules/pokemon-card.js";
import {
    fetchPokemonDetailsFromName,
    fetchPokemonDetailsFromURL,
    fetchPokemonList,
} from "./../modules/pokemon.js";

let allPokemonRefs = [];
let filteredPokemonRefs = [];
let selectedTypes = []; 
let currentOffset = 0;
const limit = 10;

const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search-input");
const prevButton = document.getElementById("prev-button");
const pageInfo = document.getElementById("page-num");
const nextButton = document.getElementById("next-button");
const typeFilterContainer = document.getElementById("type-filter-container");
const filtersButton = document.getElementById("filters-button"); // Added for toggle

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

// --- TYPE FILTERING LOGIC ---

async function populateTypeFilter() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        data.results.filter(t => t.name !== 'shadow' && t.name !== 'unknown').forEach(type => {
            const btn = document.createElement("button");
            btn.classList.add("type-chip");
            btn.textContent = type.name;
            btn.onclick = () => toggleType(type.name, btn);
            typeFilterContainer.appendChild(btn);
        });
    } catch (error) {
        console.error("Error populating types:", error);
    }
}

function toggleType(typeName, element) {
    if (selectedTypes.includes(typeName)) {
        selectedTypes = selectedTypes.filter(t => t !== typeName);
        element.classList.remove("active");
    } else {
        selectedTypes.push(typeName);
        element.classList.add("active");
    }
    handleFilters();
}

async function handleFilters() {
    const term = searchInput.value.toLowerCase();

    if (selectedTypes.length === 0) {
        filteredPokemonRefs = allPokemonRefs.filter((p) => p.name.includes(term));
    } else {
        const typeData = await Promise.all(
            selectedTypes.map(t => fetch(`https://pokeapi.co/api/v2/type/${t}`).then(r => r.json()))
        );

        let intersection = typeData[0].pokemon.map(p => p.pokemon);

        for (let i = 1; i < typeData.length; i++) {
            const currentTypeNames = typeData[i].pokemon.map(p => p.pokemon.name);
            intersection = intersection.filter(p => currentTypeNames.includes(p.name));
        }

        filteredPokemonRefs = intersection.filter(p => p.name.includes(term));
    }

    currentOffset = 0;
    fetchPokemon();
}

// --- DATABASE ACTIONS ---

async function addToFavorites(pokemonName) {
    try {
        await fetch(`/addToFavorites/${pokemonName}`);
        refresh();
    } catch (error) {
        console.error("Error adding favorite:", error);
    }
}

async function removeFromFavorites(pokemonName) {
    try {
        await fetch(`/removeFromFavorites/${pokemonName}`);
        refresh();
    } catch (error) {
        console.error("Error removing favorite:", error);
    }
}

async function fetchFavorites() {
    try {
        const result = await fetch(`/favorites`);
        const favoritesData = await result.json();
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
            fetchTimelineEvents();
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
        // --- NEW: Toggle Logic ---
        filtersButton.onclick = () => {
            typeFilterContainer.classList.toggle("hidden");
            // Change button text based on state
            const isHidden = typeFilterContainer.classList.contains("hidden");
        };

        searchInput.addEventListener("input", handleFilters);

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
    await populateTypeFilter();
    
    const data = await fetchPokemonList(5000, 0);
    allPokemonRefs = data.results;
    filteredPokemonRefs = allPokemonRefs;

    attachFunctionToWindow();
    setUpEventListeners();
    refresh();
}

setup();