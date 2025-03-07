import booksData from './../../books.json';
import BookSmall from './BookSmall';

const BookList = () => {
  // Filtrera böcker som har "Fiction" som kategori
  const fictionBooks = booksData.filter(book =>
    book.volumeInfo.categories && book.volumeInfo.categories.includes("Fiction")
  );

  return (
    <div>
      <h1>Fiction Books</h1>

      <div className='grid'>

        {fictionBooks.map((book, index) => (
          <BookSmall
            id={book.id}
            thumbnail={book.volumeInfo.imageLinks?.smallThumbnail}
            title={book.volumeInfo.title}
            authors={book.volumeInfo.authors}
            publishedDate={book.volumeInfo.publishedDate}
            pageCount={book.volumeInfo.pageCount}
            key={index} />

        ))}
      </div>
    </div>
  );
};

export default BookList;
