// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicationsOfOpportunitiesIManage from "./pages/ApplicationsOfOpportunitiesIManage.jsx";
import HomePage from "./pages/Home.jsx";
import { Layout } from "./pages/Layout.jsx";
import OGXPage from "./pages/OGXPage.jsx";

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

            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            window.location.replace("https://localhost:3000/api?X-Callback-Url=http://localhost:5173");
        }
    }

    return <>{component}</>;
};

export default App;
