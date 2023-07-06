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
          showInfo(response.hits);
          gallery.style.display = 'flex';
          gallery.style.flexWrap = 'wrap';
          gallery.style.gap = '48px 24px';
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

function showInfo(images) {
  const galleryMarkup = images.map(
      ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
      }) => {
          return `<a class="gallery__link" href="${largeImageURL}">
          <div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" height="100" />
              <div class="info">
              <p class="info-item"><b>Likes</b> ${likes}</p> 
              <p class="info-item"><b>Views</b> ${views}</p>
              <p class="info-item"><b>Comments</b> ${comments}</p>
              <p class="info-item"><b>Downloads</b> ${downloads}</p>
            </div>
          </div>;
          </a>`
      }).join('');
  gallery.insertAdjacentHTML('beforeend', galleryMarkup);

}    

async function loadMore(){
  page +=1
  try {
    const { data: response } = await toFetchImages(querySearch, page, perPage);
    showInfo(response.hits);
    lightbox.refresh();
    const totalPages = Math.ceil(response.totalHits / perPage)
    if (page === totalPages) {
        btnLoadMore.classList.add('hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}
catch (error) {
    console.log(error);
}
}