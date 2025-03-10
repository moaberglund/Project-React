import { useState } from "react";

interface Props {
    bookId: string;
}

const BookShelfButton: React.FC<Props> = ({ bookId }) => {
    const [shelfStatus, setShelfStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const handleAddToShelf = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://read-y-api.onrender.com/bookshelf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ book_id: bookId, status: "want to read" })
            });

            if (response.ok) {
                setShelfStatus("want to read");
            }
        } catch (error) {
            console.error("Error adding book to shelf", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>

            <button onClick={handleAddToShelf} disabled={loading}>
                {loading ? "Loading..." : "Want to Read"}
            </button>

        </div>
    );
};

export default BookShelfButton;
