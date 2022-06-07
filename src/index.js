import './sass/main.scss';
import { Notify } from 'notiflix';
import apiPixabay from './js/apiPixabay';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { showLoader, hideLoader } from './js/load-more-button';

const formElem = document.querySelector('#search-form');
const galleryBlock = document.querySelector('.gallery');
const loadIco = document.querySelector('.loader');

formElem.addEventListener('submit', onSearch);

let query = '';

const imgApiService = new apiPixabay();

function handleObserver(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      fetchAndRender();
    }
  });
}

const observer = new IntersectionObserver(handleObserver, {
  threshold: 0.5,
});

let gallery = new SimpleLightbox('.photo-card a', {
  showCounter: false,
  enableKeyboard: true,
});

function onSearch(e) {
  e.preventDefault();
  hideLoader(loadIco);

  const value = e.currentTarget.elements.searchQuery.value.trim();

  if (!value) {
    Notify.failure('There is nothing to find', {
      clickToClose: true,
    });
    return;
  }

  query = value;
  clearGalleryMarkup();

  imgApiService.resetPage();

  fetchAndRender().then(result => {
    if (result) {
      Notify.success(`Hooray! We found ${result} images.`, {
        clickToClose: true,
        timeout: 2000,
      });
    }

    formElem.reset();
  });
}

async function fetchAndRender() {
  try {
    imgApiService.searchQuery = query;
    const response = await imgApiService.fetchImgs(query);
    gallery.refresh();

    if (response.total === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        clickToClose: true,
      });

      clearGalleryMarkup();
    } else {
      renderGallery(response.hits);
      showLoader(loadIco);
      return response.totalHits;
    }
  } catch (error) {
    hideLoader(loadIco);
    Notify.info("We're sorry, but you've reached the end of search results.", {
      clickToClose: true,
      timeout: 5000,
    });
  }
}

function renderGallery(hits) {
  const photoCard = hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
          <a class="photo-card__item" href="${largeImageURL}">
            <img class="photo-card__image" src="${webformatURL}" alt="${tags} loading="lazy"/></a>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b><br>
                  ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b><br>
                  ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b><br>
                  ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b><br>
                  ${downloads}
                </p>
              </div>
        </div>`,
    )
    .join('');

  galleryBlock.insertAdjacentHTML('beforeend', photoCard);

  if (loadIco) {
    observer.observe(loadIco);
    gallery.refresh();
  }
}

function clearGalleryMarkup() {
  galleryBlock.innerHTML = '';
}
