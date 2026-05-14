const URL = "https://pokeapi.co/api/v2/pokemon";

export async function fetchPokemonList(offset = 0, limit = 10) {
    try {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching Pokémon: ${e}`);
    }
}

export async function fetchPokemonDetailsFromURL(url) {
    try {
        const result = await fetch(url);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching pokemon details: ${e}`);
    }
}

export async function fetchPokemonDetailsFromName(name) {
    try {
        const result = await fetch(`${URL}/${name}`);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching pokemon details: ${e}`);
    }
}
