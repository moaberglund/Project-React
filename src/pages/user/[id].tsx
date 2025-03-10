import { FaPowerOff } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";


const UserPage = () => {

    const { user, logout } = useAuth();


    return (
        <>
            <p>Welcome {user ? user.username : ""}</p>
            <button className="logout" onClick={logout}><FaPowerOff /></button>

            <h1>User page</h1>
            <h2>My shelfs</h2>
        </>
    )
}

export default UserPage