import React from "react";

export default ({ wordCount, size }) => {
  const percentage = (wordCount / 30) * 100;
  const radius = size;
  const strokeWidth = radius / 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const backgroundStyle = {
    strokeDashoffset,
    stroke:
      wordCount < 30
        ? "var(--ash)"
        : wordCount < 40
        ? "var(--peach)"
        : "transparent"
  };
  const progressStyle = {
    strokeDashoffset,
    stroke:
      wordCount < 20
        ? "var(--blue)"
        : wordCount < 30
        ? "var(--tangerine)"
        : wordCount < 40
        ? "var(--peach)"
        : "transparent"
  };
  const textStyle = { fill: wordCount < 30 ? "var(--ash)" : "var(--peach)" };
  return (
    <div id="circular-progress-bar">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="circle-background"
          strokeWidth={strokeWidth + 1}
          style={backgroundStyle}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="circle-progress"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={progressStyle}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dy=".3rem"
          textAnchor="middle"
          style={textStyle}
        >
          {30 - wordCount}
        </text>
      </svg>
    </div>
  );
};
