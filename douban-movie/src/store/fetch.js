import axios from 'axios';

// 正在上映 API
const theaters_API = '/api/v2/movie/in_theaters';
// 即将上映 API
const comingSoon_API = '/api/v2/movie/coming_soon';
// 电影条目信息 API
const movieDetail_API = '/api/v2/movie/subject/';
// 电影条目搜索 API
const movieSearch_API = '/api/v2/movie/search?q=';

// 使用 Promise 请求数据
function fetch(url, params) {
  return new Promise(function(resolve, reject) {
    axios.get(url, {
      params
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

export {
  theaters_API,
  comingSoon_API,
  movieDetail_API,
  movieSearch_API,
  fetch
}
