import React, { useEffect, useRef, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import PaginationControls from "../components/PaginationControls";
import { fetchApplications } from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser";
import applicationFetchConfig from "../config/defaultOpportunityApplication.jsx";
import { fetchApplicationCV } from "../api/DownloadCV.jsx";
import { changeStatusOfApplication } from "../api/ApplicationMutations.jsx"; // added import

const ApplicationsofOpportunitiesIManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 30;
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [statusFilter, setStatusFilter] = useState([]); // Array for multiple statuses
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for detecting outside clicks

    // New: ref for the scrollable list container and state to control visibility of pagination
    const listRef = useRef(null);
    const [showPagination, setShowPagination] = useState(false);
    const tickingRef = useRef(false);

    useEffect(() => {
        // Set up a timer to update the debounced query
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 800); // 0.5 seconds

        // This is the cleanup function:
        // If searchQuery changes again (i.e., user types),
        // clear the previous timer before setting a new one.
        return () => {
            clearTimeout(timerId);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [debouncedSearchQuery, statusFilter]);

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const data = await fetchApplications(
                applicationFetchConfig(page, perPage, debouncedSearchQuery, statusFilter)
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
    }, [currentPage, debouncedSearchQuery, statusFilter]);

    // Handle status filter selection
    const handleStatusChange = (status) => {
        setStatusFilter((prevStatuses) =>
            prevStatuses.includes(status)
                ? prevStatuses.filter((s) => s !== status)
                : [...prevStatuses, status]
        );
    };

    // New: handler to change an individual application's status (passed to ApplicationCard)
    // Accepts optional rejection_reason_id as a third parameter
    const handleApplicationStatusChange = async (applicationId, newStatus, rejection_reason_id = null) => {
        try {
            setLoading(true);
            if (rejection_reason_id) {
                await changeStatusOfApplication(applicationId, newStatus, rejection_reason_id);
            } else {
                await changeStatusOfApplication(applicationId, newStatus);
            }
            // Refresh the list to reflect the updated status
            await fetchData(currentPage);
        } catch (err) {
            console.error('Failed to change application status', err);
            // Optionally set an error message for the UI
            setError('Failed to change application status.');
        } finally {
            setLoading(false);
        }
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

    // New: scroll handler to detect near-bottom and toggle pagination visibility
    const handleScroll = () => {
        const el = listRef.current;
        if (!el) return;
        // throttle with rAF
        if (tickingRef.current) return;
        tickingRef.current = true;
        requestAnimationFrame(() => {
            const { scrollTop, clientHeight, scrollHeight } = el;
            const threshold = Math.min(100, Math.floor(clientHeight * 0.2));
            const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

            // Only show pagination when there's more than 1 page and not loading/error
            const visible = totalPages > 1 && !loading && !error && (nearBottom || scrollHeight <= clientHeight);

            setShowPagination(visible);
            tickingRef.current = false;
        });
    };

    // Recalculate pagination visibility after content/load changes
    useEffect(() => {
        // Small timeout to ensure layout is ready then run the scroll check
        const t = setTimeout(() => {
            handleScroll();
        }, 50);
        return () => clearTimeout(t);
    }, [applications, totalPages, loading, error]);

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
                <div className="flex flex-col flex-1 items-center w-full bg-gray-50 min-h-0">
                <div className="flex flex-col w-full max-w-3xl p-4 sm:p-6">
                        <div className="flex flex-col gap-4 mb-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search applicants"
                                className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />


                            {/* Status Filter */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full p-3 bg-white rounded-xl border border-gray-300 shadow-sm text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <span className="font-medium text-sm">Status: </span>
                                    <span className="text-sm">{getFilterLabel()}</span>
                                </button>


                                {isDropdownOpen && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg p-3 z-50 max-h-60 overflow-y-auto">
                                        {[
                                            "open",
                                            "matched",
                                            "accepted",
                                            "rejected",
                                            "approved_by_home",
                                            "approved",
                                            "realized",
                                        ].map((status) => (
                                            <label key={status} className="flex items-center gap-3 py-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={status}
                                                    checked={statusFilter.includes(status)}
                                                    onChange={() => handleStatusChange(status)}
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                />
                                                <span className="text-gray-700 text-sm capitalize">{status.replace(/_/g, " ")}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full">
                            {/* Attach ref and onScroll to the scrollable list; reduce spacing (space-y and add pb) */}
                            <div
                                ref={listRef}
                                onScroll={handleScroll}
                                className={`flex-1 overflow-y-auto space-y-3 pr-2 pb-2`}
                            >
                                {applications.map((app) => (
                                    <ApplicationCard
                                        key={app.id}
                                        fullName={app.person.full_name}
                                        countryCode={app.person.contact_detail ? app.person.contact_detail.country_code : "No_Code"}
                                        phoneNumber={app.person.contact_detail ? app.person.contact_detail.phone : "No_Phone"}
                                        opportunityTitle={app.opportunity.title}
                                        status={app.status}
                                        slot={app.slot.title}
                                        home_mc={app.person.home_mc.name}
                                        home_lc={app.person.home_lc.name}
                                        handleDownload={() => handleDownload(app.id)}
                                        id={app.id}
                                        handleStatusChange={handleApplicationStatusChange} // pass handler to card
                                    />
                                ))}
                            </div>
                         </div>
                    {showPagination && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplicationsofOpportunitiesIManage;
