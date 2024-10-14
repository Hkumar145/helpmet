import React, { useState } from "react";

const AlertDetail = ({ alert, onSave, onCancel }) => {
    const [alertDetail, setAlertDetail] = useState(alert);

    const editDetail = (e) => {
    setAlertDetail({
        ...alertDetail,
        [e.target.name]: e.target.value,
    });
    };

    const saveChanges = (e) => {
        e.preventDefault();
        onSave(alertDetail);
    };

    return (
        <form onSubmit={saveChanges}>
            <h2>Edit Alert</h2>
            <input
            type="text"
            name="alertName"
            value={alertDetail.alertName}
            onChange={editDetail}
            required
            />
            <textarea
            name="description"
            value={alertDetail.description}
            onChange={editDetail}
            required
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default AlertDetail;
