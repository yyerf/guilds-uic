import { Box, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const GravityBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  // Floating animation
  const float = keyframes`
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-20px) translateX(10px) rotate(90deg);
    }
    50% {
      transform: translateY(-10px) translateX(-15px) rotate(180deg);
    }
    75% {
      transform: translateY(-30px) translateX(5px) rotate(270deg);
    }
    100% {
      transform: translateY(0px) translateX(0px) rotate(360deg);
    }
  `;

  // Gravity fall animation
  const gravityFall = keyframes`
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  `;

  // Drift animation for subtle movement
  const drift = keyframes`
    0%, 100% {
      transform: translateX(0px) translateY(0px);
    }
    25% {
      transform: translateX(15px) translateY(-10px);
    }
    50% {
      transform: translateX(-10px) translateY(5px);
    }
    75% {
      transform: translateX(20px) translateY(-15px);
    }
  `;

  useEffect(() => {
    const colors = [
      'rgba(102, 126, 234, 0.3)',
      'rgba(118, 75, 162, 0.3)',
      'rgba(255, 255, 255, 0.2)',
      'rgba(0, 87, 255, 0.3)',
      'rgba(255, 246, 234, 0.4)',
    ];

    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 20, // 20-100px
      opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
      delay: Math.random() * 20, // 0-20s delay
      duration: Math.random() * 15 + 10, // 10-25s duration
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setParticles(newParticles);

    // Add new falling particles periodically
    const interval = setInterval(() => {
      const fallingParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 60 + 30,
        opacity: Math.random() * 0.3 + 0.2,
        delay: 0,
        duration: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setParticles(prev => [...prev.slice(-20), fallingParticle]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflow="hidden"
      pointerEvents="none"
      zIndex="0"
    >
      {/* Floating particles */}
      {particles.slice(0, 15).map((particle) => (
        <Box
          key={`float-${particle.id}`}
          position="absolute"
          left={`${particle.x}%`}
          top={`${particle.y}%`}
          width={`${particle.size}px`}
          height={`${particle.size}px`}
          borderRadius="50%"
          background={`radial-gradient(circle, ${particle.color}, transparent 70%)`}
          filter="blur(1px)"
          animation={`${float} ${particle.duration}s ease-in-out infinite`}
          opacity={particle.opacity}
          sx={{
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Drifting elements */}
      {particles.slice(15, 20).map((particle) => (
        <Box
          key={`drift-${particle.id}`}
          position="absolute"
          left={`${particle.x}%`}
          top={`${particle.y}%`}
          width={`${particle.size * 0.7}px`}
          height={`${particle.size * 0.7}px`}
          borderRadius="30%"
          background={particle.color}
          filter="blur(2px)"
          animation={`${drift} ${particle.duration}s ease-in-out infinite`}
          opacity={particle.opacity * 0.8}
          transform="rotate(45deg)"
          sx={{
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Falling gravity particles */}
      {particles.slice(20).map((particle) => (
        <Box
          key={`gravity-${particle.id}`}
          position="absolute"
          left={`${particle.x}%`}
          top="-100px"
          width={`${particle.size * 0.5}px`}
          height={`${particle.size * 0.5}px`}
          borderRadius="50%"
          background={`linear-gradient(45deg, ${particle.color}, transparent)`}
          filter="blur(0.5px)"
          animation={`${gravityFall} ${particle.duration}s linear infinite`}
          opacity={particle.opacity}
          sx={{
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Subtle gradient overlay for depth */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                   radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                   radial-gradient(circle at 40% 70%, rgba(0, 87, 255, 0.05) 0%, transparent 50%)"
        pointerEvents="none"
      />
    </Box>
  );
};

export default GravityBackground;
