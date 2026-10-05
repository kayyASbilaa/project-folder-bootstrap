const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    renderBooks();
  });
});

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = parseInt(document.getElementById('inputBookYear').value);
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = +new Date();
  const bookObject = {
    id: generatedID,
    title,
    author,
    year,
    isComplete
  };

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('inputBook').reset();
}

document.addEventListener(RENDER_EVENT, function () {
  renderBooks();
});

function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  let incompleteCount = 0;
  let completeCount = 0;

  for (const bookItem of books) {
    if (searchTitle && !bookItem.title.toLowerCase().includes(searchTitle)) {
      continue;
    }

    const bookElement = makeBookRow(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.append(bookElement);
      incompleteCount++;
    } else {
      completeBookshelfList.append(bookElement);
      completeCount++;
    }
  }

  // Tampilkan pesan jika tabel kosong
  if (incompleteCount === 0) {
    incompleteBookshelfList.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-3 small">No unfinished books yet.</td>
      </tr>
    `;
  }

  if (completeCount === 0) {
    completeBookshelfList.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-3 small">No completed books yet.</td>
      </tr>
    `;
  }
}

function makeBookRow(bookObject) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="ps-3 fw-medium">${bookObject.title}</td>
    <td class="text-secondary">${bookObject.author}</td>
    <td>${bookObject.year}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group">
        <button class="btn ${bookObject.isComplete ? 'btn-warning' : 'btn-success'}" onclick="toggleBookStatus(${bookObject.id})">
          ${bookObject.isComplete ? 'Unfinished' : 'Complete'}
        </button>
        <button class="btn btn-outline-danger" onclick="deleteBook(${bookObject.id})">
          Delete
        </button>
      </div>
    </td>
  `;

  return tr;
}

function toggleBookStatus(bookId) {
  const bookTarget = books.find(book => book.id === bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}