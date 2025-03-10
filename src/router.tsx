import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/book/[id]";
import UserPage from "./pages/user/[id]";
import MainLayout from "./layouts/MainLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/book/:id",
                element: <BookPage />
            },
            {
                path: "/user/:id",
                element: <UserPage />
            }

        ]
    }

])