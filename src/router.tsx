import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/book/[id]";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/book/:id",
        element: <BookPage />
    }
])