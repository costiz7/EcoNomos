import React, { useState, useEffect } from 'react';
import './ProgressBarComponent.css';

function ProgressBarComponent({ 
    currentValue = 0, 
    maxValue = 0, 
    color = "var(--red-color)", 
    width = "100%", // Container control
    height = "12px", // Track height control
    showLabels = true,
    unit = "RON" // Standardized prop name
}) {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    // 1. Convert props to numbers safely
    const numericCurrent = Number(currentValue) || 0;
    const numericMax = Number(maxValue) || 0;

    // 2. Prevent division by zero for the percentage math
    const safeMaxForMath = numericMax === 0 ? 1 : numericMax; 
    const percentage = Math.min(100, Math.max(0, (numericCurrent / safeMaxForMath) * 100));

    // 3. Format values for clean UI display
    const displayCurrent = parseFloat(numericCurrent).toFixed(2);
    const displayMax = parseFloat(numericMax).toFixed(2);

    // 4. Trigger animation on mount or value change
    useEffect(() => {
        const timeout = setTimeout(() => setAnimatedWidth(percentage), 50);
        return () => clearTimeout(timeout);
    }, [percentage]);

    return (
        <div 
            className="progress-bar-container" 
            style={{ width: width }} // Outer control
        >
            {showLabels && (
                <div className="progress-labels">
                    <span className="progress-current">
                        {displayCurrent} {unit}
                    </span>
                    <span className="progress-max">
                        {displayMax} {unit}
                    </span>
                </div>
            )}

            <div className="progress-track" style={{ height: height }}>
                <div 
                    className="progress-fill" 
                    // Dynamic styling based on props and state
                    style={{ 
                        width: `${animatedWidth}%`, 
                        backgroundColor: color 
                    }}
                ></div>
            </div>
        </div>
    );
}

export default ProgressBarComponent;