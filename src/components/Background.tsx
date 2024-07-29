import React, { useRef, useEffect } from 'react';
import './Background.css';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d');
    const width = canvas!.width;
    const height = canvas!.height;

    const gradientColors = [
      'rgba(255, 192, 203, 0.5)', // light pink
      'rgba(173, 216, 230, 0.5)', // light blue
      'rgba(255, 228, 181, 0.5)', // light peach
      'rgba(221, 160, 221, 0.5)', // plum
      'rgba(240, 248, 255, 0.5)'  // alice blue
    ];

    const particles: { x: number, y: number, vx: number, vy: number, color: string }[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: gradientColors[Math.floor(Math.random() * gradientColors.length)],
      });
    }

    const animate = () => {
      ctx!.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, width / 6);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, width / 6, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="background-canvas" />;
};

export default Background;
