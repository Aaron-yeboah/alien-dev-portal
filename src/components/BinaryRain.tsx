import { useEffect, useRef } from "react";

interface BinaryRainProps {
  intensity?: number;
}

const BinaryRain = ({ intensity = 50 }: BinaryRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * canvas.height / fontSize);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 12, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color intensity based on prop
      const greenVal = Math.floor(150 + (intensity * 1.05));
      ctx.fillStyle = `rgba(57, ${Math.min(255, greenVal)}, 20, ${0.05 + (intensity / 1000)})`;
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // Speed based on intensity
        drops[i] += 0.2 + (intensity / 100);
      }
    };

    const interval = setInterval(draw, 30);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.3 + (intensity / 200) }}
    />
  );
};

export default BinaryRain;
