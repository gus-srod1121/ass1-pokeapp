const template = document.getElementById("pokemon-card-template");

export function createPokemonCard(pokemon, onButtonClick, isFavorite = false) {
    if (!pokemon) {
        return null;
    }

    const clone = template.content.cloneNode(true);

    const pokeImg = clone.querySelector(".poke-img");
    pokeImg.src = pokemon.sprites.front_default;
    pokeImg.alt = pokemon.name;

    clone.querySelector(".poke-name").textContent = pokemon.name;

    const typesContainer = clone.querySelector(".poke-types");
    pokemon.types.forEach((type) => {
        const div = document.createElement("div");
        div.className = `type ${type.type.name}`;
        div.innerHTML = `<p>${type.type.name}</p>`;
        typesContainer.appendChild(div);
    });

    const favButton = clone.querySelector(".fav-button");
    favButton.onclick = () => onButtonClick(pokemon.name);

    const star = clone.querySelector(".poke-star");
    if (isFavorite) {
        star.classList.add("checked-star");
    }

    return clone;
}
