import { FaPowerOff } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const UserPage = () => {

    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);

    //Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`https://read-y-api.onrender.com/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch user data");

                const data = await res.json();
                setUser(data);

            } catch {
                console.error("Failed to fetch user data");
            } finally {
                setLoading(false);
            }

        };

        if (id) fetchUserData();
    }, [id]);



    return (
        <>
            {loading && <p>Loading...</p>}
            <div className="user-info">
                {/*Firstname Lastname*/}
                <h1> {user ? user.firstname : ""} {user ? user.lastname : ""}</h1>

                {/*@username*/}
                <p>@{user ? user.username : ""}</p>

                {/*City, Country*/}
                <p>{user ? user.city : ""} {user ? user.country : ""}</p>



            </div>

            <button className="logout" onClick={logout}><FaPowerOff /></button>

            <h1>User page</h1>
            <h2>My shelfs</h2>
        </>
    )
}

export default UserPage