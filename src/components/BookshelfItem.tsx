import { NavLink } from "react-router-dom";
import BookshelfProps from "../interfaces/BookshelfProps";


const BookshelfItem = ({ id, thumbnail, title, authors, publishedDate, pageCount, status }: BookshelfProps) => {
    // If authors is an array, display the first author only, otherwise display the author
    const displayAuthor = Array.isArray(authors) ? authors[0] : authors;
    return (
<>
            <div className="flex booksmall">
                <div className="flex-1">
                    <NavLink to={`/book/${id}`}>
                        <img src={thumbnail} alt="Book cover" />
                    </NavLink>
                </div>
                <div className="flex-3">
                    <NavLink to={`/book/${id}`}>
                        <h1>{title}</h1>
                    </NavLink>
                    <h2>by {displayAuthor}</h2>
                    <p>{publishedDate}</p>
                    <p>{pageCount} pages</p>
                    <button>{status}</button>
                </div>

            </div>
        </>
    );
};

export default BookshelfItem;
