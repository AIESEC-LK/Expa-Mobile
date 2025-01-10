// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicationsOfOpportunitiesIManage from "./pages/ApplicationsOfOpportunitiesIManage.jsx";
import HomePage from "./pages/Home.jsx";
import { Layout } from "./pages/Layout.jsx";
import OGXPage from "./pages/OGXPage.jsx";
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<ProtectedRoute component={<Layout />} />}>
                        <Route path="/" element={<HomePage />} /> {/* Default/Home Page */}
                        <Route
                            path="/icx/applications/my-opportunities"
                            element={<ApplicationsOfOpportunitiesIManage />}
                        />
                        <Route path="/ogx" element={<OGXPage />} /> {/* OGX Page */}
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

const ProtectedRoute = ({ component }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("aiesec_token");

        if (!token) {
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get("access_token");
            const refreshToken = urlParams.get("refresh_token");
            const expiresIn = urlParams.get("expires_in");

            if (accessToken && refreshToken && expiresIn) {
                localStorage.setItem("aiesec_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("expires_in", expiresIn);

                // Successfully authenticated, stop loading
                setIsAuthenticated(true);
                setLoading(false);

                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                window.location.replace(AUTH_URL);
            }
        } else {
            // Token exists, stop loading and continue to the app
            setIsAuthenticated(true);
            setLoading(false);
        }
    }, []);

    // Show loading screen until authentication is complete
    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10" style={{height: 'calc(100vh - 350px)'}}>
                <div className="spinner"></div>
            </div>
        );
    }
    return <>{isAuthenticated ? component : null}</>;
};

export default App;
