import booksData from './../../books.json';

console.log(booksData); 


const BookList = () => {
  return (
    <div>
      <h1>Books</h1>
      <ul>
        {booksData.map((book, index) => (
          <li key={index}>{book.volumeInfo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
