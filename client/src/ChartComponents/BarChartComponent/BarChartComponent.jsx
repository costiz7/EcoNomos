import { useState, useEffect } from 'react';
import './BarChartComponent.css';

function BarChartComponent({ data, colors = ["var(--black-color)"], width="100px", height="250px" }) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimated(true);
        }, 50);
        
        return () => clearTimeout(timeout);
    }, []);

    const maxValue = Math.max(...data.map(item => item.value));
    if (!data || data.length === 0) {
         return <p>Nu există date.</p>;
    }
    const colorArray = Array.isArray(colors) ? colors : [colors];

    return (
        <div className="bar-chart-container" style={{ width, height }}>
            {data.map((item, index) => {
                const isFocused = focusedIndex === index;
                const isFaded = focusedIndex !== null && focusedIndex !== index;
                const barHeightPercentage = (item.value / maxValue) * 100;
                const barColor = colorArray[index % colorArray.length];

                return (
                    <div 
                        key={index} 
                        className={`bar-column ${isFaded ? 'faded' : ''}`}
                        onMouseEnter={() => setFocusedIndex(index)}
                        onMouseLeave={() => setFocusedIndex(null)}
                    >
                        <div className={`bar-tooltip ${isFocused ? 'visible' : ''}`}>
                            <span className="tooltip-value">{item.value}</span>
                        </div>

                        <div className="bar-track">
                            <div 
                                className="bar-fill" 
                                style={{ 
                                    height: isAnimated ? `${barHeightPercentage}%` : '0%',
                                    backgroundColor: barColor,
                                    transitionDelay: `${index * 50}ms`
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