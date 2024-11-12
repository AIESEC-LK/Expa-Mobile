// ApplicationCard.jsx
import React from "react";
import StatusDropdown from "./StatusDropdown.jsx";

const ApplicationCard = ({ id, fullName, home_mc, home_lc, phoneNumber, opportunityTitle, status, slot, handleStatusChange, handleDownload }) => {
    return (
        <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-lg font-semibold text-blue-600">{fullName}</h2>
                    <p className="text-sm text-gray-600">{home_lc} / {home_mc}</p>
                </div>
                <StatusDropdown
                    initialStatus={status}
                    onChangeStatus={(newStatus) => handleStatusChange(id, newStatus)}
                />
            </div>
            <p className="text-sm text-gray-500 italic mb-2">Opportunity - {opportunityTitle}</p>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-200 text-yellow-700 text-xs font-semibold py-1 px-2 rounded">{slot}</span>
            </div>
            <div className="flex justify-between items-center">
                {phoneNumber ? (
                    <a href={`tel:${phoneNumber}`} className="text-blue-600 text-sm">
                        +{phoneNumber}
                    </a>
                ) : (
                    <span className="text-red-600 text-sm">No phone</span>
                )}
                <a
                    href="#"
                    className="text-gray-500 text-sm flex items-center"
                    onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        handleDownload(); // Call handleDownload directly, since app ID is passed as an argument
                    }}
                >
                    <div className="flex flex-row">
                        <div className="flex flex-col items-end text-[11px] -mt-1">
                            <span>Download</span>
                            <span className="-mt-1">CV</span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                        </svg>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default ApplicationCard;