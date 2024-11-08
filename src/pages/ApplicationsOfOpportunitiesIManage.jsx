import React, { useEffect, useState } from "react";
import ApplicationCard from "./../components/ApplicationCard.jsx";
import { fetchApplications } from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser.jsx";
import {fetchApplicationCV} from "../api/DownloadCV.jsx"; // Adjust the path as needed

const ApplicationsofOpportunitiesIManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const [perPage, setPerPage] = useState(30);

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const variables = {
                page: page,
                perPage: perPage,
                filters: {
                    my: "opportunity"
                },
                q: "",
                applicant_name: true,
                email: true,
                opportunity: true,
                status: true,
                slot: true,
                home_mc: true,
                home_lc: true,
                phone_number: true,
                sort: ""
            };
            const data = await fetchApplications(variables);
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

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleJumpPage = () => {
        const page = parseInt(jumpPage, 10);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setJumpPage("");
        } else {
            alert(`Please enter a page number between 1 and ${totalPages}`);
        }
    };

    // State to track status change
    const [statusChange, setStatusChange] = useState({
        applicationId: null,
        currentStatus: '',
        newStatus: '',
        showDialog: false,
    });

    // Handle status change with a confirmation dialog
    const handleStatusChange = (applicationId, currentStatus, newStatus) => {
        setStatusChange({
            applicationId,
            currentStatus,
            newStatus,
            showDialog: true,
        });
    };

    // Confirm status change
    const confirmStatusChange = () => {
        setApplications((prevApplications) =>
            prevApplications.map((app) =>
                app.id === statusChange.applicationId
                    ? { ...app, status: statusChange.newStatus }
                    : app
            )
        );
        closeDialog();
    };

    // Close the dialog without making any changes
    const closeDialog = () => {
        setStatusChange({
            applicationId: null,
            currentStatus: '',
            newStatus: '',
            showDialog: false,
        });
    };

    const handleDownload = async (applicationId) => {
        const cvUrl = await fetchApplicationCV(applicationId);

        if (cvUrl) {
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = "cv.pdf"; // Customize the filename as needed
            link.click();
        } else {
            alert("CV could not be downloaded. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">Applications of Opportunities I Manage</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div
                    className="overflow-y-auto max-h-[calc(100vh-150px)] flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:space-y-0">
                    {applications.map((app) => (
                        <div key={app.id} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]">
                            <ApplicationCard
                                fullName={app.person.full_name}
                                phoneNumber={app.person.contact_detail.phone}
                                opportunityTitle={app.opportunity.title}
                                status={app.status}
                                slot={app.slot.title}
                                home_mc={app.person.home_mc.name}
                                home_lc={app.person.home_lc.name}
                                id={app.id}
                                handleStatusChange={handleStatusChange}
                                handleDownload={handleDownload}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Previous
                </button>

                <span className="text-gray-700 text-sm">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Next
                </button>

                <div className="flex items-center ml-4">
                    <input
                        type="number"
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        placeholder="Page"
                        className="w-16 p-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mr-2"
                    />
                    <button
                        onClick={handleJumpPage}
                        className="px-2 py-1 rounded-md bg-green-500 text-white text-sm"
                    >
                        Go
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsofOpportunitiesIManage;
