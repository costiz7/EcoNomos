import React, { useMemo, useState, useEffect } from 'react';

const RadialGaugeComponent = ({ targetPercentage = 100, totalSegments = 60 }) => {
  const [currentAnimatedPercentage, setCurrentAnimatedPercentage] = useState(0);

  // --- 1. GEOMETRIC CONFIGURATION ---
  // The center coordinates and radii control the entire drawing
  const centerCoordinateX = 175;
  const centerCoordinateY = 175; 
  const outerRadius = 150;
  const innerRadius = 125;
  
  const startingAngleInDegrees = -180; 
  const endingAngleInDegrees = 0;
  
  const totalAngleSpanInDegrees = Math.abs(endingAngleInDegrees - startingAngleInDegrees); 
  const degreesPerSegment = totalAngleSpanInDegrees / (totalSegments - 1);
  
  // Helper function to convert degrees to radians (required by Math.sin/Math.cos)
  const convertDegreesToRadians = (angleInDegrees) => {
    return angleInDegrees * (Math.PI / 180);
  };

  // --- 2. ANIMATION ENGINE ---
  useEffect(() => {
    // If we have already reached the target percentage, do not start the animation
    if (currentAnimatedPercentage === targetPercentage) return;

    let animationFrameIdentifier;
    let animationStartTime = null;
    const animationDurationInMilliseconds = 600;
    const startingPercentageValue = currentAnimatedPercentage;

    const executeAnimationStep = (currentTimestamp) => {
      if (!animationStartTime) {
        animationStartTime = currentTimestamp;
      }
      
      // Raw time progress (from 0.00 to 1.00)
      const rawAnimationProgress = Math.min((currentTimestamp - animationStartTime) / animationDurationInMilliseconds, 1);
      
      // Smoothed progress (cubic ease-out deceleration effect at the end)
      const smoothedAnimationProgress = 1 - Math.pow(1 - rawAnimationProgress, 3);
      
      // Calculate the intermediate percentage value for the current frame
      const newlyCalculatedPercentage = startingPercentageValue + (targetPercentage - startingPercentageValue) * smoothedAnimationProgress;
      
      setCurrentAnimatedPercentage(newlyCalculatedPercentage);

      // If the animation is not complete, request the next frame
      if (rawAnimationProgress < 1) {
        animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
      }
    };

    // Start the animation loop
    animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
    
    // Cleanup on component unmount to prevent memory leaks or state updates on unmounted components
    return () => cancelAnimationFrame(animationFrameIdentifier);
    
  }, [targetPercentage]); 

  // --- 3. SEGMENTS (TICKS) CALCULATION ---
  const lineSegments = useMemo(() => {
    // Determine how many segments should be active (colored) based on the current animated percentage
    const activeSegmentsCount = Math.round((currentAnimatedPercentage / 100) * totalSegments);
    const calculatedSegmentsArray = [];
    
    for (let segmentIndex = 0; segmentIndex < totalSegments; segmentIndex++) {
      const currentAngleInDegrees = startingAngleInDegrees + segmentIndex * degreesPerSegment;
      const currentAngleInRadians = convertDegreesToRadians(currentAngleInDegrees);
      
      const isSegmentActive = segmentIndex < activeSegmentsCount;

      calculatedSegmentsArray.push({
        identifier: segmentIndex,
        // Calculate X and Y coordinates for the start and end of each segment using trigonometry
        startX: centerCoordinateX + innerRadius * Math.cos(currentAngleInRadians),
        startY: centerCoordinateY + innerRadius * Math.sin(currentAngleInRadians),
        endX: centerCoordinateX + outerRadius * Math.cos(currentAngleInRadians),
        endY: centerCoordinateY + outerRadius * Math.sin(currentAngleInRadians),
        segmentColor: isSegmentActive ? "rgb(0, 0, 0)" : "#d2d2d2"
      });
    }
    return calculatedSegmentsArray;
  }, [currentAnimatedPercentage, totalSegments, degreesPerSegment]);

  // Prevent rendering if segments haven't been calculated yet
  if (lineSegments.length === 0) return null;

  const firstSegment = lineSegments[0];
  const lastSegment = lineSegments[lineSegments.length - 1];

  // --- 4. AUTO-ADAPTIVE CROPPING (DYNAMIC VIEWBOX) ---
  const viewBoxPadding = 15; 
  const bottomTextSpacing = 30; 

  // Calculate a tight bounding box around the gauge to eliminate unnecessary whitespace
  const viewBoxCoordinateX = centerCoordinateX - outerRadius - viewBoxPadding;
  const viewBoxCoordinateY = centerCoordinateY - outerRadius - viewBoxPadding;
  const viewBoxTotalWidth = (outerRadius * 2) + (viewBoxPadding * 2);
  const viewBoxTotalHeight = outerRadius + viewBoxPadding + bottomTextSpacing;

  return (
    <div className="gauge-frame" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
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
            style={{ transition: 'stroke 0s ease' }} 
          />
        ))}
        
        {/* Main Percentage Text */}
        <text 
          x={centerCoordinateX} 
          y={centerCoordinateY - 30}
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="3rem" 
          fontWeight="700" 
          fill="#333"
          style={{ fontFamily: 'sans-serif' }}
        >
          {Math.round(currentAnimatedPercentage)}%
        </text>
        
        {/* "0" Label */}
        <text 
          x={firstSegment.endX + 10} 
          y={firstSegment.endY + 20} 
          textAnchor="middle" 
          fontSize="14px" 
          fill="#a0aab0"
          style={{ fontFamily: 'sans-serif' }}
        >
          0
        </text>

        {/* "100" Label */}
        <text 
          x={lastSegment.endX - 10} 
          y={lastSegment.endY + 20} 
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