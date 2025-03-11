import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/book/[id]";
import UserPage from "./pages/user/[id]";
import MainLayout from "./layouts/MainLayout";
import SignUpPage from "./pages/user/SignUpPage";
import LoginPage from "./pages/user/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UpdateBookReviewPage from "./pages/review/update";

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
                element: (
                    <ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/user/signup",
                element: <SignUpPage />
            },
            {
                path: "/user/login",
                element: <LoginPage />
            },
            {
                path: "review/:id",
                element:
                    <ProtectedRoute>
                        <UpdateBookReviewPage />
                    </ProtectedRoute>
            }

        ]
    }

])