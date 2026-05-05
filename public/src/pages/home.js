addTofavorites = async function (pokemonName) {
  const result = await fetch(`/addToFavorites/${pokemonName}`);
  const resultJSON = await result.json();
  console.log(resultJSON);
  fetchFavorites();
  fetchTimelineEvents();
};

fetchPokemons = async function () {
  const result = await fetch(`https://pokeapi.co/api/v2/pokemon`);
  const resultJSON = await result.json();
  console.log(resultJSON);
  favoritesList.innerHTML = "";
  for (let i = 0; i < resultJSON.results.length; i++) {
    const liElement = document.createElement("li");
    liElement.innerHTML = `
        ${resultJSON.results[i].name}
        <button onclick="addTofavorites('${resultJSON.results[i].name}')">Add to favorites</button>
        `;
    pokemonList.appendChild(liElement);
  }
};

const fetchTimeline = async () => {
    const result = await fetch(`/timeline`);
    const resultJSON = await result.json();
    timelineList.innerHTML = "";
    for (let i = 0; i < resultJSON.length; i++) {
        const liElement = document.createElement("li");
        liElement.innerHTML = `
            <strong>${resultJSON[i].title}</strong>: ${resultJSON[i].description} <em>${resultJSON[i].date}</em>
        `;
        timelineList.appendChild(liElement);
    }
};

fetchFavorites = async function () {
  const result = await fetch(`/favorites`);
  const resultJSON = await result.json();
  console.log(resultJSON);
  favoritesList.innerHTML = "";
  for (let i = 0; i < resultJSON.length; i++) {
    const liElement = document.createElement("li");
    liElement.innerText = resultJSON[i].pokeName;
    favoritesList.appendChild(liElement);
  }
};

fetchPokemons();
fetchFavorites();
fetchTimeline();