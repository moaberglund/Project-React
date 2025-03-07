import booksData from './../../../books.json';
import BookLarge from "../../components/BookLarge"
import { useParams } from 'react-router-dom';


const BookPage = () => {

    const { id } = useParams<{ id: string }>();  // Hämtar id från URL
    const book = booksData.find(book => book.id === id);  // Hitta boken från JSON eller API

    console.log(id);
    console.log(book);

    if (!book) {
        return <p>Book not found</p>;
    }

    return (
        <>
            <BookLarge
                id={book.id}
                thumbnail={book.volumeInfo.imageLinks?.smallThumbnail}
                title={book.volumeInfo.title}
                authors={book.volumeInfo.authors}
                publishedDate={book.volumeInfo.publishedDate}
                pageCount={book.volumeInfo.pageCount}
                description={book.volumeInfo.description}
                publisher={book.volumeInfo.publisher}
                categories={book.volumeInfo.categories}
            />
        </>
    )
}

export default BookPage