import { NavLink } from "react-router-dom"
import { FaHouse, FaRegUser } from "react-icons/fa6";


const AppHeader = () => {
    return (
        <>
            <header>
                <h1>read-y</h1>

                <nav>
                    <ul>
                        <li><NavLink to={"/"}><FaHouse /> Home</NavLink></li>
                        <li><NavLink to={"/"}><FaRegUser /></NavLink></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default AppHeader