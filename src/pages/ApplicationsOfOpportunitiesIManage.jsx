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
        console.log("Download", applicationId);
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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">Applications of Opportunities I Manage</h1>

            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-y-auto max-h-[calc(100vh-150px)] flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:space-y-0">
                    {applications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            fullName={app.person.full_name}
                            phoneNumber={app.person.contact_detail.phone}
                            opportunityTitle={app.opportunity.title}
                            status={app.status}
                            slot={app.slot.title}
                            home_mc={app.person.home_mc.name}
                            home_lc={app.person.home_lc.name}
                            id={app.id}
                            handleDownload={() => handleDownload(app.id)} // Pass a function with app.id as argument
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
