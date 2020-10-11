import refs from './refs.js';
import apiService from './apiService.js';
import template from '../templates/template.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
defaultModules.set(PNotifyMobile, {});

class RenderImg {
  constructor() {
    this.page = 1;
    this.perPage = 12;
    this.query = '';
  }
  newQuery(query) {
    this.page = 1;
    this.query = query;
    this.fetchApi();
  }
  showMore() {
    this.page += 1;
    this.fetchApi();
  }
  async fetchApi() {
    const { hits } = await apiService.getImages(
      this.query,
      this.page,
      this.perPage,
    );
    if (!hits.length) {
      return error({
        text: 'Not found...try again...',
        hide: true,
        delay: 3000,
      });
    } else {
      const images = template(hits);
      refs.galleryList.insertAdjacentHTML('beforeend', images);
      //refs.button.classList.remove('hidden');
      window.scrollTo({
        top:
          refs.galleryList
            .querySelector('li:nth-last-of-type(12)')
            .getBoundingClientRect().top + window.pageYOffset,
        behavior: 'smooth',
      });
    }
  }
}

const newRender = new RenderImg();

refs.form.addEventListener('submit', event => {
  event.preventDefault();
  refs.galleryList.innerHTML = '';
  //console.log(event.target.elements.query.value);
  newRender.newQuery(event.target.elements.query.value);
});

// refs.button.addEventListener('click', () => {
//   newRender.showMore();
// });

refs.galleryList.addEventListener('click', event => {
  console.log(event.target.nodeName);
  if (event.target.nodeName === 'IMG') {
    let srcModal = event.target.dataset.src;
    const instance = basicLightbox.create(`
    <div class="modal">
        <img src="${srcModal}">
    </div>
`);

    instance.show();
  }
});

const infScroll = new InfiniteScroll(refs.galleryList, {
  // options
  path: '{{#}}',
  append: '.post',
  history: false,
});
infScroll.on('scrollThreshold', () => {
  newRender.showMore();
});
