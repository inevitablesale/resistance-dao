
import { useEffect, useState } from 'react';

interface SpaceSceneProps {
  scrollProgress: number;
}

export const SpaceScene = ({ scrollProgress }: SpaceSceneProps) => {
  return (
    <div className="absolute inset-0">
      {/* Deep space background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)',
          opacity: 0.98
        }}
      />
      
      {/* Quantum effects */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${30 + scrollProgress * 20}% ${70 - scrollProgress * 20}%, rgba(64, 156, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${70 - scrollProgress * 20}% ${60 + scrollProgress * 20}%, rgba(147, 51, 255, 0.1) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(0, 255, 255, ${0.05 + scrollProgress * 0.1}) 0%, transparent 55%)
          `,
          animation: 'quantumField 30s ease-in-out infinite'
        }}
      />
      
      {/* Interactive Star Field */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at ${10 + scrollProgress * 20}% ${10 + scrollProgress * 20}%, rgba(255, 255, 255, 0.8) 100%, transparent),
            radial-gradient(2px 2px at ${20 + scrollProgress * 30}% ${20 - scrollProgress * 20}%, rgba(0, 255, 255, 0.7) 100%, transparent),
            radial-gradient(1.5px 1.5px at ${30 - scrollProgress * 20}% ${30 + scrollProgress * 30}%, rgba(147, 51, 255, 0.8) 100%, transparent)
          `,
          transform: `translateY(${scrollProgress * -50}px) scale(${1 + scrollProgress * 0.2})`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Destination Planet */}
      <div
        className="absolute"
        style={{
          right: `${20 - scrollProgress * 10}%`,
          bottom: `${20 - scrollProgress * 10}%`,
          width: `${300 + scrollProgress * 400}px`,
          height: `${300 + scrollProgress * 400}px`,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%,
              rgba(64, 156, 255, 0.8),
              rgba(147, 51, 255, 0.6) 40%,
              rgba(0, 255, 255, 0.4) 80%
            )
          `,
          boxShadow: `
            0 0 100px rgba(64, 156, 255, 0.3),
            0 0 200px rgba(147, 51, 255, 0.2) inset
          `,
          transform: `scale(${1 + scrollProgress * 0.5})`,
          opacity: Math.max(0.2, Math.min(1, 1 - scrollProgress * 1.5))
        }}
      >
        {/* Atmospheric Effects */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 50% 50%,
                transparent 50%,
                rgba(0, 255, 255, ${0.1 + scrollProgress * 0.2}) 60%,
                transparent 70%
              )
            `,
            animation: 'atmosphericPulse 8s ease-in-out infinite'
          }}
        />
      </div>

      {/* The Ark - Main Ship */}
      <div
        className="absolute animate-quantum-ship"
        style={{
          left: `${50 - scrollProgress * 20}%`,
          top: `${40 + scrollProgress * 10}%`,
          width: '300px',
          height: '100px',
          background: `
            linear-gradient(${45 + scrollProgress * 45}deg, 
              rgba(64, 156, 255, 0.9) 0%,
              rgba(147, 51, 255, 0.8) 50%,
              rgba(0, 255, 255, 0.7) 100%
            )
          `,
          boxShadow: `
            0 0 ${40 + scrollProgress * 20}px rgba(64, 156, 255, 0.3),
            0 0 ${80 + scrollProgress * 40}px rgba(147, 51, 255, 0.2),
            0 0 ${120 + scrollProgress * 60}px rgba(0, 255, 255, 0.1)
          `,
          clipPath: 'polygon(0 50%, 25% 0, 85% 0, 100% 50%, 85% 100%, 25% 100%)',
          transform: `
            rotate(${-15 + scrollProgress * 30}deg)
            scale(${1 + scrollProgress * 0.3})
          `,
          transition: 'transform 0.3s ease-out',
          zIndex: 10
        }}
      />

      {/* Guardian Ships */}
      {[...Array(3)].map((_, index) => (
        <div
          key={`guardian-${index}`}
          className="absolute"
          style={{
            left: `${30 + index * 20 - scrollProgress * (15 + index * 5)}%`,
            top: `${35 + index * 10 + scrollProgress * (10 - index * 2)}%`,
            width: '150px',
            height: '50px',
            background: `
              linear-gradient(${45 + scrollProgress * 45}deg, 
                rgba(147, 51, 255, 0.9) 0%,
                rgba(0, 255, 255, 0.8) 50%,
                rgba(64, 156, 255, 0.7) 100%
              )
            `,
            boxShadow: `
              0 0 ${30 + scrollProgress * 15}px rgba(147, 51, 255, 0.3),
              0 0 ${60 + scrollProgress * 30}px rgba(0, 255, 255, 0.2)
            `,
            clipPath: 'polygon(0 50%, 15% 0, 95% 0, 100% 50%, 95% 100%, 15% 100%)',
            transform: `
              rotate(${-15 + scrollProgress * (20 - index * 5)}deg)
              scale(${1 + scrollProgress * 0.2})
            `,
            transition: 'transform 0.3s ease-out',
            zIndex: 5
          }}
        />
      ))}
    </div>
  );
};

