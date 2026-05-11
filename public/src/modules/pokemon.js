export async function fetchPokemonList() {
    try {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon`);
        return await result.json();
    } catch (e) {
        throw new Error(`Error fetching Pokémon:\n${e}`);
    }
}
