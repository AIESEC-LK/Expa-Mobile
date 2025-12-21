import React, {useEffect, useState} from "react";
import OGXApplications from "./OGXApplications.jsx";
import {fetchManagerSearch} from "../api/fetchManagerSearch.jsx";
import {updatePersonMutation} from "../api/UpdatePerson.jsx";
import StatusDropdown from "./StatusDropdown.jsx";

const OGXApplicationCard = ({id, fullname, phoneNumber = "Not provided", email = "Not provided", isAiesecer, assignedManagers, cvUrl = "Not provided"}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managerResults, setManagerResults] = useState([]);


  useEffect(() => {
    const searchManagers = async () => {
      if (searchQuery.trim() === '') {
        setManagerResults([]);
        return;
      }
      setLoading(true);
      try {
        const results = await fetchManagerSearch(searchQuery);
        setManagerResults(results || []);  // Ensure we get an empty array if no results
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      searchManagers();
    }
  }, [searchQuery]);

  const handleManagerClick = async (managerId) => {
    // Update person with the selected manager's ID
    try {
      const managerIds = [...(assignedManagers.map(manager => manager.id) || []), managerId];
      const updatedPerson = await updatePersonMutation(id, managerIds);
      // Optionally, you can update the UI state here if needed
      //console.log('Manager updated successfully', updatedPerson);
      // You could also update the assignedManagers state with the new manager
    } catch (error) {
      console.error('Error updating manager:', error);
    }
  };

  const handleViewApplications = () => {
    setIsExpanded((prev) => !prev); // Toggle the state
  };

  return (
      <div className="flex flex-col max-w-full w-full mx-auto">
        <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[#037EF3]">{fullname}</h3>
            <a
                href={cvUrl}
                download={`EP_${id}_CV.pdf`}
                className="text-[#037EF3] text-xs flex items-center"
            >
              <i className="fas fa-download mr-2"></i> Download CV
            </a>

          </div>

          <p className="text-black font-semibold text-sm mb-1">EP ID: {id}</p>
          <p className="text-[#037EF3] text-xs mb-1">Email: {email}</p>
          <p className="text-[#037EF3] text-xs mb-2">Phone: {phoneNumber}</p>

          <div className="flex items-center gap-2 mt-4">
            <strong className="text-xs">AIESECer: </strong>
            <button className="bg-[#037EF3] text-white py-0.5 px-4 rounded-md text-xs">
              {isAiesecer ? "Yes" : "No"}
            </button>
          </div>

          {/* Displaying Assigned Managers */}
            <div className="flex justify-between items-center mt-1">
              {!showSearch && ( <div>
                <strong className="text-xs">Assigned Managers:</strong>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {assignedManagers && assignedManagers.length > 0 ? (
                      assignedManagers.map((manager, index) => (
                          <img
                              key={index}
                              src={manager.profile_photo}
                              alt={`Manager ${index}`}
                              className="w-8 h-8 rounded-full border-2 border-[#037EF3] object-cover"
                          />
                      ))
                  ) : (
                      <p>No managers assigned.</p>
                  )}
                </div>
              </div>
            )}
            {/* Add Manager Section */}
            <div className="mt-4">
              <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <span>+</span> Add Manager
              </button>
              {showSearch && (
                  <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Search for a manager..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {loading ? (
                        <div className="flex justify-center items-center mt-10">
                          <div className="spinner"></div>
                          {/* Show the spinner while loading */}
                        </div>
                    ) : (
                        <ul className="mt-2 text-sm text-gray-600">
                          {managerResults.length > 0 ? (
                              managerResults.map((manager) => (
                                  <li
                                      key={manager.id}
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                      onClick={() => handleManagerClick(manager.id)}
                                  >
                                    <span>{manager.full_name}</span>
                                  </li>
                              ))
                          ) : (
                              <p className="text-gray-500">No managers found</p>
                          )}
                        </ul>
                    )}
                  </div>
              )}
            </div>
          </div>

          {/* Wrapping the text and arrow in the same clickable div */}
          <div className="flex items-center gap-2 mt-3 cursor-pointer" onClick={handleViewApplications}>
          <span className="text-[#037EF3] text-xs">
            {isExpanded ? "View Less" : "View Applications"}
          </span>
            <i
                className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"} text-[#037EF3] text-lg`}
            ></i>
          </div>

          {/* This is the expanded content */}
          {isExpanded && <OGXApplications epID={id} />}
        </div>
      </div>
  );
};

export default OGXApplicationCard;
