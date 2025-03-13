
import { useEffect, useState } from "react";
import ReviewData from "../interfaces/ReviewData";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";

const BookReview = ({ _id, rating, title, text, user, likes, createdAt, updatedAt, onReviewDeleted }: ReviewData) => {
    const [username, setUsername] = useState<string>("Unknown user");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch current user ID from localStorage
    useEffect(() => {
        const user = localStorage.getItem("user"); // Get the logged-in user info
        if (user) {
            const parsedUser = JSON.parse(user);  // Parse user object
            setCurrentUserId(parsedUser._id);  // Set the current user ID
        }
    }, []);

    // Function to fetch username from API if user is not an object
    const fetchUsername = async (userId: string) => {
        try {
            const response = await fetch(`https://read-y-api.onrender.com/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);  // Update username state
            }
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    };

    // UseEffect to fetch username if user is not an object
    useEffect(() => {
        if (typeof user === "object" && user !== null && "username" in user) {
            setUsername((user as { username: string }).username);  // If user is an object, set username
        } else if (typeof user === "string") {
            fetchUsername(user);  // If user is ID (string), get username
        }
    }, [user]);  // Runs when user changes


    // Function to delete a review
    const deleteReview = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://read-y-api.onrender.com/review/${_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setDeleted(true);
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete the review.");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("An error occurred while deleting the review.");
        }
    };

    // Delay
    useEffect(() => {
        if (deleted) {
            const fadeOutTimer = setTimeout(() => {
                document.querySelector(".review.deleted")?.classList.add("fade-out");
            }, 1000); // Start fade-out efter 1 second
    
            const removeTimer = setTimeout(() => {
                if (onReviewDeleted) onReviewDeleted();
            }, 2000);
    
            return () => {
                clearTimeout(fadeOutTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [deleted, onReviewDeleted]);
    

    if (deleted) {
        return <div className="review deleted">📌 This review has been deleted.</div>;
    }

    return (
        <div className="review flex">
            <div className="flex-2">
                <div><h2 className="username" style={{ display: "inline" }}>{username}</h2><h2 style={{ display: "inline" }}> rated it</h2></div>

                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: rating && i < rating ? "gold" : "lightgray" }}>
                        {i < rating ? "★" : "☆"}
                    </span>
                ))}
            </div>

            <div className="flex-5">
                <h3>{title}</h3>
                <p>{text}</p>

                <div className="dates">
                    <p>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}</p>
                    <p>Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : "Unknown"}</p>
                </div>

                <div className="buttons">
                    {typeof user === "object" && user !== null && currentUserId === (user as { _id: string })._id && (
                        <>
                            <button onClick={() => navigate(`/review/${_id}`)}>Edit</button>
                            <button onClick={deleteReview}>Delete</button>

                        </>
                    )}
                    {currentUserId && <LikeButton reviewId={_id} initialLikes={likes} />}
                </div>
            </div>
        </div>
    );
};

export default BookReview;
