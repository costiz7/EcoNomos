import { useState } from 'react';
import './LineChartComponent.css';

function LineChartComponent({ 
    data = [], 
    color = "var(--black-color)",
    width = "100%", // Restored your control
    height = "250px", // Restored your control
    unit = "RON" // Reusability
}) {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Guard clause: Line charts need at least 2 points to draw a path
    if (!data || !Array.isArray(data) || data.length < 2) {
        return <p>Nu există suficiente date pentru un grafic.</p>;
    }

    // SVG Internal Coordinates
    const svgWidth = 800;
    const svgHeight = 250;
    const paddingX = 40; 
    const paddingY = 40; 

    const drawWidth = svgWidth - paddingX * 2;
    const drawHeight = svgHeight - paddingY * 2;
    const maxValue = Math.max(...data.map(d => Number(d.value) || 0)) || 1; 

    const points = data.map((item, index) => {
        const x = paddingX + (index / (data.length - 1)) * drawWidth;
        const numericValue = Number(item.value) || 0;
        const y = (svgHeight - paddingY) - (numericValue / maxValue) * drawHeight;
        return { ...item, x, y, numericValue };
    });

    const linePath = "M " + points.map(p => `${p.x},${p.y}`).join(" L ");
    const fillPath = `${linePath} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

    return (
        <div 
            className="line-chart-container" 
            style={{ width: width, height: height }} // Outer control
        >
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="line-chart-svg">
                <defs>
                    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path 
                    d={fillPath} 
                    fill="url(#lineGradient)" 
                    className="line-fill-anim" 
                />

                <path 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    className="line-stroke-anim" 
                />

                {points.map((p, i) => {
                    const isHovered = hoveredPoint === i;
                    const displayValue = parseFloat(p.numericValue).toFixed(2);

                    return (
                        <g 
                            key={i} 
                            className="point-group" 
                            onMouseEnter={() => setHoveredPoint(i)} 
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            {isHovered && (
                                <line 
                                    x1={p.x} y1={paddingY} 
                                    x2={p.x} y2={svgHeight - paddingY} 
                                    className="hover-guideline"
                                />
                            )}
                            
                            <circle 
                                cx={p.x} cy={p.y} 
                                r={isHovered ? 7 : 4} 
                                fill={color} 
                                className="line-point"
                            />

                            <text 
                                x={p.x} 
                                y={svgHeight - 10} 
                                className="line-label"
                            >
                                {p.label || ""}
                            </text>

                            {isHovered && (
                                <g className="line-tooltip">
                                    <rect 
                                        x={p.x - 50} 
                                        y={p.y - 45} 
                                        width="100" 
                                        height="28" 
                                        rx="6" 
                                        className="tooltip-bg" 
                                    />
                                    <text 
                                        x={p.x} 
                                        y={p.y - 25} 
                                        className="tooltip-text"
                                    >
                                        {displayValue} {unit}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default LineChartComponent;