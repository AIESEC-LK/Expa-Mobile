// import React, { useEffect, useState } from "react";
// import { fetchManagerSearch } from "../api/fetchManagerSearch.jsx";  // Import fetchManagerSearch from the same file
// import { updatePersonMutation } from "../api/UpdatePerson.jsx"; // Import updatePersonMutation from the same file
//
// const OGXApplicationCard = ({
//                                 id,
//                                 fullName,
//                                 home_mc,
//                                 home_lc,
//                                 phoneNumber,
//                                 opportunityTitle,
//                                 status,
//                                 assignedManagers, // Added managers prop
//                             }) => {
//
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [managerResults, setManagerResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         const searchManagers = async () => {
//             if (searchQuery.trim() === '') {
//                 setManagerResults([]);
//                 return;
//             }
//
//             setLoading(true);
//             try {
//                 const results = await fetchManagerSearch(searchQuery);
//                 setManagerResults(results || []);  // Ensure we get an empty array if no results
//             } catch (error) {
//                 console.error('Error fetching manager data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         if (searchQuery) {
//             searchManagers();
//         }
//     }, [searchQuery]);
//
//     const handleManagerClick = async (managerId) => {
//         // Update person with the selected manager's ID
//         try {
//             const managerIds = [...(assignedManagers.map(manager => manager.id) || []), managerId];
//
//             // Trigger the mutation
//             const updatedPerson = await updatePersonMutation(id, managerIds);
//
//             // Optionally, you can update the UI state here if needed
//             console.log('Manager updated successfully', updatedPerson);
//             // You could also update the assignedManagers state with the new manager
//         } catch (error) {
//             console.error('Error updating manager:', error);
//         }
//     };
//
//     return (
//         <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-md border">
//             <div className="flex justify-between items-center mb-2">
//                 <div>
//                     <h2 className="text-lg font-semibold text-blue-600">{fullName}</h2>
//                     <p className="text-sm text-gray-600">EP ID - {id} </p>
//                 </div>
//                 {/* <p className="text-sm text-gray-600">{status}</p> */}
//             </div>
//             {/* <p className="text-sm text-gray-500 italic mb-2">Opportunity - {opportunityTitle}</p> */}
//             <div className="flex items-center gap-2 mb-2">
//                 {phoneNumber ? (
//                     <a href={`tel:${phoneNumber}`} className="text-blue-600 text-sm">
//                         +{phoneNumber}
//                     </a>
//                 ) : (
//                     <span className="text-red-600 text-sm">No phone</span>
//                 )}
//             </div>
//
//             {/* Managers section */}
//             <div className="mt-4">
//                 {/* Assigned Managers Section */}
//                 <h3 className="text-sm font-semibold text-gray-700">Assigned Managers</h3>
//                 {assignedManagers && assignedManagers.length > 0 ? (
//                     <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
//                         {assignedManagers.map((manager, index) => (
//                             <li key={index} className="flex items-center gap-2">
//                                 <span>{manager.full_name}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-gray-500">No managers assigned</p>
//                 )}
//
//                 {/* Add Manager Section */}
//                 <div className="mt-4">
//                     <button
//                         onClick={() => setShowSearch(!showSearch)}
//                         className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 focus:outline-none"
//                     >
//                         <span>+</span> Add Manager
//                     </button>
//
//                     {showSearch && (
//                         <div className="mt-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for a manager..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             {loading ? (
//                                 <p className="text-gray-500 mt-2">Loading...</p>
//                             ) : (
//                                 <ul className="mt-2 text-sm text-gray-600">
//                                     {managerResults.length > 0 ? (
//                                         managerResults.map((manager) => (
//                                             <li
//                                                 key={manager.id}
//                                                 className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
//                                                 onClick={() => handleManagerClick(manager.id)}
//                                             >
//                                                 <span>{manager.full_name}</span>
//                                             </li>
//                                         ))
//                                     ) : (
//                                         <p className="text-gray-500">No managers found</p>
//                                     )}
//                                 </ul>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default OGXApplicationCard;
