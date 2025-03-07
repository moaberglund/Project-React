import booksData from './../../books.json';

const BookList = () => {
  // Filtrera böcker som har "Fiction" som kategori
  const fictionBooks = booksData.filter(book => 
    book.volumeInfo.categories && book.volumeInfo.categories.includes("Fiction")
  );

  return (
    <div>
      <h1>Fiction Books</h1>
      <ul>
        {fictionBooks.map((book, index) => (
          <li key={index}>{book.volumeInfo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
