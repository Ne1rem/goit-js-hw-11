import axios from 'axios'
import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox"

const gallery = document.querySelector('.gallery');
const API_KEY = '37953562-c7c28b8f0c02ebea23bfb706a';
const searchText = document.querySelector('.search-form input');
const submit = document.querySelector('.submit')

submit.addEventListener('click', searchPhotos)

function searchPhotos() {
submit.preventDefault()
  gallery.style.display = 'none';
  const findingText = searchText.value.toLowerCase();
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${findingText}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(URL)
    .then((resp) => {
      if (!resp.ok) throw new Error(resp.status);
      return resp.json();
    })
    .then((data) => {
      gallery.style.display = 'block';
      showInfo(data.hits[0]);
    })
    .catch((error) => console.log(error));
}

function showInfo(photo) {
  const markup = `
    <div class="photo-card">
      <img src="${photo.userImageURL}" alt="${photo.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes: ${photo.likes}</b></p>
        <p class="info-item"><b>Views: ${photo.views}</b></p>
        <p class="info-item"><b>Comments: ${photo.comments}</b></p>
        <p class="info-item"><b>Downloads: ${photo.downloads}</b></p>
      </div>
    </div>`;

  gallery.innerHTML = markup;
  const lightbox  =  $(`.photo-card img`).SimpleLightbox()
}

searchText.addEventListener('change', searchPhotos);
