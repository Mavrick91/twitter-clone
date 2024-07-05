type CharacterCounterProps = {
  count: number;
  limit?: number;
};

const CharacterCounter = ({ count, limit = 280 }: CharacterCounterProps) => {
  const remaining = limit - count;
  const percentage = (count / limit) * 100;

  let color = '#1D9BF0';
  if (remaining <= 20 && remaining > 0) {
    color = 'yellow';
  } else if (remaining === 0) {
    color = 'red';
  }

  // Adjusted calculations for the smaller size
  const size = 22;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2F3336"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  );
};

export default CharacterCounter;
