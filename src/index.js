import axios from 'axios'
import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox"

const gallery = document.querySelector('.gallery');
const searchText = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');

searchText.addEventListener('submit', searchPhotos)
btnLoadMore.addEventListener('click', loadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: '250',
});

let page = 1;
let querySearch;
const perPage = 40;

const toFetchImages = async (querySearch, page, perPage) => {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '37953562-c7c28b8f0c02ebea23bfb706a',
    q: querySearch,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });
  const response = await axios.get(`${BASE_URL}?${params.toString()}`);
  return response;
};

function searchPhotos(find) {
  find.preventDefault();
  querySearch = find.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  page = 1;
  btnLoadMore.classList.add('hidden');
  gallery.style.display = 'none';
  render();

  async function render() {
    try {
      const { data: response } = await toFetchImages(querySearch, page, perPage);
      if (querySearch === '') {
        return Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
      }
      if (response.totalHits === 0) {
        return Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        response.hits.forEach((photo) => {
          showInfo(photo);
        });
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        lightbox.refresh();
        if (response.totalHits > perPage) {
          btnLoadMore.classList.remove('hidden');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function showInfo(photo) {
  const markup = `
    <a class="gallery__link" href="${photo.largeImageURL}">
      <div class="photo-card">
        <img src="${photo.userImageURL}" alt="${photo.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes: ${photo.likes}</b></p>
          <p class="info-item"><b>Views: ${photo.views}</b></p>
          <p class="info-item"><b>Comments: ${photo.comments}</b></p>
          <p class="info-item"><b>Downloads: ${photo.downloads}</b></p>
        </div>
      </div>
    </a>`;

  gallery.insertAdjacentHTML('beforeend', markup);
}
