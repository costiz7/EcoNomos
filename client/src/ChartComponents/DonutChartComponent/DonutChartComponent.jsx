import { useState, useEffect } from 'react';
import './DonutChartComponent.css';

function DonutChartComponent({ 
    data, 
    colors = ["var(--black-color)", "#4ECDC4", "#FF6B6B", "#FFD166", "#118AB2", "#06D6A0"],
    size = 320
}) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsAnimated(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    if (!data || data.length === 0) return <p>Nu există date.</p>;

    const colorArray = Array.isArray(colors) && colors.length > 0 ? colors : ["#000"];
    
    // PROTECȚIA 1: Ne asigurăm că adunăm numere, nu string-uri
    const total = data.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    
    // PROTECȚIA 2: Evităm împărțirea la zero dacă totalul e 0
    const safeTotal = total === 0 ? 1 : total;

    const baseSize = 320; 
    const scale = size / baseSize;

    const center = size / 2;
    const strokeWidth = 35 * scale;
    const radius = 100 * scale;
    const hoverExpand = 12 * scale;
    const maskThickness = 120 * scale; 
    const circumference = 2 * Math.PI * radius;

    let cumulativeValue = 0;

    return (
        <div 
            className="donut-chart-container" 
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <svg 
                width={size} 
                height={size} 
                viewBox={`0 0 ${size} ${size}`} 
                style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            >
                <defs>
                    <mask id="sweep-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size} height={size}>
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

                        // Folosim safeTotal pentru a nu crăpa la împărțire
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
            </svg>

            <div className="donut-center-info">
                {focusedIndex !== null ? (
                    <>
                        {/* PROTECȚIA 3: Am pus `?.` (Optional Chaining) în caz că indexul nu mai există */}
                        <span className="donut-label" style={{ fontSize: `${14 * scale}px` }}>
                            {data[focusedIndex]?.label || "N/A"}
                        </span>
                        <span className="donut-value" style={{ fontSize: `${28 * scale}px` }}>
                            {data[focusedIndex]?.value || 0}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="donut-label" style={{ fontSize: `${14 * scale}px` }}>
                            Total
                        </span>
                        <span className="donut-value" style={{ fontSize: `${28 * scale}px` }}>
                            {total}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export default DonutChartComponent;