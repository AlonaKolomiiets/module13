const apiKey = '18623540-b96dabcd57ccb87763c2123d9';
const baseUrl = 'https://pixabay.com/api/';
//URL-строка запроса:
//https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ

export default {
  async getImages(query, page, perPage) {
    try {
      let additionalUrl = `?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=${perPage}&key=${apiKey}`;

      const result = await fetch(`${baseUrl}${additionalUrl}`);

      return await result.json();
    } catch (e) {
      console.log(e);
      return [];
    }
  },
};
