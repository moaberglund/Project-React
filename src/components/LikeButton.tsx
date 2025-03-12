import { useState, useEffect } from "react";

interface LikeButtonProps {
    reviewId: string;
    initialLikes?: number;
}

const LikeButton = ({ reviewId, initialLikes = 0 }: LikeButtonProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    const handleLike = async () => {
        if (!token) {
            setError("You must be logged in to like a review.");
            return;
        }

        try {
            const response = await fetch(`https://read-y-api.onrender.com/like/${reviewId}`, {
                method: liked ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setLiked(!liked);
                setLikes(prevLikes => liked ? prevLikes - 1 : prevLikes + 1);
                setError(null); 
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update like.");
            }
        } catch (error) {
            console.error("Error liking review:", error);
            setError("An error occurred while processing your like.");
        }
    };

    // Effect to clear message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000); // time here is in milliseconds

            return () => clearTimeout(timer); // Clear timer if component unmounts
        }
    }, [error]);

    return (
        <div style={{ textAlign: "center" }}>
            <button onClick={handleLike} style={{ background: "none", border: "none", fontSize: "1.1em", cursor: "pointer" }}>
                {liked ? "❤️" : "🤍"} {likes}
            </button>
            {error && <p style={{ color: "red", fontSize: "0.9em", marginTop: "0.5em", display: "inline"}}>{error}</p>}
        </div>
    );
};

export default LikeButton;
