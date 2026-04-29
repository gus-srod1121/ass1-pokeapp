import { fetchPokemon } from "./pokemon.js"; 

function setup() {
    listPokemon();
}

async function listPokemon() {
    const pokeData = await fetchPokemon();
    let liElement;
    for (let i = 0; i < pokeData.results.length; i++) {
        liElement = document.createElement("li");
        liElement.innerText = pokeData.results[i].name;
        pokemonList.appendChild(liElement);
    }
}

setup();
