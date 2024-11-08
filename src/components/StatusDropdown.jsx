import React, { useState } from 'react';

const StatusDropdown = ({ initialStatus, onChangeStatus }) => {
    // Capitalize the initial status
    const capitalizeStatus = (status) => status.toUpperCase();

    const initialStatusCapitalized = capitalizeStatus(initialStatus);
    const [status, setStatus] = useState(initialStatusCapitalized);

    // Define color classes for each status
    const statusStyles = {
        'OPEN': 'bg-blue-100 text-blue-700',
        'ACCEPT': 'bg-green-100 text-green-700',
        'REJECT': 'bg-red-100 text-red-700',
        'APPROVED BY HOME': 'bg-yellow-100 text-yellow-700',
        'APPROVED': 'bg-green-200 text-green-800',
        'REALIZED': 'bg-purple-100 text-purple-700',
        'MATCHED': 'bg-indigo-100 text-indigo-700',
        'REJECTED': 'bg-red-100 text-red-700',
        'WITHDRAWN': 'bg-gray-100 text-gray-700',
        'FINISHED': 'bg-gray-200 text-gray-800',
        'APPROVAL_BROKEN': 'bg-red-200 text-red-800',
    };

    // Define status options based on the initial status
    const statusOptions = {
        'OPEN': [
            { label: 'OPEN', color: 'bg-blue-100 text-blue-700' },
            { label: 'ACCEPT', color: 'bg-green-100 text-green-700' },
            { label: 'REJECT', color: 'bg-red-100 text-red-700' }
        ],
        'APPROVED BY HOME': [
            { label: 'APPROVED BY HOME', color: 'bg-yellow-100 text-yellow-700' },
            { label: 'APPROVED', color: 'bg-green-200 text-green-800' },
            { label: 'REJECT', color: 'bg-red-100 text-red-700' }
        ],
        'APPROVED': [
            { label: 'APPROVED', color: 'bg-green-200 text-green-800' },
            { label: 'REALIZED', color: 'bg-purple-100 text-purple-700' }
        ],
        'REALIZED': [
            { label: 'REALIZED', color: 'bg-purple-100 text-purple-700' }
        ],
        'MATCHED': [
            { label: 'MATCHED', color: 'bg-indigo-100 text-indigo-700' }
        ],
        'REJECTED': [
            { label: 'REJECTED', color: 'bg-red-100 text-red-700' }
        ],
        'WITHDRAWN': [
            { label: 'WITHDRAWN', color: 'bg-gray-100 text-gray-700' }
        ],
        'FINISHED': [
            { label: 'FINISHED', color: 'bg-gray-200 text-gray-800' }
        ],
        'APPROVAL_BROKEN': [
            { label: 'APPROVAL BROKEN', color: 'bg-red-200 text-red-800' }
        ],
    };

    // Handle status change
    const handleStatusChange = (event) => {
        const newStatus = capitalizeStatus(event.target.value);
        setStatus(newStatus);
        onChangeStatus(newStatus); // Callback to inform parent component of the change
    };

    return (
        <div className={`py-1 px-3 rounded-full text-xs font-semibold ${statusStyles[status]} flex items-center`}>
            <select
                value={status}
                onChange={handleStatusChange}
                className="bg-transparent appearance-none outline-none text-inherit font-semibold"
            >
                {statusOptions[initialStatusCapitalized].map((option) => (
                    <option
                        key={option.label}
                        value={option.label}
                        className={`text-inherit ${option.color}`}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-1 text-inherit"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
    );
};

export default StatusDropdown;
