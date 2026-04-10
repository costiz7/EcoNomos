import { useState } from 'react';
import './LineChartComponent.css';

function LineChartComponent({ data, color = "var(--black-color)" }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Protecție: dacă nu sunt date, nu randăm SVG-ul
    if (!data || data.length < 2) return <p>Nu există suficiente date pentru un grafic.</p>;

    // Dimensiunile virtuale ale canvas-ului SVG (el se va auto-scala pe ecran)
    const svgWidth = 800;
    const svgHeight = 250;
    const paddingX = 40; // Spațiu stânga-dreapta
    const paddingY = 40; // Spațiu sus-jos

    const drawWidth = svgWidth - paddingX * 2;
    const drawHeight = svgHeight - paddingY * 2;

    // Găsim cea mai mare valoare pentru a scala graficul pe verticală
    const maxValue = Math.max(...data.map(d => d.value)) || 1; 

    // Calculăm coordonatele (X, Y) exacte pe canvas pentru fiecare dată
    const points = data.map((item, index) => {
        const x = paddingX + (index / (data.length - 1)) * drawWidth;
        // SVG-urile au coordonata Y=0 sus de tot, deci trebuie să o inversăm
        const y = (svgHeight - paddingY) - (item.value / maxValue) * drawHeight;
        return { ...item, x, y };
    });

    // Construim „traseul” liniei conectând punctele: M (Move to) ... L (Line to) ...
    const linePath = "M " + points.map(p => `${p.x},${p.y}`).join(" L ");

    // Construim zona pentru fundalul transparent de sub linie
    const fillPath = `${linePath} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

    return (
        <div className="line-chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="line-chart-svg">
                {/* Definim gradientul frumos de sub linie */}
                <defs>
                    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Zona colorată de sub linie */}
                <path d={fillPath} fill="url(#lineGradient)" className="line-fill-anim" />

                {/* Linia graficului efectivă */}
                <path 
                    d={linePath} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="line-stroke-anim" 
                />

                {/* Rândăm punctele și Tooltip-urile pentru hover */}
                {points.map((p, i) => (
                    <g 
                        key={i} 
                        className="point-group" 
                        onMouseEnter={() => setHoveredPoint(i)} 
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        {/* Linia verticală punctată care te ajută să citești graficul (Apare la hover) */}
                        {hoveredPoint === i && (
                            <line 
                                x1={p.x} y1={paddingY} 
                                x2={p.x} y2={svgHeight - paddingY} 
                                stroke="#cbd5e1" 
                                strokeWidth="2" 
                                strokeDasharray="4 4" 
                            />
                        )}
                        
                        {/* Cercul punctului (se face mai mare când pui mouse-ul pe el) */}
                        <circle 
                            cx={p.x} cy={p.y} 
                            r={hoveredPoint === i ? 7 : 4} 
                            fill={color} 
                            stroke="#fff" 
                            strokeWidth="2" 
                            className="line-point"
                        />

                        {/* Eticheta text de jos (Ex: Ian, Feb) */}
                        <text x={p.x} y={svgHeight - 10} textAnchor="middle" className="line-label">
                            {p.label}
                        </text>

                        {/* Tooltip-ul plutitor cu valoarea (Apare la hover) */}
                        {hoveredPoint === i && (
                            <g className="line-tooltip">
                                <rect x={p.x - 30} y={p.y - 40} width="60" height="26" rx="6" fill="#101820" />
                                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                                    {p.value}
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