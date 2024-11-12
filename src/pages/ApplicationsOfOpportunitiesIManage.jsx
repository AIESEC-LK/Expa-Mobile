import React, { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import PaginationControls from "../components/PaginationControls";
import StatusChangeDialog from "../components/StatusChangeDialog";
import { fetchApplications } from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser";
import { fetchApplicationCV } from "../api/DownloadCV";
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
    const [statusFilter, setStatusFilter] = useState("");
    const [statusChange, setStatusChange] = useState({
        applicationId: null,
        currentStatus: '',
        newStatus: '',
        showDialog: false,
    });

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const data = await fetchApplications(applicationFetchConfig(page, perPage));
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
    }, [currentPage]);

    const handleDownload = async (applicationId) => {
        const cvUrl = await fetchApplicationCV(applicationId);
        if (cvUrl) {
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = "cv.pdf";
            link.click();
        } else {
            alert("CV could not be downloaded. Please try again.");
        }
    };

    // Filter applications based on search query and status filter
    const filteredApplications = applications.filter((app) => {
        const matchesSearch = app.person.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter ? app.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">Applications of Opportunities I Manage</h1>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-40 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Accept">Accept</option>
                    <option value="Reject">Reject</option>
                    <option value="Approved by Home">Approved by Home</option>
                    <option value="Approved">Approved</option>
                    <option value="Realized">Realized</option>
                </select>
            </div>

            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-y-auto max-h-[calc(100vh-150px)] flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:space-y-0">
                    {filteredApplications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            fullName={app.person.full_name}
                            phoneNumber={app.person.contact_detail ? app.person.contact_detail.phone : "No Phone"}
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
