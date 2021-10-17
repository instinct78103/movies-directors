const table = document.querySelector('#table');
const pageDiv = document.querySelector('.paginator');
const modalMenu = document.querySelector('.modal');
const form = document.forms.addFilm; // Popup form in the .modalMenu

let api = {
  url: 'https://js-camp-43b98-default-rtdb.firebaseio.com/swapi',

  /**
   * We use the same form to add and edit records in the DB.
   * Hence, if `edit_filmId_record` is null, we will add a new record.
   * Otherwise, we'll edit an existing record
   */
  edit_filmId_record: null,

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
      return obj.fields;
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
      }));
    }
  },
};

const FilmsTable = function (currPage, perPage) {
  this.currPage = currPage;
  this.perPage = perPage;
};

Object.defineProperty(api, 'filmid', {
  set(newValue) {
    // Setting a new value will changes heading in the popup menu
    modalMenu.querySelector('.modal-title').innerText = (newValue === '')
      ? 'Add New Record'
      : `Edit Record ${newValue}`;
    this.edit_filmId_record = newValue;
  },
  get() {
    return this.edit_filmId_record;
  },
});

Object.defineProperty(FilmsTable.prototype, 'currPage', {
  set: async (newValue) => {
    const data = await api.refactorGetFilms();
    pageDiv.innerHTML = buildPaginator(data);
    pageDiv.querySelector('a').classList.remove('active');
    if (paginator(data, newValue).data.length) {
      table.innerHTML = buildTable(data, newValue);
      pageDiv.querySelectorAll('a')[newValue - 1].classList.add('active');
    } else {
      table.innerHTML = buildTable(data, newValue - 1);
      pageDiv.querySelectorAll('a')[newValue - 2].classList.add('active');
    }
  },
});

let initTable = new FilmsTable(1, 3);

/**
 * @param items Fetched object
 * @param pageNumber Page Number
 * @returns object
 */
function paginator(items, pageNumber = 1) {
  const per_page = initTable.perPage;
  const offset = (pageNumber - 1) * per_page;
  const paginatedItems = items.slice(offset).slice(0, per_page);
  const total_pages = Math.ceil(items.length / per_page);

  return {
    pageNumber,
    per_page,
    pre_page: pageNumber - 1 ? pageNumber - 1 : null,
    next_page: total_pages > pageNumber ? pageNumber + 1 : null,
    total: items.length,
    total_pages,
    data: paginatedItems,
    items,
  };
}

/**
 *
 * @param obj Fetched data object
 * @returns {string} HTML of the paginator div
 */
function buildPaginator(obj) {
  let html = '';
  if (paginator(obj).total_pages > 1) {
    for (let i = 1; i < paginator(obj).total_pages + 1; i++) {
      html += `<small class="mr-3 mt-5"><a class="p-link" href="#">${i}</a></small>`;
    }
  }
  return html;
}

/**
 * @param dataObject Fetched object
 * @param pageNumber Page number in paginator
 * @returns {string} Table InnerHTML
 */
function buildTable(dataObject, pageNumber) {
  if (dataObject.length > 0) {
    let pgObj = paginator(dataObject, pageNumber);
    const colHeadings = Object.keys(pgObj.data[0]);
    colHeadings[colHeadings.length] = ''; //Buttons column. No need to use sorting for this column
    const columns = pgObj.data.map(item => Object.values(item));
    columns.forEach(item => item[item.length] =
      `<button id="edit" class="btn btn-primary mr-2" data-filmid="${item[2].href}">Edit</button>
       <button id="delete" class="btn btn-secondary" data-filmid="${item[2].href}">Delete</button>`,
    );

    let thead = '<thead><tr>';
    colHeadings.forEach(item => thead += `<th>${item}</th>`);
    thead += '</tr></thead>';

    let tbody = '<tbody>';
    for (let i in columns) {
      tbody += '<tr>';
      for (let j in colHeadings) {
        tbody += (colHeadings[j] === 'title')
          ? `<td><a href="details.html?film=${columns[i][j].href}">${columns[i][j].name}</a></td>`
          : `<td>${columns[i][j]}</td>`;
      }
      tbody += '</tr>';
    }
    tbody += '</tbody>';

    return thead + tbody;
  }
}

/**
 *
 */
