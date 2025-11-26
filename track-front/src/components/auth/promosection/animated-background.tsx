import { SeasonalParticles } from "./seasonal-particules"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052CC" stopOpacity="1" />
            <stop offset="50%" stopColor="#0066FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
          </linearGradient>

          <style>{`
            @keyframes wave1 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(100px) translateY(-20px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes wave2 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(-80px) translateY(15px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes wave3 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(120px) translateY(10px); }
              100% { transform: translateX(0) translateY(0); }
            }
            .wave-1 { animation: wave1 8s ease-in-out infinite; }
            .wave-2 { animation: wave2 10s ease-in-out infinite; }
            .wave-3 { animation: wave3 12s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Base gradient background */}
        <rect width="1200" height="800" fill="url(#grad1)" />

        {/* Wave Layer 1 */}
        <g className="wave-1" opacity="0.7">
          <path
            d="M0,300 Q300,200 600,300 T1200,300 L1200,400 Q900,500 600,400 T0,400 Z"
            fill="#0066FF"
            opacity="0.6"
          />
        </g>

        {/* Wave Layer 2 */}
        <g className="wave-2" opacity="0.5">
          <path
            d="M0,250 Q300,150 600,250 T1200,250 L1200,500 Q900,600 600,500 T0,500 Z"
            fill="#3B82F6"
            opacity="0.5"
          />
        </g>

        {/* Wave Layer 3 */}
        <g className="wave-3" opacity="0.4">
          <path
            d="M0,350 Q300,280 600,350 T1200,350 L1200,600 Q900,650 600,600 T0,600 Z"
            fill="#60A5FA"
            opacity="0.4"
          />
        </g>

        {/* Top accent waves */}
        <g opacity="0.8">
          <path d="M0,0 Q200,50 400,20 T800,40 T1200,10 L1200,150 Q600,100 0,150 Z" fill="#1E3A8A" opacity="0.3" />
        </g>

        {/* Subtle light accents */}
        <g opacity="0.2">
          <path d="M0,100 Q300,50 600,120 T1200,100 L1200,200 Q900,150 600,180 T0,200 Z" fill="#BFDBFE" opacity="0.3" />
        </g>
      </svg>

      <SeasonalParticles />
    </div>
  )
}
