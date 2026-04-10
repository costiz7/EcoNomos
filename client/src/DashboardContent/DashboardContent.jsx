import BarChartComponent from "../ChartComponents/BarChartComponent/BarChartComponent";
import LineChartComponent from "../ChartComponents/LineChartComponent/LineChartComponent";
import RadialGaugeComponent from "../ChartComponents/RadialGaugeComponent/RadialGaugeComponent";
import DonutChartComponent from "../ChartComponents/DonutChartComponent/DonutChartComponent";
import ProgressBarComponent from "../ChartComponents/ProgressBarComponent/ProgressBarComponent";

const cheltuieliSaptamana = [
    { label: 'Luni', value: 120 },
    { label: 'Mar', value: 45 },
    { label: 'Mie', value: 80 },
    { label: 'Joi', value: 310 },
    { label: 'Vin', value: 90 },
    { label: 'Sam', value: 200 },
    { label: 'Dum', value: 15 }
];

const evolutieSaseLuni = [
    { label: 'Ian', value: 1200 },
    { label: 'Feb', value: 1900 },
    { label: 'Mar', value: 1500 },
    { label: 'Apr', value: 2400 },
    { label: 'Mai', value: 2100 },
    { label: 'Iun', value: 3000 }
];

const categoriiCheltuieli = [
    { label: 'Supermarket', value: 850 },
    { label: 'Utilități', value: 420 },
    { label: 'Divertisment', value: 300 },
    { label: 'Mașină', value: 250 },
    { label: 'Diverse', value: 100 }
];

function DashboardContent() {
    return (
        <div className="card">
            <h3>Cheltuieli zilele trecute</h3>
            {/* O singură linie și ai un grafic animat și scalabil! */}
            <BarChartComponent data={cheltuieliSaptamana} /> 
            <LineChartComponent data={evolutieSaseLuni} color="var(--dark-red-color)" />
            <DonutChartComponent data={categoriiCheltuieli} />
            <ProgressBarComponent 
                currentValue={2500} 
                maxValue={5000} 
                color="#4ECDC4" 
                height="16px" 
            />
            <RadialGaugeComponent targetPercentage={65} totalSegments={50}/>
        </div>
    );
}

export default DashboardContent;