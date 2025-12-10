import React, { useEffect, useState } from 'react';
import { fetchApplicationByApplicationID } from "../api/GetApplicationByID.jsx";
import StatusDropdown from "./StatusDropdown.jsx";
import {statusLabels} from "../config/statusConfig.jsx";

const ProjectDetails = ({ appID, opportunityId }) => {
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState([]); // Array for multiple statuses

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('Fetching project details for APP ID:', appID, 'and opportunity ID:', opportunityId);
                const results = await fetchApplicationByApplicationID(appID);  // Fetch manager data
                console.log('Results:', results);
                setProject(results || []);  // Ensure we get an empty array if no results
            } catch (error) {
                console.error('Error fetching manager data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [appID]);

    const handleStatusChange = (status) => {
        setStatusFilter((prevStatuses) =>
            prevStatuses.includes(status)
                ? prevStatuses.filter((s) => s !== status)
                : [...prevStatuses, status]
        );
    };

    const openModal = () => setIsModalOpen(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="spinner"></div>  {/* Show the spinner while loading */}
            </div>
        );
    }

    return (
        <div className="flex flex-row">
            <div className="mt-2 w-2/3">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-semibold text-xs w-2/3 pr-4">Application ID:</span>
                    <span className="text-black text-xs w-1/3">{appID}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-semibold text-xs w-2/3 pr-4">Project LC:</span>
                    <span className="text-black text-xs w-1/3">{project.host_lc.full_name}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-semibold text-xs w-2/3 pr-4">Opportunity ID:</span>
                    <span className="text-black text-xs w-1/3">{opportunityId}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-semibold text-xs w-2/3 pr-4">Slot Start Date:</span>
                    <span className="text-black text-xs w-1/3">{project.slot.start_date}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-semibold text-xs w-2/3 pr-4">Slot End Date:</span>
                    <span className="text-black text-xs w-1/3">{project.slot.end_date}</span>
                </div>
            </div>
            <div className="ml-3">
            <StatusDropdown
                initialStatus={(() => {
                    const key = project.status ? String(project.status).toUpperCase() : project.status;
                    return statusLabels[key] || key;
                })()}
                onChangeStatus={(newStatus) => {
                    if (newStatus === "REJECTED") {
                        openModal();
                    } else {
                        handleStatusChange(id, newStatus);
                    }
                }}
                flow={"OGX"}
            />
            </div>
        </div>
    );
};

export default ProjectDetails;
