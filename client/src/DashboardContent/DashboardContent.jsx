import './DashboardContent.css';
import DonutChartComponent from '../ChartComponents/DonutChartComponent/DonutChartComponent';
import RadialGaugeComponent from '../ChartComponents/RadialGaugeComponent/RadialGaugeComponent';
import BarChartComponent from '../ChartComponents/BarChartComponent/BarChartComponent';

function DashboardContent() {

    return (
        <div className="dashboard-content-wrapper">
            <div className="welcome-message">
                <h1>Hello, user!</h1>
            </div>
            <div className="dashboard-content-upper-section">
                <div id="dashboard-upper-firstcard" className="dashboard-upper-card">
                    <div className="dashboard-upper-card-header">
                        <h2>Titlu</h2>
                    </div>
                    <DonutChartComponent />
                </div>
                <div id="dashboard-upper-secondcard" className="dashboard-upper-card">
                    <div className="dashboard-upper-card-header">
                        <h2>Titlu</h2>
                    </div>
                    <BarChartComponent />
                </div>
                <div id="dashboard-upper-thirdcard" className="dashboard-upper-card">
                    <div className="dashboard-upper-card-header">
                        <h2>Titlu</h2>
                    </div>
                    <RadialGaugeComponent />
                </div>
            </div>
            <div className="dashboard-content-lower-section">
                <div id="dashboard-lower-firstcard" className="dashboard-lower-card"></div>
                <div id="dashboard-lower-secondcard" className="dashboard-lower-card"></div>
            </div>
        </div>
    );
}

export default DashboardContent;