import React from "react";

const OGXApplicationCard = ({
    id,
    fullName,
    home_mc,
    home_lc,
    phoneNumber,
    opportunityTitle,
    status,
    assignedManagers,  // Added managers prop
}) => {
    return (
        <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-lg font-semibold text-blue-600">{fullName}</h2>
                    <p className="text-sm text-gray-600">{home_lc} / {home_mc}</p>
                </div>
                <p className="text-sm text-gray-600">{status}</p>
            </div>
            <p className="text-sm text-gray-500 italic mb-2">Opportunity - {opportunityTitle}</p>
            <div className="flex items-center gap-2 mb-2">
                {phoneNumber ? (
                    <a href={`tel:${phoneNumber}`} className="text-blue-600 text-sm">
                        +{phoneNumber}
                    </a>
                ) : (
                    <span className="text-red-600 text-sm">No phone</span>
                )}
            </div>

            {/* Managers section */}
            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700">Assigned Managers</h3>
                {assignedManagers && assignedManagers.length > 0 ? (
                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                        {assignedManagers.map((manager, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span>{manager.full_name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No managers assigned</p>
                )}
            </div>
        </div>
    );
};

export default OGXApplicationCard;
