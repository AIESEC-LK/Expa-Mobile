import React, { useEffect, useState } from 'react';
import ProjectDetails from './ProjectDetails';
import { fetchPersonApplicationsFromEPid } from "../api/GetApplicationFromEPid.jsx";

const OGXApplications = ({ epID }) => {
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleProjectClick = (projectId) => {
        setExpandedProjectId((prevId) => (prevId === projectId ? null : projectId));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                //console.log('Fetching applications for EP ID:', epID);
                const results = await fetchPersonApplicationsFromEPid(epID);  // Fetch manager data
                //console.log('Results:', results);
                setApplications(results || []);  // Ensure we get an empty array if no results
            } catch (error) {
                console.error('Error fetching manager data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [epID]);

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="spinner"></div>  {/* Show the spinner while loading */}
            </div>
        );
    }

    return (
        <div className="pt-1 mt-3">
            {applications.map((app, index) => (
                <div key={index} className="border-t border-gray-300 pt-2 mb-1">
                    <div
                        className="font-semibold text-[#037EF3] text-sm mb-1 cursor-pointer"
                        onClick={() => handleProjectClick(app.id)} // Handle click to expand/collapse project
                    >
                        {app.opportunity.title + ' - ' + app.opportunity.home_mc.country}
                    </div>

                    {/* Render the ProjectDetails component when the project is expanded */}
                    {expandedProjectId === app.id && (
                        <ProjectDetails appID={app.id} opportunityId={app.opportunity.id} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default OGXApplications;
