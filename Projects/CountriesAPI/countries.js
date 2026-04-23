// print country name and capital and currency and flag in a table
async function getCountriesInTable() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,population');
        const data = await response.json();
        const table = document.getElementById('country-table');

        // Sort countries alphabetically by name
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        data.forEach(country => {
            const row = table.insertRow();
            const nameCell = row.insertCell(0);
            const capitalCell = row.insertCell(1);
            const populationCell = row.insertCell(2);
            const currencyCell = row.insertCell(3);
            const flagCell = row.insertCell(4);

            nameCell.textContent = country.name.common;
            capitalCell.textContent = country.capital[0];
            populationCell.textContent = country.population.toLocaleString();
            currencyCell.textContent = country.currencies[Object.keys(country.currencies)[0]]?.name;
            flagCell.innerHTML = `<img src="${country.flags.svg}" alt="Flag" style="width: 60px; height: 36px;">`;
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

// search for a country by name and display its capital, currency and flag
async function searchCountry() {
    const countryName = document.getElementById('country-name').value.trim();
    const searchResult = document.getElementById('search-result');

    if (!countryName) {
        searchResult.textContent = 'Please enter a country name to search.';
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,capital,currencies,flags,population`);
        const data = await response.json();
        const country = data[0];

        if (country) {
            const capital = country.capital ? country.capital[0] : 'Not available';
            const currency = country.currencies ? country.currencies[Object.keys(country.currencies)[0]]?.name : 'לא זמין';
            const population = country.population ? country.population.toLocaleString() : 'Not available';

            searchResult.innerHTML = `
                <h2>${country.name.common}</h2>
                <p>Capital: ${capital}</p>
                <p>Population: ${population}</p>
                <p>Currency: ${currency}</p>
                <img src="${country.flags.svg}" alt="Flag" style="width: 120px; height: 72px;">
            `;
        } else {
            searchResult.textContent = 'Country not found.';
        }
    } catch (error) {
        console.error('Error fetching country:', error);
        searchResult.textContent = 'Country not found.';
    }
}

getCountriesInTable();

// Search for a country when the search button is clicked
const searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.addEventListener('click', searchCountry);
}

