export function Logo({ className }: { className?: string }) {
    return (
      <svg 
        viewBox="0 0 100 60" 
        className={className}
        width="120"
        height="40"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FFD700' }} />
            <stop offset="100%" style={{ stopColor: '#FFA500' }} />
          </linearGradient>
        </defs>
        <path
          d="M10 30C10 20 20 10 30 10C40 10 45 20 45 30C45 40 40 50 30 50C20 50 10 40 10 30Z"
          fill="url(#goldGradient)"
        />
        <text
          x="50"
          y="35"
          fontFamily="serif"
          fontSize="24"
          fill="url(#goldGradient)"
          fontWeight="bold"
        >
          A-N
        </text>
      </svg>
    )
  }
  
  