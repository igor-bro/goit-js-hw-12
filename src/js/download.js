import { renderImages } from './render';
import { createMessage } from './notifications';
import axios from 'axios';

const searchParams = {
  key: '41895338-dd09ccecf51e6c3f0d3351286',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

const searchBtn = document.querySelector('.search-btn');
const loadMoreBtn = document.querySelector('.load-more-btn');
const searchLoadingTextEl = document.querySelector('.main-load');
const moreLoadingTextEl = document.querySelector('.more-load');

export async function downloadImages(searchKey, isLoadMore = false) {
  if (isLoadMore) {
    moreLoadingTextEl.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    loadMoreBtn.blur();

    if (searchParams.page === 1) searchParams.page++;
  } else {
    searchLoadingTextEl.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.blur();

    searchParams.page = 1;
  }

  searchParams.q = searchKey;
  let isDownloarError = false;
  let totalHits = 0;
  try {
    const images = await fetchImages();
    totalHits = images.totalHits;
    renderImages(images, isLoadMore);
  } catch (error) {
    createMessage(error);
    isDownloarError = true;
  }

  if (isLoadMore) {
    if (!isDownloarError) {
      searchParams.page++;

      const elementRect = document
        .querySelector('.gallery-link')
        .getBoundingClientRect();
      window.scrollBy({
        top: elementRect.height * 2.0,
        left: 0,
        behavior: 'smooth',
      });

      if (searchParams.per_page * searchParams.page >= totalHits)
        createMessage(
          "We're sorry, but you've reached the end of search results."
        );
      else loadMoreBtn.style.display = 'flex';
    } else loadMoreBtn.style.display = 'flex';

    moreLoadingTextEl.style.display = 'none';
  } else {
    searchLoadingTextEl.style.display = 'none';
    searchBtn.disabled = false;
    loadMoreBtn.style.display = 'flex';
  }
}

async function fetchImages() {
  const response = await axios.get('https://pixabay.com/api/', {
    params: { ...searchParams },
  });

  return response.data;
}
