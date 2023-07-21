import React from 'react';
import "./style.scss";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./components/Home";
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

function App() {
    const { currentUser } = useContext(AuthContext);
    /**
     * The ProtectedRoute component handles the rendering of protected routes.
     * If the user is not authenticated, it redirects to the login page.
     */
    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    return (
        <BrowserRouter>
            <AnimatePresence>
                <Routes>
                    <Route path="/">
                        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route path="*" element={<Login />} />
                    </Route>
                </Routes>
            </AnimatePresence>
        </BrowserRouter>
    );
}

export default App;