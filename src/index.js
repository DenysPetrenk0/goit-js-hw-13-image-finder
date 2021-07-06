import './sass/main.scss';
import ApiService from './services/api-services';
import gallery from './tpl/gallery.hbs';
import BtnService from './services/btn-service.js';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const newApiService = new ApiService();
const newSearchBtn = new BtnService({
  selector: "[data-action='search']",
  text: 'Search',
});

let nameImg = '';
let lastPage = 0;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.search-img'),
  endGallery: document.querySelector('.end-gallery'),
};

refs.form.addEventListener('submit', showImg);
refs.gallery.addEventListener('click', galleryClick);

function showImg(event) {
  event.preventDefault();
  nameImg = refs.input.value;

  if (!nameImg) {
    someError();
    return;
  }

  newSearchBtn.disable();
  newApiService.resetPage();
  refs.gallery.innerHTML = '';
  loadImg(nameImg);
}

function renderMarkup(data) {
  console.log(data);
  refs.gallery.insertAdjacentHTML('beforeend', gallery(data));
  newSearchBtn.enable();
}

function loadImg(nameImg) {
  newApiService
    .fetchImg(nameImg)
    .then(data => {
      if (data.totalHits === 0) {
        someError();
        newSearchBtn.enable();
      }
      lastPage = Math.ceil(data.totalHits / 12);
      renderMarkup(data);
    })
    .catch(someError);
}

const options = {
  threshold: 0.5,
  rootMargin: '50px',
};

const observer = new IntersectionObserver(onLoadMore, options);

function onLoadMore([entry], observer) {
  if (entry.isIntersecting && nameImg !== '') {
    newApiService.incrementPage();
    loadImg(nameImg);
  }
  if (newApiService.page === lastPage) {
    observer.disconnect();
  }
}

observer.observe(refs.endGallery);

function someError() {
  error({
    text: 'Opps. Something went wrong!',
  });
}

function galleryClick(event) {
  const largeImageURL = event.target.dataset.source;

  if (event.target.tagName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(`
    <img src="${largeImageURL}" width="800" height="600">
`);

  instance.show();
}
