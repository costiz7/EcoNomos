import React, { useState, useEffect } from 'react';
import './ProgressBarComponent.css';

function ProgressBarComponent({ 
    currentValue, 
    maxValue, 
    color = "var(--red-color)", 
    width = "100%",
    height = "12px",
    showLabels = true,
    labelUnit = "RON" 
}) {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const safeCurrentValue = Number(currentValue) || 0;
    const safeMaxValue = Number(maxValue) || 1; 
    const percentage = Math.min(100, Math.max(0, (safeCurrentValue / safeMaxValue) * 100));

    useEffect(() => {
        const timeout = setTimeout(() => setAnimatedWidth(percentage), 50);
        return () => clearTimeout(timeout);
    }, [percentage]);

    return (
        <div className="progress-bar-container" style={{ width: width }}>
            {showLabels && (
                <div className="progress-labels">
                    <span className="progress-current">
                        {safeCurrentValue} {labelUnit}
                    </span>
                    <span className="progress-max">
                        {safeMaxValue === 1 && maxValue !== 1 ? 0 : safeMaxValue} {labelUnit}
                    </span>
                </div>
            )}

            <div className="progress-track" style={{ height: height }}>
                <div 
                    className="progress-fill" 
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