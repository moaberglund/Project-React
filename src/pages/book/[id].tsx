import booksData from './../../../books.json';
import BookLarge from "../../components/BookLarge"
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import CreateBookReview from '../../components/CreateBookReview';
import BookShelfButton from '../../components/BookshelfButton';


const BookPage = () => {

    const user = localStorage.getItem("user");
    const { id } = useParams<{ id: string }>();  // Hämtar id från URL
    const book = booksData.find(book => book.id === id);  // Hitta boken från JSON eller API
    const navigate = useNavigate();

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

            {user ? <BookShelfButton bookId={book.id} /> : <button><NavLink to={"/user/login"}>Want to Read</NavLink></button> }

            {user ? <CreateBookReview /> : <NavLink to="/login">Login to create a review</NavLink>}


            <button onClick={() => navigate(-1)}>Back</button>




        </>
    )
}

export default BookPage