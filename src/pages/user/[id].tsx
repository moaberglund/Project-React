import { FaGear, FaPowerOff } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserBookshelf from "../../components/UserBookShelf";


const UserPage = () => {

    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

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
            <div className="user-page">

                <div className="user-info grid">
                    {loading && <p>Loading...</p>}
                    <div>
                        {/*Firstname Lastname*/}
                        <h1> {user ? user.firstname : ""} {user ? user.lastname : ""}</h1>

                        {/*@username*/}
                        <p>@{user ? user.username : ""}</p>

                        {/*City, Country*/}
                        <p>
                            {user?.city ?? ""}
                            {user?.city && user?.country ? ", " : ""}
                            {user?.country ?? ""}
                        </p>

                        <button style={{ marginTop: '1em' }} className="btn-green" onClick={() => navigate(`/user/update/${id}`)}><FaGear /> Edit user</button>
                    </div>
                    <div>
                        <button className="btn-logout" onClick={logout}><FaPowerOff /></button>
                    </div>
                </div>

                <div className="shelfs">

                    <h2>My Bookshelf</h2>
                    <UserBookshelf />

                </div>


            </div>



        </>
    )
}

export default UserPage