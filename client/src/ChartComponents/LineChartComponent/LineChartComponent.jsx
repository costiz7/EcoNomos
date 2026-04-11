import { useState } from 'react';
import './LineChartComponent.css';

function LineChartComponent({ 
    data, 
    color = "var(--black-color)",
    width = "100%",
    height = "250px"
}) {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    if (!data || !Array.isArray(data) || data.length < 2) {
        return <p>Nu există suficiente date pentru un grafic.</p>;
    }

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
        return { ...item, x, y };
    });

    const linePath = "M " + points.map(p => `${p.x},${p.y}`).join(" L ");
    const fillPath = `${linePath} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

    return (
        <div className="line-chart-container" style={{ width: width, height: height }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="line-chart-svg">
                <defs>
                    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path d={fillPath} fill="url(#lineGradient)" className="line-fill-anim" />

                <path 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="line-stroke-anim" 
                />

                {points.map((p, i) => (
                    <g 
                        key={i} 
                        className="point-group" 
                        onMouseEnter={() => setHoveredPoint(i)} 
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        {hoveredPoint === i && (
                            <line 
                                x1={p.x} y1={paddingY} 
                                x2={p.x} y2={svgHeight - paddingY} 
                                stroke="#cbd5e1" 
                                strokeWidth="2" 
                                strokeDasharray="4 4" 
                            />
                        )}
                        
                        <circle 
                            cx={p.x} cy={p.y} 
                            r={hoveredPoint === i ? 7 : 4} 
                            fill={color} 
                            stroke="#fff" 
                            strokeWidth="2" 
                            className="line-point"
                        />

                        <text x={p.x} y={svgHeight - 10} textAnchor="middle" className="line-label">
                            {p.label || ""}
                        </text>

                        {hoveredPoint === i && (
                            <g className="line-tooltip">
                                <rect x={p.x - 30} y={p.y - 40} width="60" height="26" rx="6" fill="#101820" />
                                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                                    {p.value || 0}
                                </text>
                            </g>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
}

export default LineChartComponent;