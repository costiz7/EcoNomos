import React, { useState, useEffect } from 'react';
import './ProgressBarComponent.css';

function ProgressBarComponent({ 
    currentValue, 
    maxValue, 
    color = "var(--black-color)", 
    height = "12px", 
    showLabels = true,
    labelUnit = "RON" // Poți pune % sau EUR dacă ai nevoie
}) {
    // Folosim un state pentru lățime ca să declanșăm animația la încărcare
    const [width, setWidth] = useState(0);

    // Calculăm procentul (îl ținem între 0 și 100 ca să nu iasă bara din container)
    const percentage = Math.min(100, Math.max(0, (currentValue / maxValue) * 100));

    // Când componenta se randează, îi dăm lățimea reală ca să se animeze de la 0 la X%
    useEffect(() => {
        // Un mic delay (50ms) face ca animația să fie mult mai vizibilă la intrarea în pagină
        const timeout = setTimeout(() => setWidth(percentage), 50);
        return () => clearTimeout(timeout);
    }, [percentage]);

    return (
        <div className="progress-bar-container">
            {/* Afișăm valorile deasupra barei dacă showLabels este true */}
            {showLabels && (
                <div className="progress-labels">
                    <span className="progress-current">
                        {currentValue} {labelUnit}
                    </span>
                    <span className="progress-max">
                        {maxValue} {labelUnit}
                    </span>
                </div>
            )}

            {/* Containerul gri al barei (Traseul) */}
            <div className="progress-track" style={{ height: height }}>
                {/* Partea colorată care se umple */}
                <div 
                    className="progress-fill" 
                    style={{ 
                        width: `${width}%`, 
                        backgroundColor: color 
                    }}
                ></div>
            </div>
        </div>
    );
}

export default ProgressBarComponent;