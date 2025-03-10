import { NavLink } from "react-router-dom"
import { FaHouse, FaRegUser } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";


const AppHeader = () => {
    const { user } = useAuth();
    return (
        <>
            <header>
                <h1>read-y</h1>

                <nav>
                    <ul>
                        <li><NavLink to={"/"}><FaHouse /> Home</NavLink></li>

                        <li><NavLink to={`/user/${user?._id}`}><FaRegUser /></NavLink></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default AppHeader