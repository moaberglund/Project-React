import BookLargeProps from "../interfaces/BookLargeProps"

const BookLarge = ({ id, thumbnail, title, authors, publishedDate, pageCount, description, publisher, categories }: BookLargeProps) => {
    return (
        <>
            <div id={id} className="flex book-large">

                <div className="flex-1">
                    <img src={thumbnail} alt="Book cover" />
                </div>

                <div className="flex-3">
                    <h1>{title}</h1>
                    <h2>{authors}</h2>
                    <p>{pageCount} pages</p>
                    <p>Published {publishedDate} by {publisher}</p>
                    <p className="description">{description}</p>
                    <p className="categories"><strong>Categories:</strong> {categories?.join(", ")}</p>
                </div>



            </div>
        </>
    )
}

export default BookLarge