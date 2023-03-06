'use strict';
class BooksList {
  constructor() {
    this.favoriteBooks = [];
    this.filters = [];
    this.fetch();
    this.getElements();
    this.initActions();
    this.filterBooks();
  }

  fetch() {
    const thisBooks = this;
    const url = 'http://localhost:3131/books';
    const fetchData = async (url) => {
      try {
        const rawResponse = await fetch(url);
        thisBooks.data = await rawResponse.json();
        thisBooks.initData();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(url);
  }

  initData() {
    for (let book of this.data) {
      const ratingBgc = this.determineRatingBgc(book.rating);
      const ratingWidth = book.rating * 10;
      book.ratingBgc = ratingBgc;
      book.ratingWidth = ratingWidth;
      const generatedHTML = Handlebars.compile(this.dom.templateBook.innerHTML)(
        book
      );
      this.dom.booksList.appendChild(utils.createDOMFromHTML(generatedHTML));
    }
  }

  getElements() {
    this.dom = {};
    this.dom.templateBook = document.querySelector('#template-book');
    this.dom.booksList = document.querySelector('.books-list');
    this.dom.filter = document.querySelector('.filters');
  }

  initActions() {
    this.dom.booksList.addEventListener('click', (e) => e.preventDefault());
    this.dom.booksList.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const clickedBook = e.target.closest('.book__image');
      if (clickedBook.classList.contains('favorite')) {
        clickedBook.classList.remove('favorite');
        this.favoriteBooks.splice(
          this.favoriteBooks.indexOf(clickedBook.getAttribute('data-id')),
          1
        );
      } else {
        clickedBook.classList.add('favorite');
        this.favoriteBooks.push(clickedBook.getAttribute('data-id'));
      }
    });
  }

  filterBooks() {
    this.dom.filter.addEventListener('click', (e) => {
      const type = e.target.getAttribute('type');
      const name = e.target.getAttribute('name');
      const tagName = e.target.tagName;
      if (type === 'checkbox' && name === 'filter' && tagName === 'INPUT') {
        if (e.target.checked) {
          this.filters.push(e.target.value);
        } else {
          this.filters.splice(this.filters.indexOf(e.target.value), 1);
        }
      }
      let shouldBeHidden = false;
      for (let book of this.data) {
        for (let filter of this.filters) {
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
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating >= 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
}

// eslint-disable-next-line no-unused-vars
const app = new BooksList();
