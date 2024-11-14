// Import React, BrowserRouter, Route, and Routes
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ApplicationsOfOpportunitiesIManage from "./pages/ApplicationsOfOpportunitiesIManage.jsx";
import HomePage from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx"; // Import the renamed Layout component

// Main App component with Layout as the parent of all routes
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} /> {/* Default/Home Page */}
                <Route path="/applications/my-opportunities" element={<ApplicationsOfOpportunitiesIManage />} />
            </Routes>
        </Router>
    );
};

export default App;
