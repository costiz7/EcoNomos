import { useMemo, useState, useEffect } from 'react';
import './RadialGaugeComponent.css';

const RadialGaugeComponent = ({ 
  targetPercentage = 0, 
  totalSegments = 60,
  color = "var(--black-color)", // Adăugat: Culoarea dinamică pentru bara activă
  inactiveColor = "#e2e8f0"     // Adăugat: Un gri fin pentru liniuțele inactive (tipic Tailwind/modern UI)
}) => {
  const [currentAnimatedPercentage, setCurrentAnimatedPercentage] = useState(0);

  // --- 1. GEOMETRIC CONFIGURATION ---
  const centerCoordinateX = 175;
  const centerCoordinateY = 175; 
  const outerRadius = 150;
  const innerRadius = 125;
  
  const startingAngleInDegrees = -180; 
  const endingAngleInDegrees = 0;
  
  const totalAngleSpanInDegrees = Math.abs(endingAngleInDegrees - startingAngleInDegrees); 
  const degreesPerSegment = totalAngleSpanInDegrees / (totalSegments - 1);
  
  const convertDegreesToRadians = (angleInDegrees) => {
    return angleInDegrees * (Math.PI / 180);
  };

  // --- 2. ANIMATION ENGINE ---
  useEffect(() => {
    if (currentAnimatedPercentage === targetPercentage) return;

    let animationFrameIdentifier;
    let animationStartTime = null;
    const animationDurationInMilliseconds = 600;
    const startingPercentageValue = currentAnimatedPercentage;

    const executeAnimationStep = (currentTimestamp) => {
      if (!animationStartTime) {
        animationStartTime = currentTimestamp;
      }
      
      const rawAnimationProgress = Math.min((currentTimestamp - animationStartTime) / animationDurationInMilliseconds, 1);
      const smoothedAnimationProgress = 1 - Math.pow(1 - rawAnimationProgress, 3);
      const newlyCalculatedPercentage = startingPercentageValue + (targetPercentage - startingPercentageValue) * smoothedAnimationProgress;
      
      setCurrentAnimatedPercentage(newlyCalculatedPercentage);

      if (rawAnimationProgress < 1) {
        animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
      }
    };

    animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
    return () => cancelAnimationFrame(animationFrameIdentifier);
    
  }, [targetPercentage]); 

  // --- 3. SEGMENTS (TICKS) CALCULATION ---
  const lineSegments = useMemo(() => {
    const activeSegmentsCount = Math.round((currentAnimatedPercentage / 100) * totalSegments);
    const calculatedSegmentsArray = [];
    
    for (let segmentIndex = 0; segmentIndex < totalSegments; segmentIndex++) {
      const currentAngleInDegrees = startingAngleInDegrees + segmentIndex * degreesPerSegment;
      const currentAngleInRadians = convertDegreesToRadians(currentAngleInDegrees);
      
      const isSegmentActive = segmentIndex < activeSegmentsCount;

      calculatedSegmentsArray.push({
        identifier: segmentIndex,
        startX: centerCoordinateX + innerRadius * Math.cos(currentAngleInRadians),
        startY: centerCoordinateY + innerRadius * Math.sin(currentAngleInRadians),
        endX: centerCoordinateX + outerRadius * Math.cos(currentAngleInRadians),
        endY: centerCoordinateY + outerRadius * Math.sin(currentAngleInRadians),
        // MODIFICAT: Folosim culorile primite din props în loc de RGB hardcodat
        segmentColor: isSegmentActive ? color : inactiveColor 
      });
    }
    return calculatedSegmentsArray;
  }, [currentAnimatedPercentage, totalSegments, degreesPerSegment, color, inactiveColor]);

  if (lineSegments.length === 0) return null;

  const firstSegment = lineSegments[0];
  const lastSegment = lineSegments[lineSegments.length - 1];

  // --- 4. AUTO-ADAPTIVE CROPPING ---
  const viewBoxPadding = 15; 
  const bottomTextSpacing = 30; 

  const viewBoxCoordinateX = centerCoordinateX - outerRadius - viewBoxPadding;
  const viewBoxCoordinateY = centerCoordinateY - outerRadius - viewBoxPadding;
  const viewBoxTotalWidth = (outerRadius * 2) + (viewBoxPadding * 2);
  const viewBoxTotalHeight = outerRadius + viewBoxPadding + bottomTextSpacing;

  return (
    <div 
      className="gauge-frame"
      // ACCESIBILITATE: Adăugăm rolul de grafic/meter pentru cititoarele de ecran
      role="meter" 
      aria-valuenow={Math.round(currentAnimatedPercentage)} 
      aria-valuemin="0" 
      aria-valuemax="100"
    >
      <svg 
        viewBox={`${viewBoxCoordinateX} ${viewBoxCoordinateY} ${viewBoxTotalWidth} ${viewBoxTotalHeight}`} 
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      >
        {lineSegments.map((segment) => (
          <line
            key={segment.identifier}
            x1={segment.startX}
            y1={segment.startY}
            x2={segment.endX}
            y2={segment.endY}
            stroke={segment.segmentColor}
            strokeWidth="4"
            strokeLinecap="round" 
            style={{ transition: 'stroke 0.0s ease' }} 
          />
        ))}
        
        {/* Main Percentage Text */}
        <text 
          x={centerCoordinateX} 
          y={centerCoordinateY - 20}
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="3.5rem" 
          fontWeight="800" 
          fill="var(--black-color)" // Textul principal să fie mereu contrastant
          style={{ fontFamily: 'inherit' }}
        >
          {Math.round(currentAnimatedPercentage)}%
        </text>
        
        {/* "0" Label */}
        <text 
          x={firstSegment.endX + 10} 
          y={firstSegment.endY + 20} 
          textAnchor="middle" 
          fontSize="14px" 
          fontWeight="600"
          fill="#94a3b8" // Un gri mai modern pentru etichete
          style={{ fontFamily: 'inherit' }}
        >
          0
        </text>

        {/* "100" Label */}
        <text 
          x={lastSegment.endX - 10} 
          y={lastSegment.endY + 20} 
          textAnchor="middle" 
          fontSize="14px" 
          fontWeight="600"
          fill="#94a3b8"
          style={{ fontFamily: 'inherit' }}
        >
          100
        </text>
      </svg>
    </div>
  );
};

export default RadialGaugeComponent;