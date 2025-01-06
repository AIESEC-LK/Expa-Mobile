import React, { useState } from "react";

const OGXApplicationCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const epData = {
    id: "5565703",
    name: "Amaya Amarasinghe",
    email: "p.cf1f5a...@aiesec.org",
    phone: "+94 72 274 5734",
    aiesecer: true,
    managers: ["B", "B"],
    applications: [
      {
        projectName: "Global Classroom - India",
        applicationId: "12579300",
        projectLC: "AISEC in USJ",
        opportunityId: "5746653",
        slotStartDate: "31st January 2025",
        slotEndDate: "2nd March 2025",
      },
      {
        projectName: "Rooted - Taiwan",
        applicationId: "12579300",
        projectLC: "AISEC in NUS",
        opportunityId: "38473932",
        slotStartDate: "31st January 2025",
        slotEndDate: "2nd March 2025",
      },
    ],
  };

  const handleViewApplications = () => {
    setIsExpanded(prev => !prev);  // Toggle the state
  };

  return (
    <div className="flex flex-col max-w-full w-full mx-auto">
      <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-[#037EF3]">{epData.name}</h3>
          <a href="#" className="text-[#037EF3] text-xs flex items-center">
            <i className="fas fa-download mr-2"></i> Download CV
          </a>
        </div>

        <p className="text-black font-semibold text-sm mb-1">EP ID: {epData.id}</p>
        <p className="text-[#037EF3] text-xs mb-1">Email: {epData.email}</p>
        <p className="text-[#037EF3] text-xs mb-2">Phone: {epData.phone}</p>

        <div className="flex items-center gap-2 mt-4">
          <strong className="text-xs">AIESECer: </strong>
          <button className="bg-[#037EF3] text-white py-0.5 px-4 rounded-md text-xs">
            {epData.aiesecer ? "Yes" : "No"}
          </button>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div>
            <strong className="text-xs">Assigned Managers:</strong>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {epData.managers.map((manager, index) => (
                <span
                  key={index}
                  className="bg-yellow-500 text-white font-bold py-1 px-4 rounded-full text-xs"
                >
                  {manager}
                </span>
              ))}
            </div>
          </div>

          <a href="#" className="text-[#037EF3] text-xs flex items-center mt-2">
            <i className="fas fa-plus mr-2"></i> Add Managers
          </a>
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
        {isExpanded && (
          <div className="pt-1 mt-3">
            {epData.applications.map((app, index) => (
              <div key={index} className="border-t border-gray-300 pt-2 mb-1">
                <div className="font-semibold text-[#037EF3] text-sm mb-1">{app.projectName}</div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold text-xs w-1/3 pr-4">Application ID:</span>
                  <span className="text-black text-xs w-2/3">{app.applicationId}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold text-xs w-1/3 pr-4">Project LC:</span>
                  <span className="text-black text-xs w-2/3">{app.projectLC}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold text-xs w-1/3 pr-4">Opportunity ID:</span>
                  <span className="text-black text-xs w-2/3">{app.opportunityId}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold text-xs w-1/3 pr-4">Slot Start Date:</span>
                  <span className="text-black text-xs w-2/3">{app.slotStartDate}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold text-xs w-1/3 pr-4">Slot End Date:</span>
                  <span className="text-black text-xs w-2/3">{app.slotEndDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OGXApplicationCard;
