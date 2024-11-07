// Import React and ApplicationCard component
import React, {useEffect, useState} from "react";
import ApplicationCard from "./../components/ApplicationCard.jsx";
import {fetchApplications} from "../api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser.jsx"; // Adjust the path as needed

const ApplicationsofOpportunitiesIManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const variables = {
                    page: 1,
                    perPage: 30,
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
            } catch (err) {
                setError("Failed to load applications.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                <div className="overflow-y-auto max-h-[calc(100vh-150px)] space-y-4">
                    {applications.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            fullName={app.person.full_name}
                            phoneNumber={app.person.contact_detail.phone}
                            opportunityTitle={app.opportunity.title}
                            status={app.status}
                            slot={app.slot.title}
                            home_mc={app.person.home_mc.name}
                            home_lc={app.person.home_lc.name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsofOpportunitiesIManage;
