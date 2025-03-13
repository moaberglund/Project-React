import { useState } from "react"
import { useParams } from "react-router-dom";
import ReviewData from "../interfaces/ReviewData"
import ReviewError from "../interfaces/ReviewError";
import * as Yup from "yup";

interface CreateBookReviewProps {
    onReviewSubmitted?: () => void;
}

const CreateBookReview = ({ onReviewSubmitted }: CreateBookReviewProps) => {

    const { bookId } = useParams();
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const [reviewData, setReviewData] = useState<ReviewData>({
        _id: "",
        rating: 1,
        title: "",
        text: "",
        user: parsedUser || null,
        book_id: bookId || window.location.pathname.split("/")[2]
    });



    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ReviewError>({});

    // Yup
    const validationSchema = Yup.object({
        rating: Yup.number().required('Please give the book a rating.').min(1).max(5),
        title: Yup.string().required('Please give the review a title.').min(5, "The title must be at least 5 character.").max(100),
        text: Yup.string().required().min(5, "A good text should be a least 5 characters long, let's try again.").max(500, "A review longer than 500 characters is a bit much, don't you think? Let's shorten it a bit."),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


        // Check if the user is logged in
        if (!parsedUser) {
            setError({ text: "You must be logged in to create a review." });
            setLoading(false);
            return;
        }

        // Get the token
        const token = localStorage.getItem("token");

        try {
            // Validate
            await validationSchema.validate(reviewData, { abortEarly: false });

            // Send data to the API
            const response = await fetch("https://read-y-api.onrender.com/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...reviewData,
                    user: {
                        _id: parsedUser._id,
                        username: parsedUser.username,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create review");
            }

            setError({});
            setReviewData({
                _id: '',
                rating: 1,
                title: '',
                text: '',
                user: parsedUser,
                book_id: bookId || window.location.pathname.split("/")[2]
            });

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }

        } catch (errors) {
            const validationErrors: ReviewError = {};

            if (errors instanceof Yup.ValidationError) {
                errors.inner.forEach(error => {
                    const prop = error.path as keyof ReviewError;
                    validationErrors[prop] = error.message;
                });
                setError(validationErrors);
                return;
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>


                <select
                    id="rating"
                    name="rating"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    className="form-control"
                >
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                {error.rating && <p className="error-message">{error.rating}</p>}


                <input
                    placeholder="Review Title"
                    id="title"
                    name="title"
                    value={reviewData.title}
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    className="form-control"
                />
                {error.title && <p className="error-message">{error.title}</p>}

                <textarea
                    placeholder="Review Text"
                    id="text"
                    name="text"
                    value={reviewData.text}
                    onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                    className="form-control"
                />
                {error.text && <p className="error-message">{error.text}</p>}

                <button type="submit" className="btn btn-create" disabled={loading}>
                    {loading ? "Loading..." : "Create Review"}
                </button>

            </form>

        </>
    )
}

export default CreateBookReview