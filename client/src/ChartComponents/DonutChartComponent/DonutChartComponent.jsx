import React, { useState, useEffect } from 'react';
import './DonutChartComponent.css';

function DonutChartComponent({ 
    data = [], 
    colors = ["var(--black-color)", "#4ECDC4", "#FF6B6B", "#FFD166", "#118AB2", "#06D6A0"],
    unit = "RON",
    size = "250px"
}) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsAnimated(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p>Nu există date.</p>;
    }

    const colorArray = Array.isArray(colors) && colors.length > 0 ? colors : ["var(--black-color)"];
    const total = data.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    const safeTotal = total === 0 ? 1 : total;

    // SVG Internal Coordinates
    const svgSize = 250; 
    const center = svgSize / 2;
    const strokeWidth = 35;
    const radius = 100;
    const hoverExpand = 12;
    const maskThickness = 120; 
    const circumference = 2 * Math.PI * radius;

    let cumulativeValue = 0;

    return (
        <div 
            className="donut-chart-container"
            style={{ width: size, height: size }} // You control the outer box
        >
            <svg 
                viewBox={`0 0 ${svgSize} ${svgSize}`} 
                className="donut-svg-wrapper"
                style={{ transform: 'rotate(-90deg)' }} 
            >
                <defs>
                    <mask id="sweep-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={svgSize} height={svgSize}>
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="white" 
                            strokeWidth={maskThickness} 
                            strokeDasharray={circumference}
                            strokeDashoffset={isAnimated ? 0 : circumference}
                            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                    </mask>
                </defs>

                <g mask="url(#sweep-mask)">
                    {data.map((item, index) => {
                        const isFocused = focusedIndex === index;
                        const isFaded = focusedIndex !== null && focusedIndex !== index;
                        
                        const sliceColor = colorArray[index % colorArray.length];
                        const numericValue = Number(item.value) || 0;
                        const percentage = numericValue / safeTotal;
                        const strokeLength = percentage * circumference;
                        const strokeDashoffset = - (cumulativeValue / safeTotal) * circumference;

                        cumulativeValue += numericValue;

                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={sliceColor}
                                strokeWidth={isFocused ? strokeWidth + hoverExpand : strokeWidth}
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={strokeDashoffset}
                                className={`donut-segment ${isFaded ? 'faded' : ''}`}
                                onMouseEnter={() => setFocusedIndex(index)}
                                onMouseLeave={() => setFocusedIndex(null)}
                            />
                        );
                    })}
                </g>

                <g 
                    className="donut-text-group" 
                    style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
                >
                    <text 
                        x={center} 
                        y={center - 8} 
                        textAnchor="middle" 
                        dominantBaseline="central"
                        className="donut-label-svg"
                    >
                        {focusedIndex !== null ? (data[focusedIndex]?.label || "N/A") : "Total"}
                    </text>
                    <text 
                        x={center} 
                        y={center + 15} 
                        textAnchor="middle" 
                        dominantBaseline="central"
                        className="donut-value-svg"
                    >
                        {focusedIndex !== null 
                            ? parseFloat(data[focusedIndex]?.value || 0).toFixed(2) 
                            : parseFloat(total).toFixed(2)} {unit}
                    </text>
                </g>
            </svg>
        </div>
    );
}

export default DonutChartComponent;