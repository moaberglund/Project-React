import { useEffect, useState } from "react";
import BookshelfItem from "./BookshelfItem";
import BookshelfData from "../interfaces/BookshelfData";

const UserBookshelf = () => {
    const [bookshelf, setBookshelf] = useState<BookshelfData[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookshelf = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("https://read-y-api.onrender.com/bookshelf", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });

            const data = await res.json();
            if (!Array.isArray(data.books)) {
                throw new Error("API response does not contain an array under 'books'");
            }

            setBookshelf(data.books);
        } catch (err) {
            console.error("Error fetching bookshelf:", err);
            setError("Could not fetch bookshelf data");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookDetails = async (bookId: string) => {
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            if (!res.ok) throw new Error("Failed to fetch book details");
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch details for book ID ${bookId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        fetchBookshelf();
    }, []);

    useEffect(() => {
        if (bookshelf.length === 0) return;

        const fetchAllBookDetails = async () => {
            const bookDetailsPromises = bookshelf.map(book => fetchBookDetails(book.book_id)); // Create an array of promises
            const resolvedBooks = await Promise.all(bookDetailsPromises); // Wait for all promises to resolve
            setBooks(resolvedBooks.filter(book => book !== null)); // Filter out any failed promises
        };

        fetchAllBookDetails();
    }, [bookshelf]);

    if (loading) return <p>Loading bookshelf...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {books.length === 0 ? (
                <p>No books found in your bookshelf!</p>
            ) : (
                books.map((book, index) => {
                    const shelfBook = bookshelf[index]; // Find the corresponding bookshelf item
                    return (
                        <BookshelfItem
                            key={book.id}
                            id={book.id}
                            thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                            title={book.volumeInfo.title}
                            authors={book.volumeInfo.authors}
                            publishedDate={book.volumeInfo.publishedDate}
                            pageCount={book.volumeInfo.pageCount}
                            status={shelfBook.status}
                        />
                    );
                })
            )}
        </div>
    );
};

export default UserBookshelf;
