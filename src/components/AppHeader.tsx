import { NavLink } from "react-router-dom"
import { FaHouse, FaRegUser } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";


const AppHeader = () => {
    const { user } = useAuth();
    return (
        <>
            <header>
                <div className="wrapper">
                    <div className="header">
                        <NavLink to={"/"}> <h1>read-y</h1></NavLink>

                        <nav>
                            <ul>
                                <li><NavLink to={"/"}><FaHouse /> Home</NavLink></li>

                                <li><NavLink to={`/user/${user?._id}`}><FaRegUser /></NavLink></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default AppHeader