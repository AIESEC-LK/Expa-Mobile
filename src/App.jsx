// Import React, BrowserRouter, Route, and Switch
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ApplicationsOfOpportunitiesIManage from "./pages/ApplicationsOfOpportunitiesIManage.jsx";
import HomePage from "./pages/Home.jsx";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 p-4">
                {/* Navigation Link to OpportunitiesPage */}
                <nav className="mb-4">
                    <Link to="/applications/my-opportunities" className="text-blue-500 underline">
                        Go to Opportunities
                    </Link>
                </nav>

                <div className="min-h-screen bg-gray-50 p-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* Default/Home Page */}
                        <Route path="/applications/my-opportunities" element={<ApplicationsOfOpportunitiesIManage/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
);
};

export default App;
