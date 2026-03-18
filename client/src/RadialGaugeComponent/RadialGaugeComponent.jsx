import React, { useMemo, useState, useEffect } from 'react';

const RadialGaugeComponent = ({ percentage = 70, totalTicks = 65 }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Păstrăm dimensiunile interne originale pentru calcule
  const INTERNAL_WIDTH = 350;
  const INTERNAL_HEIGHT = 250; 
  const center = { x: INTERNAL_WIDTH / 2, y: 220 }; 
  const outerR = 150;
  const innerR = 125;
  const startAngleDegrees = -180; 
  const endAngleDegrees = 0;
  const ARC_TOTAL_DEGREES = Math.abs(endAngleDegrees - startAngleDegrees); 
  const degreesPerTick = ARC_TOTAL_DEGREES / (totalTicks - 1);
  const toRadians = (deg) => deg * (Math.PI / 180);

  useEffect(() => {
    let animationFrameId;
    const startValue = displayPercentage;
    const endValue = percentage;
    
    if (startValue === endValue) return;

    let startTime = null;
    const duration = 600;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setDisplayPercentage(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
    
  }, [percentage]);

  const ticks = useMemo(() => {
    const activeTicksCount = Math.round((displayPercentage / 100) * totalTicks);
    const calculatedTicks = [];
    
    for (let i = 0; i < totalTicks; i++) {
      const currentAngleDegrees = startAngleDegrees + i * degreesPerTick;
      const angleRad = toRadians(currentAngleDegrees);
      
      const x1 = center.x + innerR * Math.cos(angleRad);
      const y1 = center.y + innerR * Math.sin(angleRad);
      const x2 = center.x + outerR * Math.cos(angleRad);
      const y2 = center.y + outerR * Math.sin(angleRad);
      
      const isActive = i < activeTicksCount;
      const color = isActive ? "rgb(0, 0, 0)" : "#d2d2d2"; 

      calculatedTicks.push({
        id: i,
        coords: { x1, y1, x2, y2 },
        color
      });
    }
    return calculatedTicks;
  }, [displayPercentage, totalTicks, degreesPerTick, center.x, center.y, innerR, outerR, startAngleDegrees]);

  if (ticks.length === 0) return null;

  const firstTick = ticks[0].coords;
  const lastTick = ticks[ticks.length - 1].coords;

  // --- CALCULUL PENTRU TRIM ---
  // Definim o fereastră strânsă în jurul elementelor desenate
  // Am adăugat un mic padding (10, 15) ca să nu tăiem marginile liniilor rotunjite
  const trimParams = {
    x: 15,    // min-x (Left - padding)
    y: 60,    // min-y (Top - padding)
    width: 320,  // Latimea totală decupată
    height: 190  // Inaltimea totală decupată
  };

  return (
    // Containerul Responsive
    <div className="gauge-frame" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg 
        // AICI ESTE MODIFICAREA: Am aplicat noul viewBox calculat pentru 'trim'
        viewBox={`${trimParams.x} ${trimParams.y} ${trimParams.width} ${trimParams.height}`} 
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      >
        {ticks.map((tick) => (
          <line
            key={tick.id}
            x1={tick.coords.x1}
            y1={tick.coords.y1}
            x2={tick.coords.x2}
            y2={tick.coords.y2}
            stroke={tick.color}
            strokeWidth="4"
            strokeLinecap="round" 
            style={{ transition: 'stroke 0.1s ease' }} 
          />
        ))}
        
        <text 
          x={center.x} 
          y={center.y - 40}
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="3rem" 
          fontWeight="700" 
          fill="#333"
          style={{ fontFamily: 'sans-serif' }}
        >
          {Math.round(displayPercentage)}%
        </text>
        
        <text 
          x={firstTick.x2 + 13} 
          y={firstTick.y2 + 20} 
          textAnchor="middle" 
          fontSize="14px" 
          fill="#a0aab0"
          style={{ fontFamily: 'sans-serif' }}
        >
          0
        </text>

        <text 
          x={lastTick.x2 - 13} 
          y={lastTick.y2 + 20} 
          textAnchor="middle" 
          fontSize="14px" 
          fill="#a0aab0"
          style={{ fontFamily: 'sans-serif' }}
        >
          100
        </text>
      </svg>
    </div>
  );
};

export default RadialGaugeComponent;