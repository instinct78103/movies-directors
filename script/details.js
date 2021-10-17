const info = document.querySelector('.info');
const url = new URL(window.location.href);
const filmGetParam = url.searchParams.get('film');


let api = {
  url: 'https://js-camp-43b98-default-rtdb.firebaseio.com/swapi',

  /**
   * @param filmid Record ID in the DB
   * @returns {Promise<any>} Fetch raw data
   *
   */
  getFilms: async (filmid = null) => {
    const resp = filmid
      ? await fetch(`${api.url}/films/${filmid}.json`)
      : await fetch(`${api.url}/films.json`);
    return resp.json();
  },

  /**
   * @param filmid
   * @returns {Promise<any>} Turn the getFilms data into the data we need
   */
  refactorGetFilms: async (filmid = null) => {
    const obj = await api.getFilms(filmid);
    if (filmid) {
      return obj;
    } else {
      Object.keys(obj).forEach(key => {
        Object.defineProperties(obj[key].fields, {
          'filmId': {value: key},
          'ref': {value: obj[key].pk},
        });
      });

      return Object.values(obj).map(item => Object.assign({
        'episode': item.fields.episode_id,
        'director': item.fields.director,
        'title': {'name': item.fields.title, 'href': item.fields.filmId},
        'producer': item.fields.producer,
        'date': item.fields.release_date,
        'ref': item.fields.ref,
        'filmId': item.fields.filmId,
        'planets': item.fields.planets,
      }));
    }
  },

  getPlanets: async () => {
    const resp = await fetch(`${api.url}/planets.json`);
    return resp.json();
  },
};

(async () => {
  const resp = await api.getPlanets();
  console.log(resp)
})();


// try {
//   const resp = api.getPlanets()
//   const json = resp.json()
//   console.log(json)
// }
// catch (e) {
//
// }

// (async () => {
//   const result = await api.refactorGetFilms(filmGetParam);
//   console.log(result);
//   info.innerHTML = result
//     ? `
//             <h1>${result.title}</h1>
//             <div class="mb-3"><small class="mr-2">${result.director}</small><small>${result.date}</small></div>
//             <p class="warn">${result.opening_crawl}</p>`
//     : '<p class="text-muted">Oops... Nothing to show</p>';
//   info.innerHTML += '<p><a href="javascript:history.back()">Go Back</a></p>';
//
// })(filmGetParam);
//
// (async () => {
//   await api.getPlanets()
// })()

/**
 * @returns {Promise<any>} Fetched object
 */
// async function fetchFilms() {
//   const resp = await fetch(api);
//   return resp.json();
// }

// fetchFilms().then(data => {
//   console.log(data);
//
//   const result = Object.assign({
//     'episode_id': data.fields.episode_id,
//     'director': data.fields.director,
//     'title': data.fields.title,
//     'opening_crawl': data.fields.opening_crawl,
//     'producer': data.fields.producer,
//     'date': data.fields.release_date,
//   }, data);
//
//   info.innerHTML = result
//     ? `
//             <h1>${result.title}</h1>
//             <div class="mb-3"><small class="mr-2">${result.director}</small><small>${result.date}</small></div>
//             <p class="warn">${result.opening_crawl}</p>`
//     : '<p class="text-muted">Oops... Nothing to show</p>';
//
//   info.innerHTML += '<p><a href="javascript:history.back()">Go Back</a></p>';
//   document.querySelector('.container').appendChild(info);
//
// }).catch(error => {
//   info.innerHTML = '<p>Oops... Nothing to show</p><p><a href="javascript:history.back()">Go Back</a></p>';
// });