import React, { useEffect, useRef, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import PaginationControls from "../components/PaginationControls";
import { fetchApplications } from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser";
import applicationFetchConfig from "../config/defaultOpportunityApplication.jsx";
import { fetchApplicationCV } from "../api/DownloadCV.jsx";

const ApplicationsofOpportunitiesIManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const [perPage, setPerPage] = useState(30);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState([]); // Array for multiple statuses
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for detecting outside clicks

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const data = await fetchApplications(
                applicationFetchConfig(page, perPage, searchQuery, statusFilter)
            );
            setApplications(data.data);
            setTotalPages(Math.ceil(data.paging.total_items / perPage));
        } catch (err) {
            setError("Failed to load applications.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, searchQuery, statusFilter]);

    // Handle status filter selection
    const handleStatusChange = (status) => {
        setStatusFilter((prevStatuses) =>
            prevStatuses.includes(status)
                ? prevStatuses.filter((s) => s !== status)
                : [...prevStatuses, status]
        );
    };

    const handleDownload = async (applicationId) => {
        const cvUrl = await fetchApplicationCV(applicationId);
        if (cvUrl) {
            const link = document.createElement("a");
            link.href = cvUrl;
            link.download = "cv.pdf";
            link.click();
        } else {
            alert("CV could not be downloaded. Please try again.");
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {loading ? (
                <div role="status" className="flex justify-center">
                    <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col items-center justify-center mt-2">
                    <h1 className="text-lg font-semibold text-gray-800 mb-4">
                        Applications of Opportunities I Manage
                    </h1>
                    <div className="min-h-screen bg-gray-100 p-4">
                        <div className="mb-4 flex flex-col sm:flex-row justify-between">
                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full sm:w-1/3 p-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* Dropdown for Status Filter */}
                            <div className="relative sm:ml-auto mt-2 sm:mt-0 sm:mr-20" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full sm:w-auto p-1 rounded-md border border-gray-300 text-left text-sm"
                                >
                                    Filter by Status
                                </button>
                                {isDropdownOpen && (
                                    <div
                                        className="absolute top-full mt-1 w-full sm:w-auto bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-48 overflow-y-auto z-50"
                                    >
                                        {[
                                            "open",
                                            "matched",
                                            "accepted",
                                            "rejected",
                                            "approved_by_home",
                                            "approved",
                                            "realized",
                                        ].map((status) => (
                                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={status}
                                                    checked={statusFilter.includes(status)}
                                                    onChange={() => handleStatusChange(status)}
                                                    className="form-checkbox h-4 w-4 text-blue-600"
                                                />
                                                <span className="text-gray-700 text-sm capitalize">{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            {applications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    fullName={app.person.full_name}
                                    phoneNumber={app.person.contact_detail ? app.person.contact_detail.phone : "No_Phone"}
                                    opportunityTitle={app.opportunity.title}
                                    status={app.status}
                                    slot={app.slot.title}
                                    home_mc={app.person.home_mc.name}
                                    home_lc={app.person.home_lc.name}
                                    handleDownload={() => handleDownload(app.id)}
                                    id={app.id}
                                />
                            ))}
                        </div>
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
        </>
    );
};

export default ApplicationsofOpportunitiesIManage;
