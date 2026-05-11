import { useMemo, useState, useEffect } from 'react';
import './RadialGaugeComponent.css';

const RadialGaugeComponent = ({ 
  targetPercentage = 0, 
  totalSegments = 60,
  color = "var(--black-color)", 
  inactiveColor = "#e2e8f0",
  width = "auto", // Container control
  height = "auto" // Container control
}) => {
  const [currentAnimatedPercentage, setCurrentAnimatedPercentage] = useState(0);
  const [delayedTarget, setDelayedTarget] = useState(0);

  // 1. Initial animation trigger & data readiness optimization
  useEffect(() => {
    // If there is no valid target percentage, reset and wait
    if (targetPercentage <= 0) {
        setDelayedTarget(0);
        return;
    }

    // Once data is available, set the actual target after a short delay
    const timeout = setTimeout(() => setDelayedTarget(targetPercentage), 50);
    
    return () => clearTimeout(timeout);
  }, [targetPercentage]); 
  // SVG Internal Coordinates
  const centerCoordinateX = 175;
  const centerCoordinateY = 175; 
  const outerRadius = 150;
  const innerRadius = 125;
  
  const startingAngleInDegrees = -180; 
  const endingAngleInDegrees = 0;
  
  const totalAngleSpanInDegrees = Math.abs(endingAngleInDegrees - startingAngleInDegrees); 
  const degreesPerSegment = totalAngleSpanInDegrees / (totalSegments - 1);
  
  const convertDegreesToRadians = (angleInDegrees) => angleInDegrees * (Math.PI / 180);

  // 2. Custom Animation Hook (now tracks the delayedTarget instead of raw targetPercentage)
  useEffect(() => {
    if (currentAnimatedPercentage === delayedTarget) return;

    let animationFrameIdentifier;
    let animationStartTime = null;
    const animationDurationInMilliseconds = 400;
    const startingPercentageValue = currentAnimatedPercentage;

    const executeAnimationStep = (currentTimestamp) => {
      if (!animationStartTime) animationStartTime = currentTimestamp;
      
      const rawAnimationProgress = Math.min((currentTimestamp - animationStartTime) / animationDurationInMilliseconds, 1);
      const smoothedAnimationProgress = 1 - Math.pow(1 - rawAnimationProgress, 3); // Cubic ease-out
      const newlyCalculatedPercentage = startingPercentageValue + (delayedTarget - startingPercentageValue) * smoothedAnimationProgress;
      
      setCurrentAnimatedPercentage(newlyCalculatedPercentage);

      if (rawAnimationProgress < 1) {
        animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
      }
    };

    animationFrameIdentifier = requestAnimationFrame(executeAnimationStep);
    return () => cancelAnimationFrame(animationFrameIdentifier);
    
  }, [delayedTarget, currentAnimatedPercentage]); 

  // 3. Calculate lines position and active state
  const lineSegments = useMemo(() => {
    // CAP THE VISUAL PERCENTAGE: Never draw more than 100%, even if the number goes higher
    const visualPercentage = Math.min(100, currentAnimatedPercentage);
    const activeSegmentsCount = Math.round((visualPercentage / 100) * totalSegments);
    
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
        segmentColor: isSegmentActive ? color : inactiveColor 
      });
    }
    return calculatedSegmentsArray;
  }, [currentAnimatedPercentage, totalSegments, degreesPerSegment, color, inactiveColor]);

  if (lineSegments.length === 0) return null;

  const firstSegment = lineSegments[0];
  const lastSegment = lineSegments[lineSegments.length - 1];

  // Dynamically calculate the perfect viewBox to frame the semicircle
  const viewBoxPadding = 15; 
  const bottomTextSpacing = 30; 
  const viewBoxCoordinateX = centerCoordinateX - outerRadius - viewBoxPadding;
  const viewBoxCoordinateY = centerCoordinateY - outerRadius - viewBoxPadding;
  const viewBoxTotalWidth = (outerRadius * 2) + (viewBoxPadding * 2);
  const viewBoxTotalHeight = outerRadius + viewBoxPadding + bottomTextSpacing;

  return (
    <div 
      className="gauge-frame"
      role="meter" 
      aria-valuenow={Math.round(currentAnimatedPercentage)} 
      aria-valuemin="0" 
      aria-valuemax="100"
      style={{ width: width, height: height }} // Control from props
    >
      <svg 
        viewBox={`${viewBoxCoordinateX} ${viewBoxCoordinateY} ${viewBoxTotalWidth} ${viewBoxTotalHeight}`} 
        preserveAspectRatio="xMidYMid meet"
        className="gauge-svg"
      >
        {lineSegments.map((segment) => (
          <line
            key={segment.identifier}
            x1={segment.startX}
            y1={segment.startY}
            x2={segment.endX}
            y2={segment.endY}
            stroke={segment.segmentColor}
            className="gauge-line"
          />
        ))}
        
        {/* Main Center Text (Can exceed 100) */}
        <text 
          x={centerCoordinateX} 
          y={centerCoordinateY - 20}
          className="gauge-text-main"
        >
          {Math.round(currentAnimatedPercentage)}%
        </text>
        
        {/* Min Label */}
        <text 
          x={firstSegment.endX + 10} 
          y={firstSegment.endY + 20} 
          className="gauge-text-label"
        >
          0%
        </text>

        {/* Max Label */}
        <text 
          x={lastSegment.endX - 10} 
          y={lastSegment.endY + 20} 
          className="gauge-text-label"
        >
          100%
        </text>
      </svg>
    </div>
  );
};

export default RadialGaugeComponent;