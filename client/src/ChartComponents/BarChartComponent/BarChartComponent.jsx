import React, { useState, useEffect } from 'react';
import './BarChartComponent.css';

function BarChartComponent({ 
    data = [], 
    colors = ["var(--black-color)"], 
    width = "100%", // Changed to 100% to fill the parent container natively
    height = "250px", 
    gap = "20px",
    barThickness = "50px", // Added new prop for bar thickness
    unit = "RON" 
}) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [isAnimated, setIsAnimated] = useState(false);

    // 1. Initial animation trigger
    useEffect(() => {
        const timeout = setTimeout(() => setIsAnimated(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    // 2. Guard clause: Ensure we have valid data before heavy calculations
    if (!data || !Array.isArray(data) || data.length === 0) {
         return <p>Nu există date.</p>;
    }

    // 3. Mathematical calculations
    const maxValue = Math.max(...data.map(item => Number(item.value) || 0));
    // Fallback to prevent division by zero if all values are 0
    const safeMaxValue = maxValue === 0 ? 1 : maxValue; 
    
    // Ensure colors is an array
    const colorArray = Array.isArray(colors) && colors.length > 0 ? colors : ["var(--black-color)"];

    return (
        <div 
            className="bar-chart-container" 
            style={{ width, height, gap }} 
        >
            {data.map((item, index) => {
                const isFocused = focusedIndex === index;
                const isFaded = focusedIndex !== null && focusedIndex !== index;
                
                // Calculate dynamic height based on values
                const barHeightPercentage = (Number(item.value) || 0) / safeMaxValue * 100;
                const barColor = colorArray[index % colorArray.length];

                // Format for display
                const displayValue = parseFloat(item.value || 0).toFixed(2);

                return (
                    <div 
                        key={index} 
                        className={`bar-column ${isFaded ? 'faded' : ''}`}
                        onMouseEnter={() => setFocusedIndex(index)}
                        onMouseLeave={() => setFocusedIndex(null)}
                    >
                        <div className={`bar-tooltip ${isFocused ? 'visible' : ''}`}>
                            <span className="tooltip-value">{displayValue} {unit}</span>
                        </div>

                        <div className="bar-track">
                            <div 
                                className="bar-fill" 
                                style={{ 
                                    height: isAnimated ? `${barHeightPercentage}%` : '0%',
                                    backgroundColor: barColor,
                                    transitionDelay: `${index * 50}ms`,
                                    width: barThickness // Controlled dynamically by the prop
                                }}
                            ></div>
                        </div>

                        <div className="bar-label">{item.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default BarChartComponent;