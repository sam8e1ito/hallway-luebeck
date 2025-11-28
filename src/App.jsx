import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Chats = lazy(() => import("./pages/Chats"));
const AnonChat = lazy(() => import("./pages/AnonChat"));
const PublicChat = lazy(() => import("./pages/PublicChat"));
const Search = lazy(() => import("./pages/Search"));
const Profile = lazy(() => import("./pages/Profile"));

function AppContent() {
    const location = useLocation();

    const hideNavbar = ["/login", "/register"].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chats"
                        element={
                            <ProtectedRoute>
                                <Chats />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chats/anon"
                        element={
                            <ProtectedRoute>
                                <AnonChat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chats/public"
                        element={
                            <ProtectedRoute>
                                <PublicChat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
