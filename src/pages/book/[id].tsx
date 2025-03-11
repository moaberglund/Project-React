import booksData from './../../../books.json';
import BookLarge from "../../components/BookLarge"
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import CreateBookReview from '../../components/CreateBookReview';
import BookShelfButton from '../../components/BookshelfButton';
import BookReview from '../../components/BookReview';
import { useEffect, useState } from 'react';
import ReviewData from '../../interfaces/ReviewData';


const BookPage = () => {

    const user = localStorage.getItem("user");
    const { id } = useParams<{ id: string }>();  // Get id from URL
    const book = booksData.find(book => book.id === id);  // Get book from JSON (HAVE TO UPDATE TO API in future)
    const navigate = useNavigate();

    // States
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch reviews of book
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`https://read-y-api.onrender.com/review/book/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);  // Update state with reviews
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);  // Runs when id changes


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

            {user ? <BookShelfButton bookId={book.id} /> : <button><NavLink to={"/user/login"}>Want to Read</NavLink></button>}

            {user ? <CreateBookReview /> : <NavLink to="/login">Login to create a review</NavLink>}

            <h2>Reviews</h2>
            {loading ? <p>Loading reviews...</p> : (
                reviews.length > 0 ? (
                    reviews.map((review) => (
                        <BookReview key={review._id} {...review} />
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )
            )}

            <button onClick={() => navigate(-1)}>Back</button>

        </>
    )
}

export default BookPage