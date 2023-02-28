const templateBook = document.querySelector('#template-book');
const compileBook = Handlebars.compile(templateBook.innerHTML);
const booksList = document.querySelector('.books-list');
const determineRatingBgc = (rating) => {
  if (rating < 6) {
    return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
  } else if (rating >= 6 && rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
  } else if (rating > 8 && rating <= 9) {
    return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else {
    return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
  }
};
const render = () => {
  for (let book of dataSource.books) {
    const ratingBgc = determineRatingBgc(book.rating);
    const ratingWidth = book.rating * 10;
    book.ratingBgc = ratingBgc;
    book.ratingWidth = ratingWidth;
    const generatedHTML = compileBook(book);
    booksList.appendChild(utils.createDOMFromHTML(generatedHTML));
  }
};
render();
const favoriteBooks = [];
const filters = [];
const filter = document.querySelector('.filters');
const initActions = () => {
  booksList.addEventListener('click', (e) => e.preventDefault());
  booksList.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const clickedBook = e.target.closest('.book__image');
    if (clickedBook.classList.contains('favorite')) {
      clickedBook.classList.remove('favorite');
      favoriteBooks.splice(favoriteBooks.indexOf(clickedBook), 1);
    } else {
      clickedBook.classList.add('favorite');
      favoriteBooks.push(clickedBook.getAttribute('data-id'));
    }
  });

  filter.addEventListener('click', (e) => {
    const type = e.target.getAttribute('type');
    const name = e.target.getAttribute('name');
    const tagName = e.target.tagName;
    if (type === 'checkbox' && name === 'filter' && tagName === 'INPUT') {
      if (e.target.checked) {
        filters.push(e.target.value);
      } else {
        filters.splice(filters.indexOf(e.target.value), 1);
      }
    }
    let shouldBeHidden = false;
    for (let book of dataSource.books) {
      for (let filter of filters) {

        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        } else {
          shouldBeHidden = false;
        }
      }
      const bookHide = document.querySelector(
        `.book__image[data-id="${book.id}"]`
      );
      if (shouldBeHidden) {
        bookHide.classList.add('hidden');
      } else {
        bookHide.classList.remove('hidden');
      }
    }
  });
};
initActions();
