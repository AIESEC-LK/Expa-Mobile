import React from "react";

const ApplicationCard = ({ fullName,home_mc,home_lc, phoneNumber, opportunityTitle, status,slot }) => {
    return (
        <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-lg font-semibold text-blue-600">{fullName}</h2>
                    <p className="text-sm text-gray-600">{home_lc} / {home_mc}</p>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-semibold py-1 px-3 rounded-full">
                    {status}
                </div>
            </div>
            <p className="text-sm text-gray-500 italic mb-2">Opportunity - {opportunityTitle}</p>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-200 text-yellow-700 text-xs font-semibold py-1 px-2 rounded">{slot}</span>
            </div>
            <div className="flex justify-between items-center">
                <a href="tel:${phoneNumber}" className="text-blue-600 text-sm">+{phoneNumber}</a>
                <a href="#" className="text-gray-500 text-sm flex items-center">
                    Download CV
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5 10a1 1 0 011-1h8a1 1 0 011 1v3h2a1 1 0 110 2H4a1 1 0 110-2h2v-3zm1.707-7.707a1 1 0 010 1.414L7.414 5H11a1 1 0 010 2H7.414l-.707.707a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default ApplicationCard;
