
export async function fetchPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon")
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching Pokémon:", error));

    return response;
}
