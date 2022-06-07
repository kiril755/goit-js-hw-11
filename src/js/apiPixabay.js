const { default: axios } = require('axios');

export default class ImgApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  fetchImgs() {
    const KEY = '16694534-e10129dcf786555a9c09cf642';
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return axios
      .get(URL)
      .then(({ data }) => {
        this.incrementPage();
        return data;
      })
      .catch(error => console.log(error));
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get searchQuery() {
    return this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
