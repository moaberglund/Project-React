import { Outlet } from "react-router-dom"
import AppHeader from "../components/AppHeader"


const MainLayout = () => {
  return (
    <>
      <AppHeader />
      <main>
        <div className="wrapper">
          <Outlet />
        </div>
      </main>

    </>
  )
}

export default MainLayout