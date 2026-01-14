'use client';
import { useEffect, useRef } from 'react';

export function ElectricBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        interface Bolt {
            x: number;
            y: number;
            segments: { x: number, y: number }[];
            life: number;
            color: string;
            width: number;
        }

        let bolts: Bolt[] = [];
        let frame = 0;

        // Secondary System: Sparks
        interface Spark {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            color: string;
        }
        let sparks: Spark[] = [];

        function createBolt(sourcex: number, sourcey: number, length: number) {
            const segments = [{ x: sourcex, y: sourcey }];
            let currX = sourcex;
            let currY = sourcey;

            for (let i = 0; i < length; i++) {
                currX += (Math.random() - 0.5) * 50;
                currY -= Math.random() * 20 + 10;
                segments.push({ x: currX, y: currY });

                // Chance to spawn sparks at segment points
                if (Math.random() > 0.7) {
                    for (let j = 0; j < 3; j++) {
                        sparks.push({
                            x: currX,
                            y: currY,
                            vx: (Math.random() - 0.5) * 10, // Explode out
                            vy: (Math.random() - 0.5) * 10,
                            life: Math.random() * 20 + 10,
                            color: '#FFD700' // Gold/Yellow Sparks
                        });
                    }
                }
            }

            return {
                x: sourcex,
                y: sourcey,
                segments,
                life: Math.random() * 15 + 10, // Slower (Longer life)
                color: Math.random() > 0.4 ? '#4da6ff' : '#0099ff', // Sky Blue / Deep Sky Blue
                width: Math.random() * 3 + 2
            };
        }

        const animate = () => {
            frame++;

            // Randomly spawn bolts
            if (frame % 60 === 0) {
                bolts.push(createBolt(Math.random() * canvas.width, canvas.height + 20, 20));
            }

            // Clear completely
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'screen';

            // DRAW PASS 1: Colored Glow (Blurred)
            ctx.shadowBlur = 15;
            bolts.forEach((bolt) => {
                ctx.beginPath();
                ctx.strokeStyle = bolt.color;
                ctx.shadowColor = bolt.color;
                ctx.lineWidth = bolt.width * 2; // Wider than core

                ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
                for (let i = 1; i < bolt.segments.length; i++) {
                    ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
                }
                ctx.stroke();
            });
            ctx.shadowBlur = 0; // Reset blur for core

            // DRAW PASS 2: White Core (Sharp)
            bolts.forEach((bolt, index) => {
                ctx.beginPath();
                ctx.strokeStyle = '#FFFFFF'; // Pure White Core
                ctx.lineWidth = 2; // Thin, sharp line

                ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
                for (let i = 1; i < bolt.segments.length; i++) {
                    ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
                }
                ctx.stroke();

                bolt.life--;
                if (bolt.life <= 0) bolts.splice(index, 1);
            });

            // Draw Sparks
            sparks.forEach((spark, index) => {
                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.life--;
                spark.vx *= 0.9;
                spark.vy *= 0.9;

                // Draw sparks as sharp white dots with gold rim? Just gold for now.
                ctx.fillStyle = spark.color;
                ctx.beginPath();
                ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2);
                ctx.fill();

                if (spark.life <= 0) sparks.splice(index, 1);
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-xl opacity-80 mix-blend-screen pointer-events-none"
        />
    );
}
