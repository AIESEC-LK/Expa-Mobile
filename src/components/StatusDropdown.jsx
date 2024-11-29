import React, { useState } from 'react';
import { statusStyles, statusOptions } from './../config/statusConfig.jsx';

const StatusDropdown = ({ initialStatus, onChangeStatus }) => {
    console.log(initialStatus)
    const capitalizeStatus = (status) => status.toUpperCase();
    const initialStatusCapitalized = capitalizeStatus(initialStatus);
    const [status, setStatus] = useState(initialStatusCapitalized);

    // Handle status change
    const handleStatusChange = (event) => {
        const newStatus = capitalizeStatus(event.target.value);
        if(newStatus === "ACCEPTED"){
            setStatus("MATCHED");
        }else{
            setStatus(newStatus);
        }
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
