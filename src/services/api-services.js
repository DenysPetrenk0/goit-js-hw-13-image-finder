export default class ApiService {
  constructor() {
    this.API_KEY = '22372696-7b3b1eaff1e1a15c11afd4170';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.page = 1;
  }
  fetchImg(searchImg) {
    const url = `${this.BASE_URL}?image_type=photo&orientation=horizontal&q=${searchImg}&page=${this.page}&per_page=12&key=${this.API_KEY}`;
    return fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject('Opps! Something went wrong');
    });
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
