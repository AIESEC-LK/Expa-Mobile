import React, { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import PaginationControls from "../components/PaginationControls";
import StatusChangeDialog from "../components/StatusChangeDialog";
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
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query
    const [statusChange, setStatusChange] = useState({
        applicationId: null,
        currentStatus: '',
        newStatus: '',
        showDialog: false,
    });

    // Fetch data based on page and search query
    const fetchData = async (page) => {
        setLoading(true);
        try {
            const data = await fetchApplications(applicationFetchConfig(page, perPage, searchQuery)); // Pass searchQuery
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
    }, [currentPage, searchQuery]); // Re-fetch when searchQuery changes

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">Applications of Opportunities I Manage</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange} // Update searchQuery state on input change
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="overflow-y-auto max-h-[calc(100vh-150px)] flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:space-y-0">
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
                            handleDownload={() => handleDownload(app.id)}
                        />
                    ))}
                </div>
            )}

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {statusChange.showDialog && (
                <StatusChangeDialog statusChange={statusChange} setStatusChange={setStatusChange} setApplications={setApplications} />
            )}
        </div>
    );
};

export default ApplicationsofOpportunitiesIManage;
