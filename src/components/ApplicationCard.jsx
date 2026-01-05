import React, { useState } from "react";
import StatusDropdown from "./StatusDropdown.jsx";
import {rejectionReasons} from "../config/statusConfig.jsx";

const ApplicationCard = React.memo(({
                                        id,
                                        fullName,
                                        home_mc,
                                        home_lc,
                                        countryCode,
                                        phoneNumber,
                                        opportunityTitle,
                                        status,
                                        slot,
                                        handleStatusChange,
                                        handleDownload,
                                    }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedReason, setSelectedReason] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReason(""); // Reset the selected reason when modal closes
    };

    const confirmRejectReason = () => {
        if (selectedReason) {
            const rejectionData = {
                indexId: id,
                rejection_reason_id: parseInt(rejectionReasons[selectedReason].id, 10),
                reasonLabel: rejectionReasons[selectedReason].reason,
            };
            setRejectReason(rejectionData.reasonLabel);
            // Use parent's handler so the parent can run the mutation and re-fetch the query
            if (typeof handleStatusChange === 'function') {
                handleStatusChange(rejectionData.indexId, "REJECT", rejectionData.rejection_reason_id);
            }
        }
    };


    const handleConfirmClick = () => {
        // Trigger mutation via parent, then close modal
        confirmRejectReason();
        closeModal();
    };


    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md border mb-2">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="text-lg font-semibold text-blue-600">{fullName}</h2>
                    <p className="text-sm text-gray-600">{home_lc} / {home_mc}</p>
                </div>
                <StatusDropdown
                    initialStatus={status}
                    onChangeStatus={(newStatus) => {
                        console.log('status', newStatus);
                        if (newStatus === "REJECTED") {
                            openModal();
                        } else {
                            console.log("Changing status to:", newStatus);
                            handleStatusChange(id, newStatus);
                        }
                    }}
                    flow={"ICX"}
                />
            </div>
            <p className="text-sm text-gray-500 italic mb-3">Opportunity - {opportunityTitle}</p>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-200 text-yellow-700 text-xs font-semibold py-1 px-2 rounded">{slot}</span>
            </div>
            {rejectReason && (
                <p className="text-sm text-red-600 italic mb-3">
                    Reject Reason: {rejectReason}
                </p>
            )}
            <div className="flex justify-between items-center">
                {phoneNumber ? (
                    <a href={`tel:${phoneNumber}`} className="text-blue-600 text-sm">
                        {countryCode} {phoneNumber}
                    </a>
                ) : (
                    <span className="text-red-600 text-sm">No phone</span>
                )}
                <a
                    href="#"
                    className="text-gray-500 text-sm flex items-center"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDownload(id);
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

            {/* Reject Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-md p-6 w-11/12 sm:w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Select a Reject Reason</h2>
                        <div className="mb-4">
                            {Object.entries(rejectionReasons).map(([key, { reason }]) => (
                                <label key={key} className="flex items-center mb-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rejectReason"
                                        value={key}
                                        onChange={() => setSelectedReason(key)}
                                        checked={selectedReason === key}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">{reason}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmClick}
                                disabled={!selectedReason}
                                className={`px-4 py-2 rounded-md text-white ${
                                    selectedReason ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
});

export default ApplicationCard;
