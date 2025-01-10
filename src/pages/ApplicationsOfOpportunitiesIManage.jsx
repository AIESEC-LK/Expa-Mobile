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

    const getFilterLabel = () => {
        if (statusFilter.length > 0) {
            return statusFilter.join(", ");
        }
        return "Filter by Status";
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center mt-10" style={{height: 'calc(100vh - 350px)'}}>
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="error-container">
                    <img src="/Error.jpg" alt="Error Image" className="error-image"/>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-2 w-full">
                    <div className="min-h-screen p-6 w-full">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full sm:w-1/3 p-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled
                            />

                            {/* Dropdown for Status Filter */}
                            <div className="relative sm:ml-auto sm:mt-0 sm:mr-20 w-full flex flex-row" ref={dropdownRef}>
                                {/* Filter by Status Label */}
                                <span className="text-sm font-medium text-gray-700 w-1/3 pt-1">Filter by Status : </span>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full sm:w-auto p-1 rounded-md border border-gray-300 text-left text-sm w-3/5"
                                >
                                    {getFilterLabel()}
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

                        <div className="w-full">
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
