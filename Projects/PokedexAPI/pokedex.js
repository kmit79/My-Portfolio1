const pokedexGrid = document.getElementById('pokedex-grid');
const searchInput = document.getElementById('pokemon-search');
const searchBtn = document.getElementById('search-btn');

let allPokemon = [];

async function fetchPokedex() {
    try {
        // Fetch first 151 Pokemon (Gen 1)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        // Fetch details for each pokemon to get images and types
        const detailPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        allPokemon = await Promise.all(detailPromises);
        
        displayPokemon(allPokemon);
    } catch (error) {
        console.error('Error fetching Pokedex:', error);
        pokedexGrid.innerHTML = '<p class="error">Failed to load Pokemon. Please try again later.</p>';
    }
}

async function fetchPokemonDescription(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const data = await response.json();
        const entry = data.flavor_text_entries.find(e => e.language.name === 'en');
        return entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';
    } catch (error) {
        return 'Description unavailable.';
    }
}

async function displayPokemon(pokemonList) {
    pokedexGrid.innerHTML = '';
    const isDetailed = pokemonList.length === 1;
    
    for (const pokemon of pokemonList) {
        const card = document.createElement('div');
        card.className = `pokemon-card ${isDetailed ? 'detailed' : ''}`;
        
        const types = pokemon.types.map(t => `<span class="pokemon-type">${t.type.name}</span>`).join('');
        
        if (isDetailed) {
            const description = await fetchPokemonDescription(pokemon.id);
            card.innerHTML = `
                <div class="pokemon-image-side">
                    <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                </div>
                <div class="pokemon-info-side">
                    <h3>${pokemon.name}</h3>
                    <div class="types-container">${types}</div>
                    <p class="pokemon-description">${description}</p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <div class="types-container">
                    ${types}
                </div>
            `;
        }
        
        pokedexGrid.appendChild(card);
    }
}

function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm) || 
        pokemon.id.toString().includes(searchTerm)
    );
    displayPokemon(filtered);
}

// Event Listeners
searchBtn.addEventListener('click', filterPokemon);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterPokemon();
    } else if (searchInput.value === '') {
        displayPokemon(allPokemon);
    }
});

// Optional: Dynamic filtering as you type
searchInput.addEventListener('input', () => {
    if (searchInput.value === '') {
        displayPokemon(allPokemon);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchPokedex);

/* 
   Using Official Artwork for high quality: 
   pokemon.sprites.other['official-artwork'].front_default 
*/