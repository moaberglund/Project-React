import { useNavigate, useParams } from "react-router-dom";
import ReviewData from "../../interfaces/ReviewData";
import ReviewError from "../../interfaces/ReviewError";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";


const UpdateBookReviewPage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [review, setReview] = useState<ReviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<ReviewError | null>(null);
    const [loading, setLoading] = useState(true);


    // Yup
    const validationSchema = Yup.object({
        rating: Yup.number().required('Please give the book a rating.').min(1).max(5),
        title: Yup.string().required('Please give the review a title.').min(5, "The title must be at least 5 character.").max(100),
        text: Yup.string().required().min(5, "A good text should be a least 5 characters long, let's try again.").max(500, "A review longer than 500 characters is a bit much, don't you think? Let's shorten it a bit."),
    });
    useEffect(() => {
        if (id) {
            fetchReview(id);
        }
    }, [id]);

    const fetchReview = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`https://read-y-api.onrender.com/review/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReview(data);
            }

        } catch (err) {
            setError("Error fetching review");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        if (review) {
            setReview({ ...review, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const token = localStorage.getItem("token");

        try {
            // Validate
            await validationSchema.validate(review, { abortEarly: false });

            // Senp data to the API (PUT)
            const resp = await fetch(`https://read-y-api.onrender.com/review/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(review)
            });

            if (!resp.ok) {
                throw new Error("Failed to update review");
            }

            navigate(-1);  // Go back to previous page
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors: ReviewError = {};
                err.inner.forEach(error => {
                    const prop = error.path as keyof ReviewError;
                    validationErrors[prop] = error.message;
                });
                setErrors(validationErrors);
                return;
            }
        } finally {
            setLoading(false);
        }

    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Update Review</h1>
            <form onSubmit={handleSubmit}>

                <select name="rating" id="rating" value={review?.rating} onChange={handleChange}>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                {errors?.rating && <p>{errors.rating}</p>}


                <input type="text" name="title" id="title" value={review?.title} onChange={handleChange} />
                {errors?.title && <p>{errors.title}</p>}


                <textarea name="text" id="text" value={review?.text} onChange={handleChange}></textarea>
                {errors?.text && <p>{errors.text}</p>}

                <div style={{ marginTop: "1em" }} className="grid">
                    <button style={{ marginRight: "1em" }} onClick={() => navigate(-1)}>Cancel</button>
                    <button style={{ marginLeft: "1em" }} className="btn-update" type="submit">Update Review</button>

                </div>
            </form>

        </div>
    )
}

export default UpdateBookReviewPage