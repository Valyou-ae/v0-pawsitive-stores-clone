export function GenmockLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#FF7A66" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#049BB0" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Outer Circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.1" />

      {/* Abstract "G" Shape - Modern and Geometric */}
      <path
        d="M 50 15 
           A 35 35 0 1 1 50 85 
           L 50 65
           A 15 15 0 1 0 50 35
           L 70 35
           L 70 50
           L 60 50"
        stroke="url(#logoGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner Sparkle/Magic Effect */}
      <circle cx="50" cy="50" r="5" fill="url(#innerGradient)" opacity="0.8" />
      <path
        d="M 50 42 L 50 38 M 58 50 L 62 50 M 50 58 L 50 62 M 42 50 L 38 50"
        stroke="#FF7A66"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
