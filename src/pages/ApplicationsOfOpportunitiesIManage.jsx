import React, { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import PaginationControls from "../components/PaginationControls";
import { fetchApplications } from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser";
import applicationFetchConfig from "../config/defaultOpportunityApplication.jsx";

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

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const data = await fetchApplications(applicationFetchConfig(page, perPage, searchQuery, statusFilter));
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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-sm font-semibold text-gray-800 mb-4">Applications of Opportunities I Manage</h1>

            <div className="mb-4 flex flex-col sm:flex-row">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full sm:w-1/3 p-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Dropdown for Status Filter */}
                <div className="relative sm:ml-auto mt-2 sm:mt-0 sm:mr-20">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full sm:w-auto p-1 rounded-md border border-gray-300 text-left text-sm"
                    >
                        Filter by Status
                    </button>
                    {isDropdownOpen && (
                        <div
                            className="absolute top-full mt-1 w-full sm:w-auto bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-48 overflow-y-auto">
                            {["open", "matched", "accepted", "rejected", "approved_by_home", "approved", "realized"].map((status) => (
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

            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div
                    className="overflow-y-auto max-h-[calc(100vh-150px)] flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:space-y-0">
                    {applications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            fullName={app.person.full_name}
                            phoneNumber={app.person.contact_detail ? app.person.contact_detail.phone : "No_Phone"}
                            opportunityTitle={app.opportunity.title}
                            status={app.status}
                            slot={app.slot.title}
                            home_mc={app.person.home_mc.name}
                            home_lc={app.person.home_lc.name}
                            id={app.id}
                        />
                    ))}
                </div>
            )}

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default ApplicationsofOpportunitiesIManage;
