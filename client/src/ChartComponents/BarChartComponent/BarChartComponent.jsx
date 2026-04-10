import { useState } from 'react';
import './BarChartComponent.css';

// Am schimbat 'color' în 'colors' și i-am dat un array default
function BarChartComponent({ data, colors = ["var(--black-color)"] }) {
    // Ținem minte ce coloană are mouse-ul deasupra ei
    const [focusedIndex, setFocusedIndex] = useState(null);

    // Găsim cea mai mare valoare din date ca să știm cât de înaltă e coloana de 100%
    const maxValue = Math.max(...data.map(item => item.value));

    // Dacă nu avem date, nu randăm nimic să nu crape
    if (!data || data.length === 0) return <p>Nu există date.</p>;

    // Ne asigurăm că variabila colors este mereu un array (în caz că pe viitor trimiți un string din greșeală)
    const colorArray = Array.isArray(colors) ? colors : [colors];

    return (
        <div className="bar-chart-container">
            {data.map((item, index) => {
                // Verificăm starea curentă a coloanei
                const isFocused = focusedIndex === index;
                const isFaded = focusedIndex !== null && focusedIndex !== index;
                
                // Calculăm înălțimea procentual
                const barHeightPercentage = (item.value / maxValue) * 100;

                // MAGIA AICI: Alegem culoarea din array. 
                // Dacă indexul depășește lungimea array-ului, o ia de la capăt!
                const barColor = colorArray[index % colorArray.length];

                return (
                    <div 
                        key={index} 
                        className={`bar-column ${isFaded ? 'faded' : ''}`}
                        onMouseEnter={() => setFocusedIndex(index)}
                        onMouseLeave={() => setFocusedIndex(null)}
                    >
                        {/* Tooltip-ul cu informații care apare deasupra */}
                        <div className={`bar-tooltip ${isFocused ? 'visible' : ''}`}>
                            <span className="tooltip-value">{item.value}</span>
                        </div>

                        {/* Coloana efectivă (bara) */}
                        <div className="bar-track">
                            <div 
                                className="bar-fill" 
                                style={{ 
                                    height: `${barHeightPercentage}%`,
                                    backgroundColor: barColor // Folosim culoarea extrasă
                                }}
                            ></div>
                        </div>

                        {/* Eticheta de jos */}
                        <div className="bar-label">{item.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default BarChartComponent;