import axios from 'axios'
import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox"
import { toFetchImages } from './JS/toFetchImages';                    
import { showInfo } from './JS/showInfo'

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

const lightbox = new SimpleLightbox('.gallery a')
btnLoadMore.style.display = 'none'
let page = 1;
let querySearch;
const perPage = 40;

function searchPhotos(find) {
  find.preventDefault();
  querySearch = find.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  page = 1;


  gallery.style.display = 'none';
  
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
          btnLoadMore.style.display = 'block'
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function loadMore(){
  page +=1
  try {
    const { data: response } = await toFetchImages(querySearch, page, perPage);
    showInfo(response.hits);
    lightbox.refresh();
    const totalPages = Math.ceil(response.totalHits / perPage)
    if (page === totalPages) {
      btnLoadMore.style.display = 'none'
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}
catch (error) {
    console.log(error);
}
}