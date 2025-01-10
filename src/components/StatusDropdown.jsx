import React, { useState } from "react";
import { statusStyles, statusOptions } from "./../config/statusConfig.jsx";

const StatusDropdown = ({ initialStatus, onChangeStatus }) => {
    const capitalizeStatus = (status) => status.toUpperCase();
    const initialStatusCapitalized = capitalizeStatus(initialStatus);
    const [status, setStatus] = useState(initialStatusCapitalized);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Handle status change
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onChangeStatus(newStatus); // Callback to inform parent component of the change
        setDropdownOpen(false); // Close the dropdown after selection
    };

    // Toggle dropdown state
    const toggleDropdown = (event) => {
        event.preventDefault();
        setDropdownOpen((prev) => !prev); // Toggle the dropdown open/close state
    };

    return (
        <div
            className={`relative py-1 px-3 rounded-full text-xs font-semibold ${statusStyles[status]} flex items-center cursor-pointer`}
            onClick={toggleDropdown}
        >
            <div className="flex items-center justify-between w-full">
                <span>{status}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1 text-inherit"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>
            {dropdownOpen && (
                <ul
                    className="absolute top-full left-0 bg-white border rounded-md shadow-md mt-1 w-full"
                    style={{
                        zIndex: 10,
                        overflow: "hidden",
                    }}
                >
                    {statusOptions[initialStatusCapitalized].map((option) => (
                        <li
                            key={option.label}
                            className={`px-3 py-1 cursor-pointer hover:bg-gray-200 ${option.color}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(option.label);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StatusDropdown;
