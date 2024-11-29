// import React, { useState, useEffect } from "react";
// import OGXApplicationCard from "../components/OGXApplicationCard.jsx";
//
// const OGXPage = () => {
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchApplications = async () => {
//             const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
//             const AUTH_TOKEN = import.meta.env.VITE_TOKEN;
//
//             const query = `
//                 query MyPeopleIndexQuery($managers: Boolean!) {
//                     myPeople {
//                         data {
//                             id
//                             full_name
//                             home_mc {
//                                 name
//                             }
//                             home_lc {
//                                 name
//                             }
//                             contact_detail {
//                                 phone
//                             }
//                             managed_opportunities {
//                                 edges {
//                                     node {
//                                         title
//                                     }
//                                 }
//                             }
//                             status
//                             managers @include(if: $managers) {
//                                 full_name
//                                 profile_photo
//                                 id
//                                 email
//                             }
//                         }
//                     }
//                 }
//             `;
//
//             try {
//                 const response = await fetch(GRAPHQL_API_URL, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": AUTH_TOKEN,
//                     },
//                     body: JSON.stringify({ query, variables: { managers: true } }),
//                 });
//
//                 const result = await response.json();
//                 if (result?.data?.myPeople?.data) {
//                     setApplications(result.data.myPeople.data);
//                 } else {
//                     throw new Error("No data found");
//                 }
//             } catch (err) {
//                 console.error("Error fetching applications:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchApplications();
//     }, []);
//
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;
//
//     return (
//         <div className="container mx-auto p-6">
//             <div className="flex flex-wrap gap-6">
//                 {applications.length > 0 ? (
//                     applications.map((app) => (
//                         <OGXApplicationCard
//                             key={app.id}
//                             id={app.id}
//                             fullName={app.full_name}
//                             home_mc={app.home_mc?.name}
//                             home_lc={app.home_lc?.name}
//                             phoneNumber={app.contact_detail?.phone}
//                             opportunityTitle={
//                                 app.managed_opportunities?.edges?.[0]?.node?.title || "No Opportunity"
//                             }
//                             status={app.status || "Unknown"}
//                             assignedManagers={app.managers} // Pass managers here
//                         />
//                     ))
//                 ) : (
//                     <p>No applications found.</p>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default OGXPage;
