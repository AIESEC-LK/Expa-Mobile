import React, { useState } from 'react';

function Layout() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logged out");
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Icon A */}
            <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-md text-white font-bold">
                A
            </div>

            {/* Profile icon with dropdown */}
            <div className="relative">
                <div
                    onClick={toggleDropdown}
                    className="w-10 h-10 bg-orange-400 flex items-center justify-center rounded-full text-white font-bold cursor-pointer"
                >
                    N
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Layout;
