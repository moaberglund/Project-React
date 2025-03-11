
import { useEffect, useState } from "react";
import ReviewData from "../interfaces/ReviewData";

const BookReview = ({ _id, rating, title, text, user, book_id, likes, createdAt, updatedAt }: ReviewData) => {
    const [username, setUsername] = useState<string>("Unknown user");

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
            setUsername(user.username);  // If user is an object, set username
        } else if (typeof user === "string") {
            fetchUsername(user);  // Om user is ID (string), get username
        }
    }, [user]);  // Runs when user changes

    // Function to render stars based on rating
    const renderStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating); // 5 is max
    };

    return (
        <div className="review">
            <div className="flex-1">
                <h2>{username} rated it</h2>
                <span>{renderStars(rating)} ({rating}/5)</span>
            </div>

            <div className="flex-3">
                <h3>{title}</h3>
                <p>{text}</p>
                <p>{likes} likes</p>
                <p>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}</p>
                <p>Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : "Unknown"}</p>

                <button>Like</button>
            </div>
        </div>
    );
};

export default BookReview;
