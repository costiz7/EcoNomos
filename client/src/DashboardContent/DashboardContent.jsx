import './DashboardContent.css';

function DashboardContent() {
    return (
        <div className="dashboard-content-wrapper">
            <div className="welcome-message">
                <h1>Hello, user!</h1>
            </div>
            <div className="dashboard-content-upper-section">
                <div id="dashboard-upper-firstcard" className="dashboard-upper-card"></div>
                <div id="dashboard-upper-secondcard" className="dashboard-upper-card"></div>
                <div id="dashboard-upper-thirdcard" className="dashboard-upper-card"></div>
            </div>
            <div className="dashboard-content-lower-section">
                <div id="dashboard-lower-firstcard" className="dashboard-lower-card"></div>
                <div id="dashboard-lower-secondcard" className="dashboard-lower-card"></div>
            </div>
        </div>
    );
}

export default DashboardContent;