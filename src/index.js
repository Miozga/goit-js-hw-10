import axios from 'axios';

axios.defaults.headers.common['X-API-KEY'] =
  'live_GPdbtXWRvc1C4dOEz0ur4a4sE7wwUMyKM2QoALqcu1rgdJ2La9AvqU31xIqtIw2x ';

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the breeds:', error);
    throw error;
  }
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data[0];
  } catch (error) {
    console.error('There was an error fetching the cat info:', error);
    throw error;
  }
}

async function init() {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  try {
    loader.style.display = 'block';
    const breeds = await fetchBreeds();
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    loader.style.display = 'none';
  } catch (err) {
    loader.style.display = 'none';
    error.style.display = 'block';
    console.error('Error loading breeds:', err);
  }

  breedSelect.addEventListener('change', async () => {
    const breedId = breedSelect.value;
    try {
      loader.style.display = 'block';
      catInfo.style.display = 'none';
      const catData = await fetchCatByBreed(breedId);
      catInfo.innerHTML = `
                <img src="${catData.url}" alt="Cat image" style="max-width: 100%;">
                <p>Name: ${catData.breeds[0].name}</p>
                <p>Description: ${catData.breeds[0].description}</p>
                <p>Temperament: ${catData.breeds[0].temperament}</p>
            `;
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    } catch (err) {
      loader.style.display = 'none';
      error.style.display = 'block';
      console.error('Error loading cat info:', err);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
