import React, {useEffect, useState} from "react";
import OGXApplicationCard from "../components/OGXApplicationCard.jsx";

const OGXPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
            const AUTH_TOKEN = localStorage.getItem("aiesec_token");

            const query = `
                
query MyPeopleIndexQuery($managers: Boolean!) {
    myPeople {
        data {
            id
            full_name    
            contact_detail {
                phone
                email
                country_code
            } 
            managers @include(if: $managers) {
                full_name
                profile_photo
                email
            }
            is_aiesecer
            cv_url
        }
    }
}
                                                                                              
            `;

            try {
                const response = await fetch(GRAPHQL_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": AUTH_TOKEN,
                    },
                    body: JSON.stringify({query, variables: {managers: true}}),
                });

                const result = await response.json();
                if (result?.data?.myPeople?.data) {
                    setApplications(result.data.myPeople.data);
                } else {
                    throw new Error("No data found");
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center mt-10" style={{height: 'calc(100vh - 350px)'}}>
            <div className="spinner"></div>
        </div>
    );
    if (error) {
        return (
            <div className="error-container">
                <img src="/Error.jpg" alt="Error Image" className="error-image"/>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-wrap gap-6">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        //console.log(app.contact_detail?.email),
                            <OGXApplicationCard
                                id={app.id}
                                fullname={app.full_name}
                                phoneNumber={app.contact_detail?.phone === null ? "Not provided" : `${app.contact_detail?.country_code} ${app.contact_detail?.phone}`}
                            email={app.contact_detail?.email === null ? "Not provided" : app.contact_detail?.email}
                            isAiesecer={app.is_aiesecer}
                            assignedManagers={app.managers}
                            cvUrl={app.cv_url === null ? "Not provided" : app.cv_url}
                        />
                    ))
                ) : (
                    <p>No applications found.</p>
                )}
            </div>
        </div>
    );
};

export default OGXPage;
