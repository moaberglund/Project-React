import BookLarge from "../../components/BookLarge";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CreateBookReview from "../../components/CreateBookReview";
import BookShelfButton from "../../components/BookshelfButton";
import BookReview from "../../components/BookReview";
import { useEffect, useState } from "react";
import ReviewData from "../../interfaces/ReviewData";
import { FaChevronLeft } from "react-icons/fa6";

const BookPage = () => {
    const user = localStorage.getItem("user");
    const { id } = useParams<{ id: string }>();  // Hämta bok-ID från URL
    const navigate = useNavigate();

    // State för boken, recensioner och laddning
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<ReviewData[]>([]);

    // Hämta bok från Google Books API
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
                if (!response.ok) throw new Error("Failed to fetch book");

                const data = await response.json();
                setBook(data);
            } catch (error) {
                setError("Book not found.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBook();
    }, [id]);

    // Hämta recensioner av boken från ditt API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`https://read-y-api.onrender.com/review/book/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        if (id) fetchReviews();
    }, [id]);

    if (loading) return <p>Loading book...</p>;
    if (error || !book) return <p>{error || "Book not found"}</p>;

    return (
        <>
            <BookLarge
                id={book.id}
                thumbnail={book.volumeInfo?.imageLinks?.thumbnail}
                title={book.volumeInfo?.title}
                authors={book.volumeInfo?.authors}
                publishedDate={book.volumeInfo?.publishedDate}
                pageCount={book.volumeInfo?.pageCount}
                // Allow React to render HTML from the API
                description={
                    book.volumeInfo?.description ? (
                        <span dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }} />
                    ) : (
                        <span>No description available</span>
                    )
                }
                publisher={book.volumeInfo?.publisher}
                categories={book.volumeInfo?.categories}
            />

            {user ? (
                <div style={{ marginTop: '2em', marginBottom: '2em' }}>
                    <BookShelfButton bookId={book.id} />
                </div>
            ) : (
                <button>
                    <NavLink to={"/user/login"}>Want to Read</NavLink>
                </button>
            )}

            {user ? <CreateBookReview /> : <NavLink to="/user/login">Login to create a review</NavLink>}

            <h2 style={{ marginTop: '1em', marginBottom: '0.5em' }}>Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => <BookReview key={review._id} {...review} />)
            ) : (
                <p>No reviews yet.</p>
            )}

            <button style={{ marginTop: '2em', marginBottom: '2em' }} className="btn-back" onClick={() => navigate(-1)}><FaChevronLeft /> Back</button>
        </>
    );
};

export default BookPage;
