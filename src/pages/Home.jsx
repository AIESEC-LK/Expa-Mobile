import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Card = ({ title, description, link }) => {
    return (
        <Link to={link} className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                <img
                    src="/AIESEC-Human-Blue.png"
                    alt={`${title} Logo`}
                    className="w-full h-32 object-contain p-4"
                />
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>
        </Link>
    );
};

const HomePage = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-wrap justify-center gap-6">
                {/* ICX Card */}
                <Card
                    title="iCX"
                    description="View iCX Applications of Opportunities I Manage"
                    link="/icx/applications/my-opportunities"
                />
                {/* OGX Card */}
                <Card
                    title="oGX"
                    description="View oGX Signups and Assign Managers"
                    link="/ogx"
                />
            </div>
        </div>
    );
};

export default HomePage;
