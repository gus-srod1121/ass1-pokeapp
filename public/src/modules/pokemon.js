export async function fetchPokemonList(limit = 10) {
    try {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching Pokémon: ${e}`);
    }
}

export async function fetchPokemonDetails(url) {
    try {
        const result = await fetch(url);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching pokemon details: ${e}`);
    }
}