function createBtn() {
  const buttonAdd = document.createElement('button');
  buttonAdd.id = 'add_new';
  buttonAdd.classList.add('mb-3', 'btn', 'btn-info');
  buttonAdd.innerText = 'Add New Record';
  table.parentNode.insertBefore(buttonAdd, table);
  return buttonAdd;
}

/**
 *
 */
function sortTable(e) {
  let target = e.target;

  /**
   *
   */
  function getCellValue(tr, index) {
    return tr.children[index].innerText;
  }

  /**
   *
   * @param prevTd
   * @param nextTd
   * @returns {number} For sort function
   */
  function compareString(prevTd, nextTd) {
    return prevTd.toString().localeCompare(nextTd);
  }

  /**
   *
   * @param index
   * @param asc
   * @returns {function(*, *): number}
   */
  function comparer(index, asc) {
    return (rowA, rowB) => {
      let leftPart = getCellValue(asc ? rowA : rowB, index);
      let rightPart = getCellValue(asc ? rowB : rowA, index);
      return compareString(leftPart, rightPart);
    };
  }

  let index = Array.from(target.parentNode.children).indexOf(target);
  let asc = (this.asc = !this.asc);

  Array.from(table.querySelectorAll('tbody > tr'))
    .sort(comparer(index, asc))
    .forEach(tr => table.querySelector('tbody').appendChild(tr));
}

// All EventListeners

// const edit = table.querySelector('#edit');
// edit.addEventListener('click', () => alert(1));

function deleteTr() {
  if (confirm('Do you really want to delete this record?')) {
    api.filmid = target.dataset.filmid;
    fetch(`${api.url}/films/${api.filmid}.json`,
      {
        method: 'DELETE',
      }).then(resp => resp.json()).then(async () => {
      initTable.currPage = pageDiv.querySelector('.active').innerText;
    });
  }
}

table.addEventListener('click', e => {
  let target = e.target;
  if (target.matches('th')) {
    sortTable(e);
  } else if (target.matches('#edit')) {
    (async () => {
      let data = await api.refactorGetFilms(target.dataset.filmid);
      form.querySelector('#episode_id').value = data.episode_id;
      form.querySelector('#director').value = data.director;
      form.querySelector('#title').value = data.title;
      form.querySelector('#producer').value = data.producer;
      form.querySelector('#opening_crawl').value = data.opening_crawl;
      modalMenu.style.display = 'block';
      api.filmid = target.dataset.filmid;
    })(target.dataset.filmid);
  } else if (target.matches('#delete')) {
    if (confirm('Do you really want to delete this record?')) {
      api.filmid = target.dataset.filmid;
      fetch(`${api.url}/films/${api.filmid}.json`,
        {
          method: 'DELETE',
        }).then(resp => resp.json()).then(async () => {
        initTable.currPage = pageDiv.querySelector('.active').innerText;
      });
    }
  }
});

pageDiv.addEventListener('click', e => {
  let target = e.target;
  if (target.matches('a.p-link')) {
    initTable.currPage = target.innerText;
  }
});

createBtn().addEventListener('click', () => {
  api.filmid = '';
  modalMenu.style.display = 'block';
});

modalMenu.addEventListener('click', e => {
  let target = e.target;
  if (target.matches('button.close, button.close *, #close, .modal')) {
    modalMenu.style.display = 'none';
    form.reset();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = `${year}-${month}-${day}`;

  const data = new FormData(form);
  data.append('release_date', date);
  const dataToSend = Object.fromEntries(data.entries());

  if (Object.values(dataToSend).some(item => item === '')) {
    alert('Please fill in all fields!');
  } else {
    if (api.edit_filmId_record !== '') {
      //Editing Mode
      fetch(`${api.url}/films/${api.filmid}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: dataToSend,
            model: 'resources.films',
          }),
        }).then(resp => resp.json()).then(async () => {
        initTable.currPage = pageDiv.querySelector('.active').innerText;
        modalMenu.style.display = 'none';
        form.reset();
      });
    } else {
      //Adding Mode
      fetch(`${api.url}/films.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: dataToSend,
            model: 'resources.films',
          }),
        }).then(resp => resp.json()).then(async () => {
        initTable.currPage = pageDiv.querySelector('.active').innerText;
        modalMenu.style.display = 'none';
        form.reset();
      });
    }
  }
});