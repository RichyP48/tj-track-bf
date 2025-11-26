import React, { useState, useEffect } from 'react';

export function SeasonalParticles() {
  const [season, setSeason] = useState<"winter" | "spring" | "summer" | "fall">("winter")

  useEffect(() => {
    const month = new Date().getMonth()
    if (month >= 11 || month <= 1) setSeason("winter")
    else if (month >= 2 && month <= 4) setSeason("spring")
    else if (month >= 5 && month <= 7) setSeason("summer")
    else setSeason("fall")
  }, [])

  return (
    <>
      {/* Snow particles - Winter (Dec, Jan, Feb) */}
      {season === "winter" && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <style>{`
              @keyframes snowfall {
                0% { transform: translateY(-50px) translateX(0); opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(850px) translateX(50px); opacity: 0; }
              }
              @keyframes snowfall-slow {
                0% { transform: translateY(-50px) translateX(0); opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(850px) translateX(-30px); opacity: 0; }
              }
              .snow { animation: snowfall 8s linear infinite; }
              .snow-slow { animation: snowfall-slow 12s linear infinite; }
            `}</style>
          </defs>

          {/* Generate snowflakes */}
          {Array.from({ length: 30 }).map((_, i) => (
            <g
              key={i}
              className={i % 2 === 0 ? "snow" : "snow-slow"}
              style={{
                animationDelay: `${Math.random() * 8}s`,
              }}
            >
              <circle cx={Math.random() * 1200} cy="0" r="2" fill="white" opacity="0.8" />
              <circle cx={Math.random() * 1200 + 10} cy="5" r="1.5" fill="white" opacity="0.6" />
              <circle cx={Math.random() * 1200 - 10} cy="5" r="1.5" fill="white" opacity="0.6" />
            </g>
          ))}
        </svg>
      )}

      {/* Falling leaves - Fall (Sep, Oct, Nov) */}
      {season === "fall" && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <style>{`
              @keyframes leaffall {
                0% { 
                  transform: translateY(-50px) translateX(0) rotateZ(0deg); 
                  opacity: 1; 
                }
                90% { opacity: 1; }
                100% { 
                  transform: translateY(850px) translateX(100px) rotateZ(360deg); 
                  opacity: 0; 
                }
              }
              @keyframes leaffall-alt {
                0% { 
                  transform: translateY(-50px) translateX(0) rotateZ(0deg); 
                  opacity: 1; 
                }
                90% { opacity: 1; }
                100% { 
                  transform: translateY(850px) translateX(-100px) rotateZ(-360deg); 
                  opacity: 0; 
                }
              }
              .leaf { animation: leaffall 10s linear infinite; }
              .leaf-alt { animation: leaffall-alt 12s linear infinite; }
            `}</style>
          </defs>

          {/* Generate falling leaves */}
          {Array.from({ length: 20 }).map((_, i) => {
            const colors = ["#DC2626", "#EA580C", "#F97316", "#FBBF24"]
            const color = colors[i % colors.length]
            return (
              <g
                key={i}
                className={i % 2 === 0 ? "leaf" : "leaf-alt"}
                style={{
                  animationDelay: `${Math.random() * 10}s`,
                }}
              >
                {/* Leaf shape */}
                <path
                  d="M10,0 Q15,5 10,10 Q5,5 10,0"
                  fill={color}
                  opacity="0.8"
                  transform={`translate(${Math.random() * 1200}, 0)`}
                />
              </g>
            )
          })}
        </svg>
      )}
    </>
  )
}
