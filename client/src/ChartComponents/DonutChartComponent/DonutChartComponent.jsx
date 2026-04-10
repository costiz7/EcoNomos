import { useState } from 'react';
import './DonutChartComponent.css';

function DonutChartComponent({ data, colors = ["var(--black-color)", "#4ECDC4", "#FF6B6B", "#FFD166", "#118AB2", "#06D6A0"] }) {
    const [focusedIndex, setFocusedIndex] = useState(null);

    // Protecție
    if (!data || data.length === 0) return <p>Nu există date.</p>;

    // Asigurăm formatul de array pentru culori
    const colorArray = Array.isArray(colors) ? colors : [colors];

    // Calculăm suma totală a valorilor
    const total = data.reduce((acc, item) => acc + item.value, 0);

    // Dimensiunile și matematica SVG-ului
    const size = 250;               // Mărimea cutiei SVG
    const center = size / 2;        // Centrul e la 125, 125
    const strokeWidth = 35;         // Cât de "grasă" e felia
    const radius = center - strokeWidth; // Raza cercului
    const circumference = 2 * Math.PI * radius;

    // Variabilă care ține minte unde s-a terminat felia anterioară pentru a o începe pe următoarea
    let cumulativeValue = 0;

    return (
        <div className="donut-chart-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Rotim tot grupul la -90 de grade ca prima felie să înceapă fix de la "ora 12" */}
                <g transform={`rotate(-90 ${center} ${center})`}>
                    {data.map((item, index) => {
                        const isFocused = focusedIndex === index;
                        const isFaded = focusedIndex !== null && focusedIndex !== index;
                        
                        // ALGORITMUL DE CULORI (același de la BarChart)
                        const sliceColor = colorArray[index % colorArray.length];

                        // Cât la sută din cerc reprezintă această felie
                        const percentage = item.value / total;
                        const strokeLength = percentage * circumference;
                        
                        // De unde începe desenarea feliei (o împingem înapoi pe contur)
                        const strokeDashoffset = - (cumulativeValue / total) * circumference;

                        cumulativeValue += item.value;

                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={sliceColor}
                                /* La hover, felia se face puțin mai groasă */
                                strokeWidth={isFocused ? strokeWidth + 8 : strokeWidth}
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={strokeDashoffset}
                                className={`donut-segment ${isFaded ? 'faded' : ''}`}
                                onMouseEnter={() => setFocusedIndex(index)}
                                onMouseLeave={() => setFocusedIndex(null)}
                            />
                        );
                    })}
                </g>
            </svg>

            {/* TEXTUL DIN CENTRU (Total sau informația feliei selectate) */}
            <div className="donut-center-info">
                {focusedIndex !== null ? (
                    <>
                        <span className="donut-label">{data[focusedIndex].label}</span>
                        <span className="donut-value">{data[focusedIndex].value}</span>
                    </>
                ) : (
                    <>
                        <span className="donut-label">Total</span>
                        <span className="donut-value">{total}</span>
                    </>
                )}
            </div>
        </div>
    );
}

export default DonutChartComponent;