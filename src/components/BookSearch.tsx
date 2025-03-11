import React, { useState, useEffect } from "react";
import BookSmall from "./BookSmall";

const BookSearch = () => {

    // States
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Fetch books from Google Books API
    const fetchBooks = async (query: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
            const data = await response.json();

            if (data.items) {
                setFilteredBooks(data.items); // Update the filtered books state with the fetched books
            } else {
                setFilteredBooks([]); // If no books are found, set to empty array
            }
        } catch (error) {
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook to fetch books when searchQuery changes
    useEffect(() => {
        if (searchQuery) {
            fetchBooks(searchQuery);
        } else {
            setFilteredBooks([]);
        }
    }, [searchQuery]);

    return (
        <div className="book-search">
            <h2>Search for Books</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="🔍 Search by title"
            />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div>
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book: any, id: number) => (
                        <BookSmall
                            key={id}
                            id={book.id}
                            thumbnail={book.volumeInfo.imageLinks?.smallThumbnail}
                            title={book.volumeInfo.title}
                            authors={book.volumeInfo.authors}
                            publishedDate={book.volumeInfo.publishedDate}
                            pageCount={book.volumeInfo.pageCount}
                        />
                    ))
                ) : (
                    <p>No books found.</p>
                )}
            </div>
        </div>
    );
};

export default BookSearch;
