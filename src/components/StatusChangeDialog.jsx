import React from "react";

const StatusChangeDialog = ({ statusChange, setStatusChange, setApplications }) => {
    const confirmStatusChange = () => {
        setApplications(prevApplications =>
            prevApplications.map(app =>
                app.id === statusChange.applicationId ? { ...app, status: statusChange.newStatus } : app
            )
        );
        closeDialog();
    };

    const closeDialog = () => setStatusChange({ applicationId: null, currentStatus: '', newStatus: '', showDialog: false });

    return (
        <div>
            <p>Are you sure you want to change the status?</p>
            <button onClick={confirmStatusChange}>Confirm</button>
            <button onClick={closeDialog}>Cancel</button>
        </div>
    );
};

export default StatusChangeDialog;
