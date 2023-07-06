import axios from 'axios'
export const toFetchImages = async (querySearch, page, perPage) => {
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