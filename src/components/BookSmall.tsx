import BookSmallProps from "../interfaces/BookSmallProps"

const BookSmall = ({ thumbnail, title, authors, publishedDate, pageCount }: BookSmallProps) => {
    // If authors is an array, display the first author only, otherwise display the author
    const displayAuthor = Array.isArray(authors) ? authors[0] : authors;
    return (
        <>
            <div className="flex booksmall">
                <div className="flex-1">
                    <img src={thumbnail} alt="Book cover" />
                </div>
                <div className="flex-2">
                    <h1>{title}</h1>
                    <h2>by {displayAuthor}</h2>
                    <p>{publishedDate}</p>
                    <p>{pageCount} pages</p>
                </div>
                
            </div>
        </>
    )
}

export default BookSmall